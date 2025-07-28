import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

console.log("try to wiat");
const res = await fetch("data/dates.json");
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();

console.log("done try to wiat");
console.log(data);

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
    y: { tickFormat: Plot.formatWeekday("en", "narrow"), tickSize: 0 },
    fy: { tickFormat: "" },
    color: {
      scheme: "PiYG",
      legend: true,
      label: "Daily change",
      tickFormat: "+%",
      domain: [-0.06, 0.06],
    },
    marks: [
      Plot.cell(parsedData, {
        x: (d) => d3.utcWeek.count(d3.utcYear(d.date), d.date),
        y: (d) => d.date.getUTCDay(),
        fy: (d) => d.date.getUTCFullYear(),
        fill: (d, i) => 10,
        title: (d, i) => 10,
        inset: 0.5,
      }),
    ],
  });
} catch (err) {
  console.error("Failed", err);
}
console.log("did make plot");

document.body.appendChild(plot);
