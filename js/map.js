

/*  This visualization was made possible by modifying code provided by:

http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922 */




//Create SVG element and append map to the SVG
var MAXVALUE = {"cs": 800, "homevalue": 600000, "fthb": .7, "origltv": 100, "dti": 40, "orignoterate": 4, "conv": 1, "fha": .4, "va": .35, "ltv_fico": .4, "hfa_agencies": 300, "total": 70 }
var FORMAT = {"cs": d3.format(""), "homevalue": d3.format(".0s"), "fthb": d3.format(""), "origltv": d3.format(""), "dti": d3.format(""), "orignoterate": d3.format(""), "conv": d3.format(""), "fha": d3.format(""), "va": d3.format(""), "ltv_fico": d3.format(""), "hfa_agencies": d3.format(""), "total": d3.format("") }
var TICKS = {"cs": 5, "homevalue": 7, "fthb": 8, "origltv":6, "dti":5, "orignoterate": 5, "conv": 6, "fha": 5, "va": 4, "ltv_fico": 5, "hfa_agencies": 4, "total":8  }
var SELECTED_VARIABLE = "cs";
function drawMap(container_width) {

	d3.csv("data.csv", function(data) {

	  d3.json("us-states.json", function(json) {
	    for (var i = 0; i < data.length; i++) {
	      var dataState = data[i].state;
	      var dataAbbr = data[i].abbr;
	      var dataLink = data[i].link;
        var data_homevalue = data[i].homevalue;
        var data_fthb = data[i].fthb;
        var data_cs = data[i].cs;
        var data_origltv = data[i].origltv;
        var data_dti = data[i].dti;
        var data_orignoterate = data[i].orignoterate;
        var data_conv = data[i].conv;
        var data_fha = data[i].fha;
        var data_va = data[i].va;
        var data_ltv_fico = data[i].ltv_fico;
        var data_hfa_agencies = data[i].hfa_agencies;
        var data_total = data[i].total;

	      for (var j = 0; j < json.features.length; j++)  {
	        var jsonState = json.features[j].properties.name;
	        if (dataState == jsonState) {
	        // Copy the data value into the JSON
	        json.features[j].properties.abbr = dataAbbr; 
	        json.features[j].properties.link= dataLink;
          json.features[j].properties.state= dataState;
          json.features[j].properties.homevalue= data_homevalue;
          json.features[j].properties.fthb= data_fthb;
          json.features[j].properties.cs= data_cs;
          json.features[j].properties.origltv= data_origltv;
          json.features[j].properties.dti= data_dti;
          json.features[j].properties.orignoterate= data_orignoterate;
          json.features[j].properties.conv= data_conv;
          json.features[j].properties.fha= data_fha;
          json.features[j].properties.va= data_va;
          json.features[j].properties.ltv_fico= data_ltv_fico;
          json.features[j].properties.hfa_agencies= data_hfa_agencies;
          json.features[j].properties.total= data_total;

	        // Stop looking through the JSON
	        break;
	        }
	      }
	      
	    }
  var IS_MOBILE = d3.select("#isMobile").style("display") ==  "block";
  var IS_PHONE = d3.select("#isPhone").style("display") == "block";
  var quantize = d3.scaleQuantize()
    .domain([0, MAXVALUE["cs"]])
    .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));

  var COLORS = 
  {
    "q0-6": "#cae0e7",
    "q1-6": "#95c0cf",
    "q2-6": "#60a1b6",
    "q3-6": "#008bb0",
    "q4-6": "#1d5669",
    "q5-6": "#0e2b35"
  }
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
      .style("fill", function(d) { 
        return COLORS[quantize(d.properties[SELECTED_VARIABLE])]
      })
      .on('click', function(d) {
        selectState(d.properties)
        dispatch.call("dehoverState")
      })
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
    	.text('REGION/STATE')
    region.append("div")
        .attr('class', 'tooltip-data state')
        .text("United States of America")

    var stats = tooltip.append('div')
      .attr('class', 'stats-text')
    stats.append('div')
      .attr('class', 'tooltip-title')
      .text('VALUE')
    stats.append("div")
        .attr('class', 'tooltip-data value')
        .text(format(data[0][SELECTED_VARIABLE]))

    d3.selectAll(".state")
    	.on("mouseover", function (d) {
               dispatch.call("hoverState", this, (d3.select(this).attr('class')))
            })
    	.on("mouseout", function () {
               dispatch.call("dehoverState")
            })

    var dispatch = d3.dispatch("hoverState", "dehoverState");



    dispatch.on("hoverState", function (selectedState) { 
            var stateName = d3.select(this).datum().properties.name
            var value = d3.select(this).datum().properties[SELECTED_VARIABLE]
            var abbr = d3.select(this).datum().properties.abbr
            d3.select(".state." + selectedState)
              .classed('hover', true)
            d3.select(".tooltip-data.state")
    	     	 .html(stateName)
            d3.select(".tooltip-data.value")
             .text(format(value))
            d3.select(this)
              .classed("hover", true)
            d3.select(".bar-" + abbr)
              .classed("hover", true)
          });
    dispatch.on("dehoverState", function() {
      var selectedState = (d3.select(".bar.selected").size() > 0) ? d3.select(".bar.selected").datum().state : "United States of America";
      var value = (d3.select(".bar.selected").size() > 0) ? d3.select(".bar.selected").datum()[SELECTED_VARIABLE] : data[0][SELECTED_VARIABLE]
          d3.select(".tooltip-data.state")
            .text(selectedState)
          d3.select(".tooltip-data.value")
            .text(format(value))
          d3.selectAll(".state, .bar")
            .classed("hover", false)
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
          .attr('id', 'state-menu')
          // .attr("onChange", "window.open(this.link, '_blank') ")
          .selectAll("option")
          .data(dropdownDataFiltered)
          .enter()
          .append("option")
          .text(function(d, i) {
            // data.forEach(function(row) {
              return dropdownDataFiltered[i]
            // })
          })
          .attr("value", function(d,i) {
            return dropdownDataFiltered[i]
          })

    d3.select('select')
          .append("option")
          .text("Select a category")
          .attr("value","")
          .attr("selected", "selected")
          .attr("disabled", "disabled")
          .attr("hidden", "hidden")

      $("#state-menu")
        .selectmenu({

           open: function( event, ui ) { 
          
            },
            close: function(event, ui){
            
            },
           change: function(event, data){ 
            SELECTED_VARIABLE = data.item.value;
              updateBars(SELECTED_VARIABLE)
              updateMap(SELECTED_VARIABLE)
              dispatch.call("dehoverState")
            }
        })     
        .selectmenu( "menuWidget" )
        .addClass( "ui-menu-icons customicons" );

    //ADD BAR GRAPH

    var graphData = data.filter(function(d) {
      return d.abbr != ""
    })
    var graphDataSorted = graphData.sort(function(a, b) { return b[SELECTED_VARIABLE] - a[SELECTED_VARIABLE]; });  

    var graphHeight = height*.7,
        x = d3.scaleBand().range([0, width]).padding(0.1),//.paddingInner([0.15]).align([.1]),
        y = d3.scaleLinear().rangeRound([graphHeight, 0]);
    x.domain(graphData.map(function(d) { return d.abbr; }));
    // y.domain([0, d3.max(graphData, function(d) { return d.cs; })]);
    y.domain([0, MAXVALUE["cs"]])

    barSvg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    var barG  = barSvg.append("g")
      .attr("class", "barG")
      .attr("transform", "translate("+ 30 +","+height/5+")")

    barG.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + graphHeight + ")")
      .call(d3.axisBottom(x));

    barG.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(TICKS["cs"]).tickSize(-width).tickFormat(d3.format(".2s")))
    barG
      .append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (-9) +","+(-9)+")")  // text is drawn off the screen top left, move down and out and rotate
      .text("Units")
      .attr("class", "y-axis-label")
      // .attr("transform", "rotate(-90)")
      // .attr("y", 0)
      // .attr("dy", "0.71em")
      // .attr("text-anchor", "end")
      // .text("Units");

    barG.selectAll(".bar")
      .data(graphDataSorted)
      .enter().append("rect")
        .attr("class", function(d) {
          return "bar bar-" + d.abbr
        })
        .attr("x", function(d) { return x(d.abbr) })
        .attr("y", function(d) { return y(d[SELECTED_VARIABLE]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {return graphHeight - y(d[SELECTED_VARIABLE]); })
        .on('mouseover', function(d) {
          hoverBar(d)
        })
        .on('mouseout', function() {
          d3.selectAll(".state, .bar")
            .classed("hover", false)
          dispatch.call("dehoverState")
        })
        .on('click', function(d) {
          selectState(d)
          dispatch.call("dehoverState")
        })

    function selectState(d) { 
      d3.selectAll(".state, .bar")
        .classed("selected", false)
      d3.selectAll(".state." + d.abbr + ", .bar-" + d.abbr)
        .classed("selected", true)
      region.select(".tooltip-data.state")
        .text(d.state)
      stats.select(".tooltip-data.value")
        .text(format(d[SELECTED_VARIABLE]))
    }
    function hoverBar(d) { 
      d3.selectAll(".state." + d.abbr + ", .bar-" + d.abbr)
        .classed("hover", true)
      region.select(".tooltip-data.state")
        .text(d.state)
      stats.select(".tooltip-data.value")
        .text(format(d[SELECTED_VARIABLE]))
    }
    function updateBars(variable) {
      y = d3.scaleLinear().rangeRound([graphHeight, 0]);
      y.domain([0, MAXVALUE[variable]]);
     var t = d3.transition()
        .duration(800)
      barG.select(".axis--y")
        .transition(t)
        .call(d3.axisLeft(y).ticks(TICKS[variable]).tickSize(-width).tickFormat(FORMAT[variable]))
        .on('end', function() {
          sortBars(variable)
        })
      barG.selectAll(".bar")
        .transition()
        .duration(450)
        .attr("y", function(d) { 
          return y(d[variable])
        })
        .attr("height", function(d) {
          return graphHeight - y(d[variable]); 
        })
    }

    function sortBars(variable) {
       var x0 = x.domain(graphData.sort(function(a, b) { 
          return b[variable] - a[variable]; 
        })
        .map(function(d) { return d["abbr"]; }))
        .copy();

      barG.selectAll(".bar")
          .sort(function(a, b) { return x0(a["abbr"]) - x0(b["abbr"]); });

      var transition = barG.transition().duration(750),
          delay = function(d, i) { return i * 30; };

      transition.selectAll(".bar")
          .delay(delay)
          .attr("x", function(d) { return x0(d["abbr"]); });

      transition.select(".axis--x")
          .call(d3.axisBottom(x))
        .selectAll("g")
          .delay(delay);

    }
    function updateMap(variable){
      var quantize = d3.scaleQuantize()
        .domain([0, MAXVALUE[variable]])
        .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));
      mapG.selectAll('path')
        .style("fill", function(d) { 
          return COLORS[quantize(d.properties[variable])]
        })
    }

    function format(d) {
      var numberFormat = d3.format(",.0f")
      var decimalFormat = d3.format(".1f")
      if (d < 100) {
        return decimalFormat(d)
      }else {
        return numberFormat(d)
      }
    }

  });

})
}


var pymChild = new pym.Child({ renderCallback: drawMap, polling: 500 });