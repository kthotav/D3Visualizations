/**********************************************************************
File: gayMarriage.js
**********************************************************************/

// define height & width of SVG
var width = 1000,
    height = 500;

// define SVG
var mapsvg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// define path
var path = d3.geo.path().projection(null);

// define color
var color = d3.scale.linear()
    .domain([1, 5, 10,  15,  20])
    .range(["#ff0000", "#ee82ee", "#008000", "#0000ff", "#ffa500", "#ffff00", "#4b0082"]);

// define tooltip
var tooltip = d3.select("body").append("div").attr("class", "tooltip");

// load countires data
d3.csv("data/countries.csv", function(error, data) {
  if (error) console.log("Error: Data not loaded!");
  year: +data.year;
  day: +data.day;
  num: +data.num;

  // load world map
  d3.json("data/worldmap.json", function(error, mapjson) {
      if (error) console.log("Error: Data not loaded!");

      // bind data
      var countries_json = topojson.feature(mapjson, mapjson.objects.countries);
      for (var i = 0; i < data.length; i++) {
        var country_name = data[i].countries;
        var year_value = data[i].year;
        var day_value = data[i].day;
        var month_name = data[i].month;
        var num_value = data[i].num;

        for (var j = 0; j < countries_json.features.length; j++) {
          var country = countries_json.features[j].properties.name;
          if (country_name == country) {
            countries_json.features[j].properties.value = year_value;
            countries_json.features[j].properties.valueday = day_value;
            countries_json.features[j].properties.namemonth = month_name;
            countries_json.features[j].properties.valuenum = num_value;
            break;
          }
        }
      }


      // helper functions
      function showYear(d) {
        if (d != null) return d;
        else return "";
      }
      function showDay(d) {
        if (d != null) return d + ", ";
        else return "";
      }
      function showMonth(d) {
        if (d != null) return "Legalized on: " + d;
        else return "";
      }

      // display data
      mapsvg.selectAll("path")
        .data(countries_json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d) {
            if (d.properties.value != null) return color(d.properties.valuenum); else return "grey"
          })
        .on("mouseover", function(d) {
          tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
          tooltip.html(d.properties.name + "</br>" + showMonth(d.properties.namemonth) + " " + showDay(d.properties.valueday)  + showYear(d.properties.value))
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.transition()
        .duration(400)
        .style("opacity", 0);
      });

            // draw boundaries
            var countries_mesh = topojson.mesh(mapjson, mapjson.objects.countries);
            mapsvg.append("path")
              .datum(countries_mesh, function(a,b) { return a !== b;})
              .attr("class", "boundary")
              .attr("d", path);

  }); // end of d3.json, worldmap.json
}); // end of d3.csv, countires.csv
