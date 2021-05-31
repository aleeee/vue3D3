<template>
  <svg ref="svgRef"></svg>
</template>

<script>
import {
  json,
  csv,
  max,
  scaleSqrt,
  select,
  geoEqualEarth,
  geoPath,
  geoGraticule,
} from "d3";
import { feature, mesh } from "topojson-client";
const jsonUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";
const csvUrl =
  "https://gist.githubusercontent.com/curran/13d30e855d48cdd6f22acdf0afe27286/raw/0635f14817ec634833bb904a47594cc2f5f9dbf8/worldcities_clean.csv";
const sizeValue = (d) => d.population;
const maxRadius = 16;

export default {
  data() {
    return {
      events: null,
      countries: null,
      interiors: null,
      cities: null,
    };
  },
  mounted() {
    //cast string
    const row = (d) => {
      d.lat = +d.lat;
      d.lng = +d.lng;
      d.population = +d.population;
      return d;
    };

    json(jsonUrl).then((topology) => {
      //	const c = topology.objects;
      //using mesh function to get the interior borders
      const { countries } = topology.objects;
      (this.countries = feature(topology, countries)),
        (this.interiors = mesh(topology, countries, (a, b) => a !== b));

      if (this.cities) this.generateArc();
    });
    csv(csvUrl, row).then((city) => {
      this.cities = city;
    });
  },
  methods: {
    generateArc() {
      const projection = geoEqualEarth();
      const path = geoPath(projection);
      const graticule = geoGraticule();
      const width = window.innerWidth;
      const height = window.innerHeight;

      const sizeScale = scaleSqrt()
        .domain([0, max(this.cities, sizeValue)])
        .range([0, maxRadius]);

      const svg = select("svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg");
      const g = svg
        .append("g")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "marks");

      //make path to separate the ocean
      g.append("path")
        .attr("class", "sphere")
        .attr("d", path({ type: "Sphere" }));

      g.append("path").attr("class", "graticules").attr("d", path(graticule()));

      this.countries.features.map((feature) => {
        
        g.append("path")
          .attr("class", "country")
          .attr("d", path(feature))
          
      });

      g.append("path")
        .attr("class", "interiors")
        .attr("d", path(this.interiors));

      this.cities.map((d) => {
        const [x, y] = projection([d.lng, d.lat]);

        g.append("circle")
          .attr("r", sizeScale(sizeValue(d)))
          .attr("stroke", "black")
          .attr("fill", "yellow")
          .attr("cx", x)
          .attr("cy", y);
      });
    },
  },
};
</script>

<style >
body {
  margin: 0pt;
  overflow: hidden;
}

pre {
  font-size: 7em;
}

.marks .country {
  fill: #0e0e0f;
}

.country:hover {
  fill: red;
}

.marks .sphere {
  fill: #000000;
  stroke: #c0c0bb;
}
.marks .interiors {
  fill: none;
  stroke: red;
}

.marks .graticules {
  fill: none;
  stroke: #afafaf;
  opacity: 0.5;
}
circle {
  fill: #dedb15;
  opacity: 0.5;
}
</style>