// Define Margin
var margin = {top: 50, right: 80, bottom: 50, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Define Ranges of X-Y Axis Scale
var xScale = d3.scale.linear().range([0,width]),
    yScale = d3.scale.linear().range([height,0]);

// Define X-Y Axis
var xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// Define Tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Define SVG
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define Color
var colors = d3.scale.category20();

// Get Data
d3.csv("data.csv", function(error, data) {
    
    data.forEach(function(d) {
        d.country = d.country;
        d.gdp = +d.gdp;
        d.population = +d.population;
        d.ecc = +d.ecc;
        d.ec = +d.ec;
    })

    // Scale Range of Data
    xScale.domain([d3.min(data, function(d) { return d.gdp;})-1, d3.max(data, function(d) { return d.gdp;})+1]);
    yScale.domain([d3.min(data, function(d) { return d.ec;})-1, d3.max(data, function(d) { return d.ec;})+1]);
 

    
    // Draw Country Names
    svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.ec);})
        .attr("dx", "1.2em")
        .attr("dy", ".7em")
        .style("fill", "black")
        .text(function(d) {return d.country; });


    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
       .append("text")
        .attr("class", "label")
        .attr("x", width/2)
        .attr("y", 40)
        .style("text-anchor", "end")
        .text("GDP in US $ (2010)");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
       .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -50)
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Energy Consumption: Thousand Trillion BTU (2010)");


    // Graph Title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px")  
        .text("Zoomable Scatterplot");

    // Draw scatterplot
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return Math.sqrt(d.ecc/2); })
        .attr("cx", function(d) { return xScale(d.gdp);})
        .attr("cy", function(d) { return yScale(d.ec);})
        .style("fill", function(d) { return colors(d.country); })
        .on("mouseover", function(d) {
            tooltip.transition()
            .duration(600)
            .style("opacity", .9);
            tooltip.html("Population: " + d.population + " million" + "<br/>" + "GDP: $" + d.gdp 
            + " trillion" + "<br/> " + "ECC: " + d.ecc + " million BTUs" + "")
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
            .duration(600)
            .style("opacity", 0);
        });

    // Scale Changes as we zoom
    svg.call(d3.behavior.zoom().x(xScale).y(yScale).on("zoom", zoom));  // Call funtion zoom

    // Zoom into data (.dot)
    function zoom() {
        svg.selectAll(".dot")
            .attr("cx", function(d) { return xScale(d.gdp); })
            .attr("cy", function(d) { return yScale(d.ec); })
        svg.selectAll(".text")
            .attr("x", function(d) {return xScale(d.gdp);})
            .attr("y", function(d) {return yScale(d.ec);})
        d3.select('.x.axis').call(xAxis);
        d3.select('.y.axis').call(yAxis);
    }


    // Draw legend colored rectangles
    svg.append("rect")
        .attr("x", width-250)
        .attr("y", height-190)
        .attr("width", 220)
        .attr("height", 180)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-100)
        .attr("cy", height-175)
        .style("fill", "white");

    svg.append("circle")
        .attr("r", 15.8)
        .attr("cx", width-100)
        .attr("cy", height-150)
        .style("fill", "white");

    svg.append("circle")
        .attr("r", 50)
        .attr("cx", width-100)
        .attr("cy", height-80)
        .style("fill", "white");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-172)
        .style("text-anchor", "end")
        .text(" 1 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-147)
        .style("text-anchor", "end")
        .text(" 10 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-77)
        .style("text-anchor", "end")
        .text(" 100 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-15)
        .style("text-anchor", "middle")
        .style("fill", "Green") 
        .attr("font-size", "20px")
        .text("Total Energy Consumption"); 


    });
