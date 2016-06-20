/**********************************************************************
File: caCounty.js
**********************************************************************/

/* Define Width & Height */
var width = 1100,
    height = 1100;

/* Define Path */
var path = d3.geo.path().projection(null);

/* Define green color scale */ 
var colors = d3.scale.threshold().range(colorbrewer.Greens[6]);

var colors_two = d3.scale.quantize().range(colorbrewer.Reds[6]);

/* Define svg */
var svg = d3.select("body").append("svg")
    .attr("width", width/2)
    .attr("height", height/2);

/* Define canvas */
var canvas = d3.select("body").append("svg")
    .attr("width", width/2)
    .attr("height", height/2)
    .attr("transform", "translate(20,0)");

/* Define Tooltip */
var tooltip = d3.select("body").append("div").attr("class", "tooltip");

/* Define legend scale */
var threshold = d3.scale.threshold()
  .domain([.1, 1, 2, 3, 4])
  .range(colorbrewer.Greens[6]);
var x = d3.scale.linear()
  .domain([-0.6, 5])
  .range([0, 400]);
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .tickSize(13)
  .tickValues(threshold.domain())
  .tickFormat(function(d) { return (1000 * d); });


/* Define legend scale for map_two*/
var threshold_two = d3.scale.threshold()
  .domain([ .7, 1.1,  1.5, 1.9, 2.3, 2.7])
  .range(colorbrewer.Reds[7]);
var x_two = d3.scale.linear()
  .domain([0, 2.7])
  .range([0, 400]);
var xAxis_two = d3.svg.axis()
  .scale(x_two)
  .orient("bottom")
  .tickSize(13)
  .tickValues(threshold_two.domain())
  .tickFormat(function(d) { return (  10 * d); });

/* Load County Population Data */
d3.csv("data/caPop2013.csv", function(error,data) {


  /* Set green color domain based on max, miv values of population */
  colors.domain([ 100000, 1000000, 2000000,3000000, 4000000]);
//      d3.min(data, function(d) { return d.populationvalue*.07; }), 
//      d3.max(data, function(d) { return d.populationvalue*.109; })
//  ]);

  /* Load California TopoJSON file */
  d3.json("data/ca_min.json", function(error, ca) {
    
    /* Bind data from caPop2014.csv file and ca.json file */
    var counties_json = topojson.feature(ca, ca.objects.counties);
    for (var i = 0; i < data.length; i++) {
      var county_name = data[i].counties;
      var population_value = parseFloat(data[i].populationvalue);
      /* DEBUG 
      console.log(dataCounty, dataPopulation); 
      */
      for (var j = 0; j < counties_json.features.length; j++) {
        var ca_county = counties_json.features[j].properties.name;
        if (county_name == ca_county) {
          counties_json.features[j].properties.value = population_value;
          break;
        }
      }
    }
  /* Helper function to population string thousand vs million */  
  function populationString(d) {
    if (d < 999999) return d.toLocaleString();
    else return d.toLocaleString();    
  } 

    /* Display data(county name, populaiton) and choropleth */
    svg.selectAll("path")
      .data(counties_json.features)
      .enter()
      .append("path")
      .attr("class", ".county-border")
      .attr("d", path)
      .style("fill", function(d) { return colors(d.properties.value); })
      /* Tooltip information */
      .on("mouseover", function(d) {   
        tooltip.transition()
        .duration(200)
        .style("opacity", .9);
        /* Tooltip will display: county name and population value */
        tooltip.html(d.properties.name + "</br>" + "Population: " + 
                     populationString(d.properties.value))	
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 28) + "px");		       
      })
      .on("mouseout", function(d) {
        tooltip.transition()
        .duration(400)
        .style("opacity", 0);
      });

  /* Black boundary between each county */
    var counties_mesh = topojson.mesh(ca, ca.objects.counties);
    svg.append("path")
      .datum(counties_mesh, function(a, b) { return a !== b; })
      .attr("class", "boundary")
      .attr("d", path);

    /* Draw legend */ 
    var legend = svg.append("g")
      .attr("class", "key")
      .attr("transform", "translate(130,520)");

    legend.selectAll("rect")
      .data(threshold.range().map(function(color) {
        var d = threshold.invertExtent(color);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
      }))
    .enter().append("rect")
      .attr("height", 8)
      .attr("x", function(d) { return x(d[0]); })
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })
      .style("fill", function(d) { return threshold(d[0]); });

    legend.call(xAxis).append("text")
      .attr("class", "caption")
      .attr("y", -6)
      .text("Population Scale (in Thousands) 2013 ");
 
  });  /* end d3.json function */
}); /* end d3.csv function */

//---------------- MAP 2 ----------------------------------------------

d3.csv("data/caPoverty2011.csv", function(error,data) {

  /* Set blue color domain based on max, miv values of poverty*/
  colors_two.domain([3,27]);
//      d3.min(data, function(d) { return d.povertyvalue * 0.9; }), 
//      d3.max(data, function(d) { return d.povertyvalue *0.9 ; })
//  ]);
 
  /* Load California TopoJSON file */
  d3.json("data/ca_min.json", function(error, ca) {
    
    /* Bind data from caPop2014.csv file and ca.json file */
    var counties_json = topojson.feature(ca, ca.objects.counties);
    for (var i = 0; i < data.length; i++) {
      var county_name = data[i].counties;
      var poverty_value = parseFloat(data[i].povertyvalue);
      /* DEBUG 
      console.log(dataCounty, dataPopulation); 
      */
      for (var j = 0; j < counties_json.features.length; j++) {
        var ca_county = counties_json.features[j].properties.name;
        if (county_name == ca_county) {
          counties_json.features[j].properties.value = poverty_value;
          break;
        }
      }
    } 
    /* Display data(county name, populaiton) and choropleth */
    canvas.selectAll("path")
      .data(counties_json.features)
      .enter()
      .append("path")
      .attr("class", ".county-border")
      .attr("d", path)
      .style("fill", function(d) { return colors_two(d.properties.value); })
      /* Tooltip information */
      .on("mouseover", function(d) {   
        tooltip.transition()
        .duration(200)
        .style("opacity", .9);
        /* Tooltip will display: county name and population value */
        tooltip.html(d.properties.name + "</br>" + "Poverty: " + 
                    d.properties.value + " %") 
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 28) + "px");           
      })
      .on("mouseout", function(d) {
        tooltip.transition()
        .duration(400)
        .style("opacity", 0);
      });

  /* Black boundary between each county */
    var counties_mesh = topojson.mesh(ca, ca.objects.counties);
    canvas.append("path")
      .datum(counties_mesh, function(a, b) { return a !== b; })
      .attr("class", "boundary")
      .attr("d", path);

    /* Draw legend */ 
    var legend = canvas.append("g")
      .attr("class", "key")
      .attr("transform", "translate(120,520)");

    legend.selectAll("rect")
      .data(threshold_two.range().map(function(colors_two) {
        var d = threshold_two.invertExtent(colors_two);
        if (d[0] == null) d[0] = x_two.domain()[0];
        if (d[1] == null) d[1] = x_two.domain()[1];
        return d;
      }))
    .enter().append("rect")
      .attr("height", 8)
      .attr("x", function(d) { return x_two(d[0]); })
      .attr("width", function(d) { return x_two(d[1]) - x_two(d[0]); })
      .style("fill", function(d) { return threshold_two(d[0]); });

    legend.call(xAxis_two).append("text")
      .attr("class", "caption")
      .attr("y", -6)
      .text("Poverty Scale (%) 2011");
    
 
  });  /* end d3.json function */
}); /* end d3.csv function */
