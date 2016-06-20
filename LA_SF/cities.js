/**********************************************************************
File: cities.js
**********************************************************************/

document.write('<button id="Population" class="Button" onclick="population();">Population</button>');
document.write('<button id="Housing" class="Button" onclick="housing();">Housing</button>');
document.write('<button id="Income" class="Button" onclick="income();">Income</button>');
document.write('<button id="Poverty" class="Button" onclick="poverty();">Poverty</button>');
document.write('<button id="Employment" class="Button" onclick="employment();">Employment</button>');

/* Define Width & Height */
var width = 1100,
    height = 1100;

/* Define Path */
var path = d3.geo.path().projection(null);

/* Define green color scale */
var pop_colors = d3.scale.threshold().range(colorbrewer.Greens[7]);
    pop_colors.domain([1000, 2000, 3000, 4000, 5000, 8000]);
var house_colors = d3.scale.threshold().range(colorbrewer.Reds[6]);
    house_colors.domain([10000, 50000, 100000, 500000, 1000000]);
var income_colors = d3.scale.threshold().range(colorbrewer.Blues[6]);
      income_colors.domain([20000, 40000, 60000, 80000, 100000]);

var poverty_colors = d3.scale.threshold().range(colorbrewer.Oranges[8]);
      poverty_colors.domain([100, 300, 500, 700, 1000, 2000, 3000]);

var employment_colors = d3.scale.threshold().range(colorbrewer.Purples[7]);
     employment_colors.domain([ 20, 30, 40, 50, 60, 70]);

var tooltip = d3.select("body").append("div").attr("class", "tooltip");

/* Define svg */
var svg = d3.select("body").append("svg")
    .attr("class", "svg1")
    .attr("width", width/2)
    .attr("height", height/2);

var canvas = d3.select("body").append("svg")
    .attr("class", "svg2")
    .attr("width", width/2)
    .attr("height", height/2);

  d3.csv("LA2013.csv", function(error, data) {
    if (error) console.log("Error: Data not loaded!");
    data.forEach(function(d) {
      d.population = +d.population;
      d.housing = +d.housing;
      d.income = +d.income;
      d.poverty = +d.poverty;
      d.employment = +d.employment;

    });

  /* Load California TopoJSON file */
  d3.json("la.json", function(error, la) {

    /* Bind data from caPop2014.csv file and ca.json file */
    la_json = topojson.feature(la, la.objects.la);
    for (var i = 0; i < data.length; i++) {
        var geoid_val = data[i].id2;
        var la_pop_value = data[i].population;
        var la_housing_value = data[i].housing;
        var la_income_value = data[i].income;
        var la_poverty_value = data[i].poverty;
        var la_employment_value = data[i].employment;
        // DEBUG console.log(country_name, year_value);
        for (var j = 0; j < la_json.features.length; j++) {
          var name = la_json.features[j].properties.name;
          if (geoid_val === name) {
            la_json.features[j].properties.value = la_pop_value;
            la_json.features[j].properties.housevalue = la_housing_value;
            la_json.features[j].properties.incomevalue = la_income_value;
            la_json.features[j].properties.povertyvalue = la_poverty_value;
            la_json.features[j].properties.employmentvalue = la_employment_value;
            break;
          }
        }
      }

    /* Display data(county name, populaiton) and choropleth */
    svg.selectAll("path")
      .data(la_json.features)
      .enter()
      .append("path")
      .attr("d", path)
       .style("fill", function(d) {
         if (d.properties.value) return pop_colors(d.properties.value);
         else return "grey"});


         var la_mesh = topojson.mesh(la, la.objects.la);
             svg.append("path")
               .datum(la_mesh, function(a, b) { return a !== b; })
               .attr("class", "boundary")
               .attr("d", path);

   });  /* end d3.json function */
 });  /* end d3.csv function */

//---------------- MAP 2 --------------------------


d3.csv("SF2013.csv", function(error, data) {
  if (error) console.log("Error: Data not loaded!");
data.forEach(function(d) {
  d.population = +d.population;
  d.housing = +d.housing;
  d.income = +d.income;
  d.poverty = +d.poverty;
  d.employment = +d.employment;

});


/* Load California TopoJSON file */
d3.json("sf.json", function(error, sf) {

  /* Bind data from caPop2014.csv file and ca.json file */
  sf_json = topojson.feature(sf, sf.objects.sf);
  for (var i = 0; i < data.length; i++) {
      var geoid_val = data[i].id2;
      var sf_pop_value = data[i].population;
      var sf_housing_value = data[i].housing;
      var sf_income_value = data[i].income;
      var sf_poverty_value = data[i].poverty;
      var sf_employment_value = data[i].employment;

      // DEBUG console.log(country_name, year_value);
      for (var j = 0; j < sf_json.features.length; j++) {
        var name = sf_json.features[j].properties.name;
        if (geoid_val === name) {
          sf_json.features[j].properties.value = sf_pop_value;
          sf_json.features[j].properties.housevalue = sf_housing_value;
          sf_json.features[j].properties.incomevalue = sf_income_value;
          sf_json.features[j].properties.povertyvalue = sf_poverty_value;
          sf_json.features[j].properties.employmentvalue = sf_employment_value;

          break;
        }
      }
    }

  /* Display data(county name, population) and choropleth */
  canvas.selectAll("path")
    .data(sf_json.features)
    .enter()
    .append("path")

    .attr("d", path)
    .style("fill", function(d) {
      if (d.properties.value) return pop_colors(d.properties.value);
      else return "grey"});


               var sf_mesh = topojson.mesh(sf, sf.objects.sf);
                  canvas.append("path")
                     .datum(sf_mesh, function(a, b) { return a !== b; })
                     .attr("class", "boundary")
                     .attr("d", path);

});
});


function population() {
  svg.selectAll("path")
       .data(la_json.features)


       .transition().duration(1000)

  .style("fill",
  function(d) {
    if (d.properties.value) return pop_colors(d.properties.value);
    else return "grey"});

    canvas.selectAll("path")
         .data(sf_json.features)


         .transition().duration(1000)

    .style("fill",
    function(d) {
      if (d.properties.value) return pop_colors(d.properties.value);
      else return "grey"});
}


function housing() {
  svg.selectAll("path")
  .data(la_json.features)
   .transition().duration(1000)
  .style("fill",
  function(d) {
    if (d.properties.housevalue) return house_colors(d.properties.housevalue);
    else return "grey"});

  canvas.selectAll("path")
  .data(sf_json.features)
   .transition().duration(1000)
  .style("fill",
  function(d) {
    if (d.properties.housevalue) return house_colors(d.properties.housevalue);
    else return "grey"});

}
function income() {
  svg.selectAll("path")
  .data(la_json.features)
   .transition().duration(1000)
  .style("fill",
  function(d) {
    if (d.properties.incomevalue) return income_colors(d.properties.incomevalue);
    else return "grey"});

    canvas.selectAll("path")
    .data(sf_json.features)
     .transition().duration(1000)
    .style("fill",
    function(d) {
      if (d.properties.incomevalue) return income_colors(d.properties.incomevalue);
      else return "grey"});
}

function poverty() {
  svg.selectAll("path")
  .data(la_json.features)
   .transition().duration(1000)
  .style("fill",
  function(d) {
    if (d.properties.povertyvalue) return poverty_colors(d.properties.povertyvalue);
    else return "grey"});

    canvas.selectAll("path")
    .data(sf_json.features)
     .transition().duration(1000)
    .style("fill",
    function(d) {
      if (d.properties.povertyvalue) return poverty_colors(d.properties.povertyvalue);
      else return "grey"});
}

function employment() {
  svg.selectAll("path")
  .data(la_json.features)
   .transition().duration(1000)
  .style("fill",
  function(d) {
    if (d.properties.employmentvalue) return employment_colors(d.properties.employmentvalue);
    else return "grey"});

    canvas.selectAll("path")
    .data(sf_json.features)
     .transition().duration(1000)
    .style("fill",
    function(d) {
      if (d.properties.employmentvalue) return employment_colors(d.properties.employmentvalue);
      else return "grey"});
}
