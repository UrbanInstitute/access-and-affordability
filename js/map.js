

/*  This visualization was made possible by modifying code provided by:

http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922 */




//Create SVG element and append map to the SVG
var MAXVALUE = {"homevalue": 500000, "fthb": 60, "fico": 800, "origltv": 100, "dti": 45, "orignoterate": 4, "conv": 80, "fha": 40, "va": 30, "ltv_fico": 40, "aff_index_20": 2, "aff_index_35": 2, "med_income": 100000 },
    BREAKS = {"homevalue": [170000, 196000, 225000, 280000], "fthb": [46, 49, 52, 56], "fico": [723, 729, 734, 740], "origltv": [91, 94, 95, 96], "dti": [36, 37, 38, 39], "orignoterate": [3.6, 3.8, 3.9, 4], "conv": [50, 55, 58,63], "fha": [170000, 196000, 225000, 280000], "va": [170000, 196000, 225000, 280000], "ltv_fico": [170000, 196000, 225000, 280000], "aff_index_20": [170000, 196000, 225000, 280000], "aff_index_35": [170000, 196000, 225000, 280000], "med_income": [170000, 196000, 225000, 280000] },
    FORMAT = {"homevalue": d3.format(".1s"), "fthb": d3.format(""), "fico": d3.format(""), "origltv": d3.format(""), "dti": d3.format(""), "orignoterate": d3.format(""), "conv": d3.format(""), "fha": d3.format(""), "va": d3.format(""), "ltv_fico": d3.format(""), "aff_index_20": d3.format(".1f"), "aff_index_35": d3.format(".1f"), "med_income": d3.format(".1s") },
    TICKS = {"homevalue": 7, "fthb": 7, "fico": 5, "origltv":6, "dti":5, "orignoterate": 5, "conv": 5, "fha": 5, "va": 4, "ltv_fico": 5, "aff_index_20": 5, "aff_index_35": 5, "med_income": 6},
    UNITS = {"homevalue": "Dollars", "fthb": "Percent", "fico": "FICO Score", "origltv": "Ratio", "dti": "Ratio", "orignoterate": "Ratio", "conv": "Rate", "fha": "Percent", "va": "Percent", "ltv_fico": "Percent", "aff_index_20": "Index", "aff_index_35": "Index", "med_income": "Dollars"},
    SELECTED_VARIABLE = "homevalue";
    STATE = "District of Columbia";
    COLORS = ["#cfe8f3", "#a2d4ec", "#73bfe2", "#1696d2", "#12719e"]


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
        var data_agency = data[i].agency;

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
          json.features[j].properties.agency= data_agency;

	        // Stop looking through the JSON
	        break;
	        }
	      }
	      
	    }
  var IS_MOBILE = d3.select("#isMobile").style("display") ==  "block";
  var IS_PHONE = d3.select("#isPhone").style("display") == "block";
  var dataFiltered = data.filter(function(d) {
    return d.abbr != "US"
  })
  var dataFilteredMobile = data.filter(function(d, state) {
    return d.abbr == "US" || d.abbr == "DC"
  })
  var dataSortedMobile = dataFilteredMobile.sort(function(a,b) {
    return d3.descending(a.abbr,b.abbr);
  })

  MIN = d3.min(dataFiltered, function(d) {
    return d[SELECTED_VARIABLE]
  })
  MAX = d3.max(data, function(d) {
    return d[SELECTED_VARIABLE]
  })
  MAX_MOBILE = d3.max(data, function(d) {
    return d[SELECTED_VARIABLE]
  })
  var quantize = d3.scaleThreshold()
    .domain([170000, 196000, 225000, 280000])
    .range(["#cfe8f3", "#a2d4ec", "#73bfe2", "#1696d2", "#12719e"])

  var div = d3.select("body").append("div") 
      .attr("class", "map-tooltip")       
      .style("opacity", 0);
  //Width and height of map
    $mapContainer = $("#map-container")
    $chartContainer = $("#chart-container")
    $tooltipHeader = $(".tooltip-container")
    $mapContainer.empty();
    $tooltipHeader.empty();
    aspect_width = 12;
    aspect_height = 3.5;
    margin = { top: 20, right: 35, bottom: 30, left: 20 };
    width= (container_width > 960) ? 960 - margin.left - margin.right : container_width - margin.left - margin.right;
    height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom;
    mapHeight = (IS_PHONE) ? height*1.8: height*1.5;
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
        return quantize(d.properties[SELECTED_VARIABLE])
      })
      .on('click', function(d) {
        if (IS_PHONE) {
          var selected =  $("#state-menu").find('option:selected')
          var state = d.properties.state
          $("#state-menu option:selected").removeAttr("selected")
          $('#state-menu option[value=' + '"'+ state +'"' + ']').attr("selected",true);
          $('#state-menu-button > .ui-selectmenu-text').text(state);
          console.log(SELECTED_VARIABLE)
          updateBars(SELECTED_VARIABLE, state)
          selectStateMobile(state)

        }else {
          selectState(d.properties)
          dispatch.call("dehoverState")
        }
      })
  //ADD LEADER LINE FOR DC
    var dcData = json.features.filter(function(d) {return d.properties.name == "District of Columbia"})

    var dcLine1 = mapSvg.append("line")
      .attr("x1", .72*width)
      .attr("y1", .5*mapHeight)
      .attr("x2", .77*(width))
      .attr("y2", .5*mapHeight)
      .attr("stroke-width", 1.2)
      .attr("stroke", "#000000")
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
        .text(function() {
          return (IS_PHONE) ? STATE : "United States";
        })
    region.append("div")
        .attr('class', 'tooltip-data average')
        .text(function() {
           return (IS_PHONE) ? "US average: " + format(data[0][SELECTED_VARIABLE]) : ""
        })
    var stats = tooltip.append('div')
      .attr('class', 'stats-text')
    stats.append('div')
      .attr('class', 'tooltip-title')
      .text('VALUE')
    stats.append("div")
        .attr('class', 'tooltip-data value')
        .text(function() {
          return (IS_PHONE) ? format(data[9][SELECTED_VARIABLE]) : format(data[0][SELECTED_VARIABLE])
        })
    d3.selectAll(".state")
    	.on("mouseover", function (d) {
        console.log(d.properties.agency)
        div.transition()   
          .duration(200)    
          .style("opacity", .9);    
        div.html("Click to learn about " + d.properties.agency)  
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY - 28) + "px");  
        d3.select('.map-tooltip').moveToFront();
         dispatch.call("hoverState", this, (d3.select(this).attr('class')))
      })
    	.on("mouseout", function () {
         dispatch.call("dehoverState")
      })
    d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };
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
      if (IS_PHONE != true) { 
        $(".tooltip-container").css("width", tooltipWidth * 1.15)
      }
    });
    dispatch.on("dehoverState", function() {
      var selectedState = (d3.select(".bar.selected").size() > 0) ? d3.select(".bar.selected").datum().state : "United States";
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
      if (IS_PHONE != true) { 
        if (selectedState != "United States") {
          var tooltipWidth = $(".region-text").width() + $(".stats-text").width() + $(".dropdown-text").width()
            $(".tooltip-container").css("width", tooltipWidth * 1.15 )
        }else { 
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
    if (IS_PHONE){ 
        dropdownMobile.append('div')
          .attr('class', 'dropdown-category')
          .append('text')
          .text('CATEGORY')
          .attr('class', 'dropdown-label')
        var dropdownMenu = dropdownMobile.select('.dropdown-category')
          .append('div')
          .attr("class", "dropdown-div")
        dropdownMenu
          .append("select")
          .attr('id', 'category-menu')
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
        var stateDropdownData = data.filter(function(d) { 
          return d.abbr != "US"
        })
        dropdownMobile.append('div')
          .attr('class','dropdown-state')
          .append('text')
          .text('STATE')
          .attr('class', 'dropdown-label')
        var stateMenu = dropdownMobile.select('.dropdown-state')
          .append('div')
          .attr("class", "dropdown-div")
        stateMenu
          .append("select")
          .attr('id', 'state-menu')
          .selectAll("option")
          .data(stateDropdownData)
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
        $('#state-menu option[value="District of Columbia"]').attr("selected",true);
        // d3.select("#state-menu")
        //   .append("option")
        //   .text("Select a state")
        //   .attr("value","")
        //   .attr("selected", "selected")
        //   .attr("disabled", "disabled")
        //   .attr("hidden", "hidden")
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
              STATE = STATE;
              SELECTED_VARIABLE = data.item.value;
              MIN = d3.min(dataFiltered, function(d) {
                return d[SELECTED_VARIABLE]
              })
              MAX = d3.max(data, function(d) {
                return d[SELECTED_VARIABLE]
              })
              if (IS_PHONE == true) {
                updateBars(SELECTED_VARIABLE, STATE)
              }else {
                updateBars(SELECTED_VARIABLE)
                dispatch.call("dehoverState")
                // updateTooltip(STATE, SELECTED_VARIABLE)
              }
              updateMap(SELECTED_VARIABLE, MIN, MAX)
            }
        })     
        .selectmenu( "menuWidget" )
        .addClass( "ui-menu-icons customicons" );
      
      var bodyHeight = parseInt(d3.select("body").style("height"))

      $("#state-menu")
        .selectmenu({

           open: function( event, ui ) { 
            $("#state-menu-menu").css("width", "322px")
            d3.select("body").style("height", (d3.select(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").node().getBoundingClientRect().height*1.2) + "px")
            pymChild.sendHeight();
            },
            close: function(event, ui){ 
            // d3.select("body").style("height", (bodyHeight*1.3).toString() + "px")
            // pymChild.sendHeight();
            },
           change: function(event, data){ 
              STATE = data.item.value
              SELECTED_VARIABLE = SELECTED_VARIABLE;
              updateBars(SELECTED_VARIABLE, STATE)
              // updateTooltip(STATE, SELECTED_VARIABLE)
              selectStateMobile(STATE)

              // updateMap(SELECTED_VARIABLE)
              // dispatch.call("dehoverState")
            }
        })     
        .selectmenu( "menuWidget" )
        .addClass( "ui-menu-icons customicons" );

    if (IS_PHONE != true) { 
      tooltipWidthUSA = $(".region-text").width() + $(".stats-text").width() + $(".dropdown-text").width()
      $(".tooltip-container").css("width", tooltipWidthUSA*1.18)
    }
    //ADD BAR GRAPH
    var dataSorted = dataFiltered.sort(function(a, b) { return b[SELECTED_VARIABLE] - a[SELECTED_VARIABLE]; });  
    var graphHeight = height*.5,
        paddingMobile = .2
        graphHeightMobile = (container_width < 442) ? 140 : 120,
        barWidth = (container_width < 442) ? width*.8: width * .5,
        xMobile = d3.scaleLinear().range([0, barWidth]),
        yMobile = d3.scaleBand().range([graphHeightMobile, 0]),
        x = d3.scaleBand().range([0, width]).padding(0.1),//.paddingInner([0.15]).align([.1]),
        y = d3.scaleLinear().rangeRound([graphHeight, 0]);
    x.domain(dataSorted.map(function(d) { return d.abbr; }));
    // y.domain([0, d3.max(data, function(d) { return d.cs; })]);
    y.domain([0, MAXVALUE[SELECTED_VARIABLE]]);
    xMobile.domain([0, MAXVALUE[SELECTED_VARIABLE]]);
    yMobile.domain(dataSortedMobile.map(function(d) { return d.abbr; })).padding(paddingMobile);
  $("#chart-container").empty()
  $("#chart-container-mobile").empty()
    if (IS_PHONE){ 
      var translateX = (container_width < 442) ? 33 : width/5
      var barSvg = d3.select("#chart-container-mobile")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", graphHeightMobile + margin.top + margin.bottom);


      var barG  = barSvg.append("g")
        .attr("class", "barG")
        .attr("transform", "translate("+ translateX+","+graphHeightMobile/5+")")
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
      barG.selectAll(".bar")
        .data(dataSortedMobile)
        .enter().append("rect")
        .attr("class", function(d, i) {
          return "bar bar-" + i
        })
        .attr("x", 0)
        .attr("height", yMobile.bandwidth())
        .attr("y", function(d) { return yMobile(d.abbr); })
        .attr("width", function(d) { return xMobile(d[SELECTED_VARIABLE]); })
        .style("fill", function(d) { 
          return (container_width < 442) ? "" : quantize(d[SELECTED_VARIABLE])
        })
    }else {
    barSvg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", graphHeight + margin.top + margin.bottom);
    var barG  = barSvg.append("g")
      .attr("class", "barG")
      .attr("transform", "translate("+ 30 +","+25+")")
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

    barG.selectAll(".bar")
      .data(dataSorted)
      .enter().append("rect")
      .attr("class", function(d) {
        return "bar bar-" + d.abbr
      })
      .style("fill", function(d) { 
        return quantize(d[SELECTED_VARIABLE])
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
    //ADD US AVERAGE LINE
    barG.append("line")
      .data(data.filter(function(d) {
        return d.abbr == "US"
      }))
      .style("stroke", "black")
      .attr("x1", 2)
      .attr("y1", function(d) {
        return y(d[SELECTED_VARIABLE])
      })
      .attr("x2", width)
      .attr("y2", function(d) {
        return y(d[SELECTED_VARIABLE])
      })   
      .attr("class", "us-line") 
      .style("stroke-dasharray", ("5, 3"))
    barSvg.append("text")
       .data(data.filter(function(d) {
          return d.abbr == "US"
        }))
      .text("US")
      .attr("transform", function(d) {
        // var yPos = d3.select(".us-line").node().getBBox().y
        var yPos = (d3.select(".us-line").node().getBoundingClientRect().top)
        return "translate("+(width + 35)+"," + (yPos + 5)+ ")"
      })
      .attr("class", "us-label")


    }
    // function updateTooltip(state, variable) {
    //   var text = (function(){
    //     for (index in data) {
    //         if (data[index].state == state){
    //           return data[index][variable];
    //         }
    //       }
    //   })   
    //   () 
    //   d3.select(".tooltip-data.state")
    //     .text(state)
    //   d3.select(".tooltip-data.value")
    //     .text(format(text))
    //   region.select(".tooltip-data.average")
    //     .text(function() {
    //       return "US average: " + format(data[0][variable])
    //     })
    // }
    function selectStateMobile(state){
      console.log(data)
      var abbr = (function(){
        for (index in data) {
            if (data[index].state == state){
              return data[index]["abbr"];
            }
          }
      })
      ()
      console.log(abbr)
      d3.selectAll("path.state")
        .classed("selected", false)
        .classed("hover", false)
      d3.select("path.state." + abbr)
        .classed("selected", true)
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
      if (IS_PHONE != true) { 
        var tooltipWidth = $(".region-text").width() + $(".stats-text").width() + $(".dropdown-text").width()
        $(".tooltip-container").css("width", tooltipWidth * 1.15)
      }
    }
    function updateBars(variable, state, min, max) {console.log(BREAKS[variable])
      // var quantize = d3.scaleQuantize()
      //   .domain([MIN, MAX])
      //   .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));
      var quantize = d3.scaleThreshold()
        .domain(BREAKS[variable])
        .range(["#cfe8f3", "#a2d4ec", "#73bfe2", "#1696d2", "#12719e"])

      if (IS_PHONE) {
        var dataFilteredMobile = data.filter(function(d) { 
          return d.abbr == "US" || d.state == state
        });
        var dataSortedMobile = dataFilteredMobile.sort(function(a,b) {
          if((b.abbr).search("U") == 0 || (b.abbr).search("V") == 0 || (b.abbr).search("W") == 0 ) {
            return d3.ascending(a.abbr,b.abbr)
          }else {
            return d3.descending(a.abbr,b.abbr);
          }
        })
        var MAX_MOBILE = d3.max(dataSortedMobile, function(d) {
          return d[SELECTED_VARIABLE]
        })
        var translateX = (container_width < 442) ? 33 : width/5,
            barWidth = (container_width < 442) ? width*.9: width * .6,
            xMobile = d3.scaleLinear().range([0, barWidth]),
            yMobile = d3.scaleBand().range([graphHeightMobile, 0]);
            xMobile.domain([0, MAX_MOBILE]);
            yMobile.domain(dataSortedMobile.map(function(d) { return d.abbr; })).padding(paddingMobile);
        barG.select(".axis--x")
          .call(d3.axisBottom(xMobile).tickSizeInner([-graphHeightMobile]));
        barG.select(".axis--x").selectAll(".tick")
          .each(function(d,i) { 
            d3.select(this)
              .attr("class", "tick tick-" + i)
          })
        barG.select(".axis--y")
          .call(d3.axisLeft(yMobile));
        barG.selectAll(".bar")
          .data(dataSortedMobile)
          .attr("class", function(d, i) {
            if (d.abbr == "US") {
              return "bar bar-0"
            }else {
              return "bar bar-1"
            }
          })
          .attr("x", 0)
          .attr("height", yMobile.bandwidth())
          .attr("y", function(d) { return yMobile(d.abbr); })
          .attr("width", function(d) { return xMobile(d[variable]); })
          .style("fill", function(d) { 
            return (container_width < 442) ? "" : quantize(d[SELECTED_VARIABLE])
          })
      }else {
        y = d3.scaleLinear().rangeRound([graphHeight, 0]);
      y.domain([0, MAXVALUE[variable]]);
        var t = d3.transition()
          .duration(300)
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
          .duration(300)
          .attr("y", function(d) { 
            return y(d[variable])
          })
          .attr("height", function(d) {
            return graphHeight - y(d[variable]); 
          })
          .style("fill", function(d) { 
            return quantize(d[variable])
          })
        barG.select(".us-line")
          .transition()
          .duration(300)
          .attr("y1", function(d) {
            return y(d[variable])
          })
          .attr("y2", function(d) {
            return y(d[variable])
          })  
          .on('end', function() {
            barSvg.select(".us-label")
              .attr("transform", function(d) {
                var yPos = (d3.select(".us-line").node().getBoundingClientRect().top)
                console.log(yPos)
                return "translate("+(width + 35)+"," + (yPos + 5)+ ")"
              })

          })

      }
    }

    function sortBars(variable) {
       var x0 = x.domain(dataFiltered.sort(function(a, b) { 
          return b[variable] - a[variable]; 
        })
        .map(function(d) { return d["abbr"]; }))
        .copy();

      barG.selectAll(".bar")
          .sort(function(a, b) { return x0(a["abbr"]) - x0(b["abbr"]); });

      var transition = barG.transition().duration(750)
          // delay = function(d, i) { return i * 20; };

      transition.selectAll(".bar")
          // .delay(delay)
          .attr("x", function(d) { return x0(d["abbr"]); });

      transition.select(".axis--x")
          .call(d3.axisBottom(x))
        .selectAll("g")
          // .delay(delay);

    }
    function updateMap(variable, min, max){
      console.log(variable)
      console.log(BREAKS[variable])
      var quantize = d3.scaleThreshold()
        .domain(BREAKS[variable])
        .range(["#cfe8f3", "#a2d4ec", "#73bfe2", "#1696d2", "#12719e"])
      mapG.selectAll('path')
        .style("fill", function(d) { 
          return quantize(d.properties[variable])
        })
      d3.selectAll(".legend-labels")
        .each(function(d,i) {
          d3.select(this)
            .text(function(){
              var array = BREAKS[SELECTED_VARIABLE]
              if (i==0) {
                return format(MIN)
              }else if (i==5) {
                return format(Math.ceil(MAX))
              }else {
                return format(array[i-1])
              }
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
          .style("fill", COLORS[i])
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
            //console.log((i ==0) ? MIN : BREAKS[SELECTED_VARIABLE(1)])
            //return (i ==0) ? MIN : BREAKS[SELECTED_VARIABLE[i-1]]
            var array = BREAKS[SELECTED_VARIABLE]
            return (i==0) ? format(MIN) : format(array[i-1])
          })
       }
       if (i == 5) { console.log(MAX)
        legend.append("text")
          .attr("x", 20)
          .attr("class","legend-labels")
          .attr("y",keyHeight*i + 5)
          .text(function(){
              return format(Math.ceil(MAX))
          })
       }
     }




  });

})
}


var pymChild = new pym.Child({ renderCallback: drawMap, polling: 500 });