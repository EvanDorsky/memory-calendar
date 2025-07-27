export function trips2Dates(trips: Object) {}

const f = Bun.file("data/geo.json");
const t = await f.text();

console.log(t);
