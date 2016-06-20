/* ------------------------------------------------------------------------------
File: geoMap.js 
------------------------------------------------------------------------------ */

// Define Margin, Width & Height
var margin = {top: 5, right: 5, bottom: 5, left: 5},
    width = 1060 - margin.left - margin.right,
    height = 620 - margin.top - margin.bottom;


// Define Map Projections - D3 API Reference on Geo > Geo Projections
var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);
								  
// Define Path
var path = d3.geo.path().projection(projection);

// Define color scale. A range of color to represent different shade of the color
// In this example, we will represent the color Blue in different shades. 
var color = d3.scale.quantize()
    .range(["rgb(161,217,155)","rgb(116,196,118)",
            "rgb(65,171,93)","rgb(35,139,69)",
            "rgb(0,90,50)"]);

 // Define Tooltip
 var tooltip = d3.select("body").append("div")
     .attr("class", "tooltip")
								
// Define SVG
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
   .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");   

// Load Data
d3.csv("us-pop.csv", function(data) {
    color.domain([
        d3.min(data, function(d) { return d.value; }), 
        d3.max(data, function(d) { return d.value; })
    ]);
    
    // Load GeoJSON Data
    d3.json("us-states.json", function(json) {
        for (var i = 0; i < data.length; i++) {
            var dataState = data[i].state;
            var dataValue = parseFloat(data[i].value);
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;
				if (dataState == jsonState) {
				    json.features[j].properties.value = dataValue;
                    break;				
				}
            }		
        }

    // Bind Data 
    svg.selectAll("path")
        .data(json.features)
        .enter()    
        .append("path")
        .attr("class", "state-boundary")
        .attr("d", path)
        .style("fill", function(d) { return color(d.properties.value); })
        .on("mouseover", function(d) {   
            tooltip.transition()
               .duration(200)
               .style("opacity", .9);
            tooltip.html("<strong>" + d.properties.name + "</strong>" + "<br/>" + "Population: " +
                        (d.properties.value).toLocaleString() + " Million")			
			   .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");		       
        })
        .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
        
    
    });
});




