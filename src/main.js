import * as Plot from "@observablehq/plot";

const data = [
  { date: new Date("2025-01-01"), value: 10 },
  { date: new Date("2025-01-02"), value: 15 },
];

const plot = Plot.plot({
  marks: [Plot.line(data, { x: "date", y: "value" })],
});

document.body.appendChild(plot);
