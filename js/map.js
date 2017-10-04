

/*  This visualization was made possible by modifying code provided by:

http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922 */




//Create SVG element and append map to the SVG
var MAXVALUE = {"homevalue": 500000, "fthb": 60, "fico": 800, "origltv": 100, "dti": 45, "orignoterate": 4, "conv": 80, "fha": 40, "va": 30, "ltv_fico": 40, "aff_index_20": 2, "aff_index_35": 2, "med_income": 100000 },
    FORMAT = {"homevalue": d3.format(".1s"), "fthb": d3.format(""), "fico": d3.format(""), "origltv": d3.format(""), "dti": d3.format(""), "orignoterate": d3.format(""), "conv": d3.format(""), "fha": d3.format(""), "va": d3.format(""), "ltv_fico": d3.format(""), "aff_index_20": d3.format(".1f"), "aff_index_35": d3.format(".1f"), "med_income": d3.format(".1s") },
    TICKS = {"homevalue": 7, "fthb": 7, "fico": 5, "origltv":6, "dti":5, "orignoterate": 5, "conv": 5, "fha": 5, "va": 4, "ltv_fico": 5, "aff_index_20": 5, "aff_index_35": 5, "med_income": 6},
    UNITS = {"homevalue": "Dollars", "fthb": "Percent", "fico": "FICO Score", "origltv": "Ratio", "dti": "Ratio", "orignoterate": "Ratio", "conv": "Rate", "fha": "Percent", "va": "Percent", "ltv_fico": "Percent", "aff_index_20": "Index", "aff_index_35": "Index", "med_income": "Dollars"},
    SELECTED_VARIABLE = "homevalue";
function drawMap(container_width) {

	d3.csv("data2.csv", function(data) {

	  d3.json("us-states.json", function(json) {
	    for (var i = 0; i < data.length; i++) {
	      var dataState = data[i].state;
	      var dataAbbr = data[i].abbr;
	      var dataLink = data[i].link;
        var data_homevalue = data[i].homevalue;
        var data_fthb = data[i].fthb;
        var data_fico = data[i].fico;
        var data_origltv = data[i].origltv;
        var data_dti = data[i].dti;
        var data_orignoterate = data[i].orignoterate;
        var data_conv = data[i].conv;
        var data_fha = data[i].fha;
        var data_va = data[i].va;
        var data_ltv_fico = data[i].ltv_fico;
        var data_aff_index_20 = data[i].aff_index_20;
        var data_aff_index_35 = data[i].aff_index_35;
        var data_med_income = data[i].med_income;

	      for (var j = 0; j < json.features.length; j++)  {
	        var jsonState = json.features[j].properties.name;
	        if (dataState == jsonState) {
	        // Copy the data value into the JSON
	        json.features[j].properties.abbr = dataAbbr; 
	        json.features[j].properties.link= dataLink;
          json.features[j].properties.state= dataState;
          json.features[j].properties.homevalue= data_homevalue;
          json.features[j].properties.fthb= data_fthb;
          json.features[j].properties.fico= data_fico;
          json.features[j].properties.origltv= data_origltv;
          json.features[j].properties.dti= data_dti;
          json.features[j].properties.orignoterate= data_orignoterate;
          json.features[j].properties.conv= data_conv;
          json.features[j].properties.fha= data_fha;
          json.features[j].properties.va= data_va;
          json.features[j].properties.ltv_fico= data_ltv_fico;
          json.features[j].properties.aff_index_20= data_aff_index_20;
          json.features[j].properties.aff_index_35= data_aff_index_35;
          json.features[j].properties.med_income= data_med_income;
	        // Stop looking through the JSON
	        break;
	        }
	      }
	      
	    }
  var IS_MOBILE = d3.select("#isMobile").style("display") ==  "block";
  var IS_PHONE = d3.select("#isPhone").style("display") == "block";
  console.log(IS_PHONE)
  var quantize = d3.scaleQuantize()
    .domain([0, MAXVALUE[SELECTED_VARIABLE]])
    .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));

  var COLORS = 
  {
    "q0-6": "#cfe8f3",
    "q1-6": "#73bfe2",
    "q2-6": "#1696d2",
    "q3-6": "#0a4c6a",
    "q4-6": "#000000"
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
    width= (container_width > 944) ? 944 - margin.left - margin.right : container_width - margin.left - margin.right;
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
      .attr("x1", .72*width)
      .attr("y1", .5*mapHeight)
      .attr("x2", .77*(width))
      .attr("y2", .5*mapHeight)
      .attr("stroke-width", 1.2)
      .attr("stroke", "#ec008b")
    // var dcLine2 = mapSvg.append("line")
    //   .attr("x1", .77*(width))
    //   .attr("y1", .5*mapHeight)
    //   .attr("x2", .77*(width))
    //   .attr("y2", function() {
    //     if (IS_PHONE){
    //       return .26*(width)
    //   } else { 
    //     return .22*(width)}
    //   })
    //   .attr("stroke-width", 1.2)
    //   .attr("stroke", "#ec008b")
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
      .attr("x", .775*(width))
      .attr("y", function() { 
        if (IS_PHONE) {
          return .28*(width)
        } else { 
          return mapHeight*.51}
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
    region.append("div")
        .attr('class', 'tooltip-data average')
        .text("")
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
      region.select(".tooltip-data.average")
        .text("US average: " + format(data[0][SELECTED_VARIABLE]))
      d3.select(this)
        .classed("hover", true)
      d3.select(".bar-" + abbr)
        .classed("hover", true)
      var tooltipWidth = $(".region-text").width() + $(".stats-text").width() + $(".dropdown-text").width()
      if (IS_PHONE != true) { console.log('hi')
        $(".tooltip-container").css("width", tooltipWidth * 1.15)
      }
    });
    dispatch.on("dehoverState", function() {
      var selectedState = (d3.select(".bar.selected").size() > 0) ? d3.select(".bar.selected").datum().state : "United States of America";
      var value = (d3.select(".bar.selected").size() > 0) ? d3.select(".bar.selected").datum()[SELECTED_VARIABLE] : data[0][SELECTED_VARIABLE]
      var average = (d3.select(".bar.selected").size() > 0 && selectedState.search("United") < 0) ? "US average: " + format(data[0][SELECTED_VARIABLE]) : ""
          d3.select(".tooltip-data.state")
            .text(selectedState)
          d3.select(".tooltip-data.value")
            .text(format(value))
          region.select(".tooltip-data.average")
            .text(average)
          d3.selectAll(".state, .bar")
            .classed("hover", false)
      if (IS_PHONE != true) { console.log('hi')
        if (selectedState != "United States of America") {
          var tooltipWidth = $(".region-text").width() + $(".stats-text").width() + $(".dropdown-text").width()
            $(".tooltip-container").css("width", tooltipWidth * 1.15 )
        }else { console.log('hi')
            $(".tooltip-container").css("width", tooltipWidthUSA * 1.18)
        }  
      }

    })

    //VARIABLE DROPDOWN MENU
    $("#dropdown-mobile").empty()
    var dropdownData = d3.keys(data[0])
    var dropdownDataFiltered = dropdownData.filter(function(d){
      return d != "state" && d != "abbr" && d != "link"
    })
    var dropdownNames = ["Median Home Value", "First-time Homebuyer Share", "Median FICO Score", "Median Loan-to-Value (LTV) Ratio at Origination", "Debt-to-Income (DTI) Ratio at Origination", "Note Rate at Origination", "Conventional Loan Share", "FHA Loan Share", "VA Loan Share", "Share of Loans with Weak Credit Profile (LTV>95 and FICO<700)", "Affordability Index with 20% down payment", "Affordability Index with 3.5% down payment", "Median Family Income"]
    var defaultOptionName = ""
    var dropdown = tooltip.append('div')
          .attr('class', 'dropdown-text')
    var dropdownMobile = d3.select("#dropdown-mobile")
    if (IS_PHONE){ console.log('hi')
        var dropdownMenu =dropdownMobile.append('div')
          .attr('class', 'dropdown-category')
          .append('text')
          .text('Category:')
          .attr('class', 'dropdown-label')
        dropdownMenu
          .append("select")
          .attr('id', 'category-menu')
          // .attr("onChange", "window.open(this.link, '_blank') ")
          .selectAll("option")
          .data(dropdownDataFiltered)
          .enter()
          .append("option")
          .text(function(d, i) {
            // data.forEach(function(row) {
              return dropdownNames[i]
            // })
          })
          .attr("value", function(d,i) {
            return dropdownDataFiltered[i]
          })

        var stateMenu = dropdownMobile.append('div')
          .attr('class','dropdown-state')
          .append('text')
          .text('State: ')
          .attr('class', 'dropdown-label')
        stateMenu
          .append("select")
          .attr('id', 'state-menu')
          // .attr("onChange", "window.open(this.link, '_blank') ")
          .selectAll("option")
          .data(data)
          .enter()
          .append("option")
          .text(function(d, i) {
            // data.forEach(function(row) {
              return d.state
            // })
          })
          .attr("value", function(d,i) {
            return d.state
          })
    }else {
      var dropdownMenu =dropdown.append('div')
          .attr('class', 'dropdown-category')
          .append("select")
          .attr('id', 'category-menu')
          // .attr("onChange", "window.open(this.link, '_blank') ")
          .selectAll("option")
          .data(dropdownDataFiltered)
          .enter()
          .append("option")
          .text(function(d, i) {
            // data.forEach(function(row) {
              return dropdownNames[i]
            // })
          })
          .attr("value", function(d,i) {
            return dropdownDataFiltered[i]
          })
    }

      $("#category-menu")
        .selectmenu({

           open: function( event, ui ) { 
            $("#category-menu-menu").css("width", "322px")
            // d3.select("body").style("height", (d3.select(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").node().getBoundingClientRect().height*2.3) + "px")
            // pymChild.sendHeight();
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

      $("#state-menu")
        .selectmenu({

           open: function( event, ui ) { 
            $("#state-menu-menu").css("width", "322px")
            // d3.select("body").style("height", (d3.select(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").node().getBoundingClientRect().height*2.3) + "px")
            // pymChild.sendHeight();
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

    if (IS_PHONE != true) { console.log('hi')
      tooltipWidthUSA = $(".region-text").width() + $(".stats-text").width() + $(".dropdown-text").width()
      $(".tooltip-container").css("width", tooltipWidthUSA*1.18)
    }
    //ADD BAR GRAPH

    var graphData = data.filter(function(d) {
      return d.abbr != ""
    })

    var dataFilteredMobile = data.filter(function(d) {
      return d.abbr == "US" || d.abbr == "DC"
    })
    var graphDataSorted = graphData.sort(function(a, b) { return b[SELECTED_VARIABLE] - a[SELECTED_VARIABLE]; });  

    var graphHeight = height*.5,
        graphHeightMobile = height,
        xMobile = d3.scaleLinear().range([0, width*.6]),
        yMobile = d3.scaleBand().range([graphHeightMobile, 0]),
        x = d3.scaleBand().range([0, width]).padding(0.1),//.paddingInner([0.15]).align([.1]),
        y = d3.scaleLinear().rangeRound([graphHeight, 0]);
    x.domain(graphData.map(function(d) { return d.abbr; }));
    // y.domain([0, d3.max(graphData, function(d) { return d.cs; })]);
    y.domain([0, MAXVALUE[SELECTED_VARIABLE]]);
    xMobile.domain([0, MAXVALUE[SELECTED_VARIABLE]]);
    yMobile.domain(dataFilteredMobile.map(function(d) { return d.abbr; })).padding(0.1);
  $("#chart-container").empty()
  $("#chart-container-mobile").empty()
    if (IS_PHONE){
      barSvg = d3.select("#chart-container-mobile")
        .append("svg")
        .attr("width", width*.8 + margin.left + margin.right)
        .attr("height", graphHeightMobile + margin.top + margin.bottom);
      var barG  = barSvg.append("g")
        .attr("class", "barG")
        .attr("transform", "translate("+ width/5+","+graphHeightMobile/5+")")
      barG.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + graphHeightMobile + ")")
        .call(d3.axisBottom(xMobile).tickSizeInner([-graphHeightMobile]));
      barG.select(".axis--x").selectAll(".tick")
        .each(function(d,i) {
          d3.select(this)
            .attr("class", "tick tick-" + i)
        })
      barG.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yMobile));
        console.log(dataFilteredMobile)
      barG.selectAll(".bar")
        .data(dataFilteredMobile)
        .enter().append("rect")
        .attr("class", function(d, i) {
          return "bar bar-" + i
        })
        .attr("x", 0)
        .attr("height", yMobile.bandwidth())
        .attr("y", function(d) { console.log (yMobile(d.abbr)); return yMobile(d.abbr); })
        .attr("width", function(d) { return xMobile(d[SELECTED_VARIABLE]); })

    }else {
    barSvg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", graphHeight + margin.top + margin.bottom);
    var barG  = barSvg.append("g")
      .attr("class", "barG")
      .attr("transform", "translate("+ 30 +","+graphHeight/5+")")
    barG.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + graphHeight + ")")
      .call(d3.axisBottom(x));
    barG.select(".axis--x").selectAll("text")
      .style("text-anchor", "middle")
      .each(function() {
        var abbr = d3.select(this).text()
        d3.select(this)
          .attr('class', abbr)
      })

    barG.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(TICKS[SELECTED_VARIABLE]).tickSize(-width).tickFormat(d3.format(".2s")))
    barG.select(".axis--y").selectAll(".tick")
      .each(function(d,i) {
        d3.select(this)
          .attr("class", "tick tick-" + i)
      })
    barG
      .append("text")
      .attr("text-anchor", "start")  
      .attr("transform", function() {
        // transformLabel()
        var tickLabels = d3.select(".axis--y").selectAll('.tick text')
        var lastTick = tickLabels.filter(function(d,i){
          return i == tickLabels.size() - 1
        })
        var lastTickX = lastTick.node().getBBox().x
        var lastTickY = lastTick.node().getBBox().y
        return "translate("+ (lastTickX) +","+(lastTickY - 3)+")"
      })  
      .text(UNITS[SELECTED_VARIABLE])
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
      .style("fill", function(d) { 
        return COLORS[quantize(d[SELECTED_VARIABLE])]
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
    }

    function selectState(d) { 
      if (d3.select(".bar-" + d.abbr).classed("selected") == true) {
      d3.selectAll(".state, .bar")
        .classed("selected", false)      
      }else {
        d3.selectAll(".state, .bar")
          .classed("selected", false)
        d3.selectAll(".state." + d.abbr + ", .bar-" + d.abbr)
          .classed("selected", true)
        region.select(".tooltip-data.state")
          .text(d.state)
        stats.select(".tooltip-data.value")
          .text(format(d[SELECTED_VARIABLE]))
        region.select(".tooltip-data.average")
          .text(function() {
            return (d.abbr == "US") ? "" : "US average: " + format(data[0][SELECTED_VARIABLE])
          })
      }
    }
    function hoverBar(d) { 
      d3.selectAll(".state." + d.abbr + ", .bar-" + d.abbr)
        .classed("hover", true)
      region.select(".tooltip-data.state")
        .text(d.state)
      stats.select(".tooltip-data.value")
        .text(format(d[SELECTED_VARIABLE]))
      region.select(".tooltip-data.average")
          .text(function() {
            return (d.abbr == "US") ? "" : "US average: " + format(data[0][SELECTED_VARIABLE])
          })      
      if (IS_PHONE != true) { console.log('hi')
        var tooltipWidth = $(".region-text").width() + $(".stats-text").width() + $(".dropdown-text").width()
        $(".tooltip-container").css("width", tooltipWidth * 1.15)
      }
    }
    function updateBars(variable) {
      var quantize = d3.scaleQuantize()
        .domain([0, MAXVALUE[variable]])
        .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));
      y = d3.scaleLinear().rangeRound([graphHeight, 0]);
      y.domain([0, MAXVALUE[variable]]);
     var t = d3.transition()
        .duration(800)
      barG.select(".axis--y")
        .transition(t)
        .call(d3.axisLeft(y).ticks(TICKS[variable]).tickSize(-width).tickFormat(FORMAT[variable]))
        .on('end', function() {
          barG.select(".y-axis-label")
            .text(UNITS[variable])
            .attr("transform", function() {
              // transformLabel()
              var tickLabels = d3.select(".axis--y").selectAll('.tick text')
              var lastTick = tickLabels.filter(function(d,i){
                return i == tickLabels.size() - 1
              })
              var lastTickX = lastTick.node().getBBox().x
              var lastTickY = lastTick.node().getBBox().y
              return "translate("+ (lastTickX) +","+(lastTickY - 3)+")"
            })
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
        .style("fill", function(d) { 
          return COLORS[quantize(d[variable])]
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
      d3.selectAll(".legend-labels")
        .each(function(d,i) {
          d3.select(this)
            .text(function(){
              return format(MAXVALUE[SELECTED_VARIABLE]/6 * i)
          })
        })
    }

    function format(d) {
      var numberFormat = d3.format(",.0f")
      var decimalFormat = d3.format(".1f")
      if (SELECTED_VARIABLE == "homevalue" || SELECTED_VARIABLE == "med_income") {
        return "$" + numberFormat(d)
      } else if (SELECTED_VARIABLE == "fthb" || SELECTED_VARIABLE == "conv" || SELECTED_VARIABLE == "va" || SELECTED_VARIABLE == "fha" || SELECTED_VARIABLE == "ltv_fico") {
        return decimalFormat(d) + "%"
      }else if (d > 100) {
        return numberFormat(d)
      } else {
        return decimalFormat(d)
      }
    }

    /*LEGEND*/
      var legend = mapSvg.append("g")
        .attr("width", width/3)
        .attr("height", 50)
        .attr("transform", "translate("+width*.9+"," + height*.08 + ")")

      var keyHeight = (IS_PHONE) ? width*.068: 28;
      var keyWidth = (IS_PHONE) ? 8 : 15;
     for (i=0; i<=5; i++){
      if(i !== 5){ 
        legend.append("rect")
          .attr("width",keyWidth)
          .attr("height",keyHeight)
          .attr("class","rect"+i)
          .attr("y",keyHeight*i)
          .style("fill", COLORS["q" + i + "-6"])
          // .on("mouseover",function(){ mouseEvent({type: "Legend", "class": (d3.select(this).attr("class"))}, "hover") })
          // .on("mouseleave", function(){
          //   d3.selectAll(".demphasized").classed("demphasized",false)
          // })
      //     .on("click",function(){ mouseEvent(dataID, {type: "Legend", "class": "q" + (this.getAttribute("x")/keyWidth) + "-4"}, "click") })
        legend.append("text")
          .attr("x", 20)
          .attr("class","legend-labels")
          .attr("y",keyHeight*i + 5)
          .text(function(){
              return format(MAXVALUE[SELECTED_VARIABLE]/5 * i)
          })
       }
       if (i == 5) {
        legend.append("text")
          .attr("x", 20)
          .attr("class","legend-labels")
          .attr("y",keyHeight*i + 5)
          .text(function(){
              return format(MAXVALUE[SELECTED_VARIABLE])
          })
       }
     }




  });

})
}


var pymChild = new pym.Child({ renderCallback: drawMap, polling: 500 });