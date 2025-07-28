import * as Plot from "@observablehq/plot";

const data = [
  { date: new Date("2025-01-01"), value: 10 },
  { date: new Date("2025-01-02"), value: 15 },
];

const plot = Plot.plot({
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
    Plot.cell(dji, {
      x: (d) => d3.utcWeek.count(d3.utcYear(d.Date), d.Date),
      y: (d) => d.Date.getUTCDay(),
      fy: (d) => d.Date.getUTCFullYear(),
      fill: (d, i) =>
        i > 0 ? (d.Close - dji[i - 1].Close) / dji[i - 1].Close : NaN,
      title: (d, i) =>
        i > 0
          ? (((d.Close - dji[i - 1].Close) / dji[i - 1].Close) * 100).toFixed(1)
          : NaN,
      inset: 0.5,
    }),
  ],
});

document.body.appendChild(plot);
