

/*  This visualization was made possible by modifying code provided by:

http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922 */




//Create SVG element and append map to the SVG


function drawMap(container_width) {

	d3.csv("data.csv", function(data) {

	  d3.json("us-states.json", function(json) {
	    for (var i = 0; i < data.length; i++) {
	      var dataState = data[i].state;
	      var dataAbbr = data[i].abbr;
	      var dataLink = data[i].link;

	      for (var j = 0; j < json.features.length; j++)  {
	        var jsonState = json.features[j].properties.name;
	        if (dataState == jsonState) {
	        // Copy the data value into the JSON
	        json.features[j].properties.abbr = dataAbbr; 
	        json.features[j].properties.link= dataLink;

	        // Stop looking through the JSON
	        break;
	        }
	      }
	      
	    }
  var IS_MOBILE = d3.select("#isMobile").style("display") ==  "block";
  var IS_PHONE = d3.select("#isPhone").style("display") == "block";

  //Width and height of map
    $mapContainer = $("#map-container")
    $chartContainer = $("#chart-container")
    $tooltipHeader = $(".tooltip-container")
    $mapContainer.empty();
    $tooltipHeader.empty();
    aspect_width = 12;
    aspect_height = 3.5;
    margin = { top: 20, right: 20, bottom: 20, left: 20 };
    width= (container_width > 680) ? 680 - margin.left - margin.right : container_width - margin.left - margin.right;
    height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom;
    mapHeight = height*1.5
// D3 Projection
    var projection = d3.geoAlbersUsa()
               .translate([width/2, mapHeight/2])    // translate to center of screen
               .scale([width/1.2]);          // scale things down so see entire US
            
    // Define path generator
    var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
             .projection(projection);  // tell path generator to use albersUsa projection

    mapSvg = d3.select("#map-container")
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", mapHeight + margin.top + margin.bottom);
    var mapG  = mapSvg.append("g")
      .attr("class", "mapG")
      .attr("transform", "translate(0," + height*.1 + ")")

    // Bind the data to the SVG and create one path per GeoJSON feature
    var states = mapG.selectAll("path")
    	.data(json.features)
    	.enter()
    	.append("svg:a")    
      .attr("xlink:href", function(d) {
        	return d.properties.link
      })
      .attr('target','_blank')
    	.append("path")
    	.attr("d", path)
    	.attr("class", function(d) {
    		return "state " + d.properties.abbr;
    	})
    	.style("stroke", "#fff")
    	.style("stroke-width", "1")

  //ADD LEADER LINE FOR DC
    var dcData = json.features.filter(function(d) {return d.properties.name == "District of Columbia"})

    var dcLine1 = mapSvg.append("line")
      .attr("x1", .764*(width))
      .attr("y1", .238*(width))
      .attr("x2", .835*(width))
      .attr("y2", .238*(width))
      .attr("stroke-width", 1.2)
      .attr("stroke", "#ec008b")
    var dcLine2 = mapSvg.append("line")
      .attr("x1", .835*(width))
      .attr("y1", .238*(width))
      .attr("x2", .835*(width))
      .attr("y2", function() {
        if (IS_PHONE){
          return .26*(width)
      } else { 
        return .22*(width)}
      })
      .attr("stroke-width", 1.2)
      .attr("stroke", "#ec008b")
    var dcText = mapSvg.append("a")
      .attr("xlink:href", "http://www.dchfa.org")
      .attr('target','_blank')
      .data(dcData)
      .append("text")
      .text(function(d) { 
      if (IS_PHONE) {
        return "District of";
      } else {
        return d.properties.name; }
      })
      .attr("x", .8*(width))
      .attr("y", function() { 
        if (IS_PHONE) {
          return .28*(width)
        } else { 
          return .215*(width)}
        })
      .attr("class", "state-label state")    
    var dcText2= mapSvg.append("a")
      .attr("xlink:href", "http://www.dchfa.org")
      .attr('target','_blank')
      .data(dcData)
      .append("text")
      .text(function(d) { 
        if (IS_PHONE) {
          return "Columbia"}
          else {return ""}
        })
      .attr("x", .8*(width))
      .attr("y", .303*(width))
      .attr("class", "state-label state")    
  //STATE TOOLTIP


    var tooltip = d3.select(".tooltip-container")


    var region = tooltip.append('div')
    	.attr('class', 'region-text')
    region.append('div')
    	.attr('class', 'tooltip-title')
    	.text('STATE')

    function selectState(selectedState) {
    d3.selectAll(".state")
      .classed('deselected', true)
      .classed('selected', false)
    d3.select(".state." + selectedState)
      .classed('selected', true)
      .classed("deselected", false)
    }

    d3.selectAll(".state")
    	.on("mouseover", function (d) {
               dispatch.call("hoverState", this, (d3.select(this).attr('class')))
            })
    	.on("mouseout", function (d) {
               dispatch.call("dehoverState")
            })

    var dispatch = d3.dispatch("hoverState", "dehoverState");

    region.append("div")
    		.attr('class', 'tooltip-data')
        .text("Click on a state")


    dispatch.on("hoverState", function (selectedState) {
            var stateName = d3.select(this).datum().properties.name
            selectState(selectedState);
            d3.select(".tooltip-data")
    	     	.html(stateName)
          });
    dispatch.on("dehoverState", function() {
          d3.select(".tooltip-data")
          .html("Click on a state")
    })


    //VARIABLE DROPDOWN MENU
    var dropdownData = d3.keys(data[0])
    var dropdownDataFiltered = dropdownData.filter(function(d){
      return d != "state" && d != "abbr" && d != "link"
    })
    var defaultOptionName = ""
    var dropdown = tooltip.append('div')
          .attr('class', 'dropdown-text')
    // dropdown.append('div')
    //       .attr('class', 'tooltip-title')
        //  .text('SELECT A STATE')
    var dropdownMenu =dropdown.append('div')
          .attr('class', 'dropdown-container')
          .append("select")
          // .attr("onChange", "window.open(this.link, '_blank') ")
          .selectAll("option")
          .data(dropdownDataFiltered)
          .enter()
          .append("option")
          .text(function(d, i) {
            // data.forEach(function(row) {
              return dropdownData[i]
            // })
          })
          .attr("value", function(d,i) {
            return dropdownData[i]
          })
    d3.select('select')
          .append("option")
          .text("Select a category")
          .attr("value","")
          .attr("selected", "selected")
          .attr("disabled", "disabled")
          .attr("hidden", "hidden")
    
    //ADD BAR GRAPH

    var graphData = data.filter(function(d) {
      return d.abbr != ""
    })
    var graphHeight = height*.7,
        x = d3.scaleBand().rangeRound([0, width]).padding(0.15),
        y = d3.scaleLinear().rangeRound([graphHeight, 0]);
    x.domain(graphData.map(function(d) { return d.abbr; }));
    y.domain([0, d3.max(graphData, function(d) { return d.cs; })]);

    barSvg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    var barG  = barSvg.append("g")
      .attr("class", "mapG")
      .attr("transform", "translate("+ 20 +","+height/5+")")

    barG.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + graphHeight + ")")
      .call(d3.axisBottom(x));

    barG.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Units");

    barG.selectAll(".bar")
      .data(graphData)
      .enter().append("rect")
        .attr("class", function(d) {
          return "bar bar-" + d.abbr
        })
        .attr("x", function(d) { return x(d.abbr) })
        .attr("y", function(d) { return y(d.cs); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {return graphHeight - y(d.cs); });
  });

})
}

var pymChild = new pym.Child({ renderCallback: drawMap, polling: 500 });