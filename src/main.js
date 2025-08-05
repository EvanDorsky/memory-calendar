import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

const res = await fetch("data/dates.json");
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();

const parsedData = data.map((d) => ({
  ...d,
  date: new Date(d.date),
}));

console.log("make plot");
let plot = null;
try {
  plot = Plot.plot({
    padding: 0,
    x: { axis: null },
    y: { tickFormat: null, tickSize: 0 },
    fy: { tickFormat: "" },
    color: {
      range: ["#00000011", "#0077aaff"],
      legend: true,
      label: "Country",
      domain: [-10, 10],
    },
    marks: [
      Plot.cell(parsedData, {
        x: (d) => d3.utcWeek.count(d3.utcYear(d.date), d.date),
        y: (d) => d.date.getUTCDay(),
        fy: (d) => d.date.getUTCFullYear(),
        fill: (d, i) => {
          if (d.country) {
            return 10;
          } else {
            return -10;
          }
        },
        title: (d, i) => d.country,
        inset: 0.5,
      }),
    ],
  });
} catch (err) {
  console.error("Failed", err);
}
console.log("did make plot");

document.body.appendChild(plot);
