import { timeDay } from "d3-time";

const f = Bun.file("data/trips.json");
const trips = JSON.parse(await f.text());

const g = Bun.file("data/geo.json");
const geo = JSON.parse(await g.text());

const dates = trips2Dates(trips, geo);

await Bun.write("data/dates.json", JSON.stringify(dates, null, 2));

export function countryFromCity(cityKey: String, geo: Object) {
  // extremely bad naive "search" but this structure will always be small

  // also this "let res" pattern seems bad
  let res = null;
  Object.entries(geo).forEach(([country, cities]) => {
    cities.forEach((city: String) => {
      const cityNorm = city.toLowerCase();

      if (cityNorm === cityKey) {
        res = country;
      }
    });
  });

  return res;
}

export function trip2Dates(trip: Object, geo: Object) {
  const country = countryFromCity(city, geo);
}

export function trips2Dates(trips: Object, geo: Object): Array<any> {
  // parse out the legs, return a date list
  const tripDates: Array<any> = [];
  Object.entries(trips).forEach(([name, trip]) => {
    // const firstNight = Temporal.PlainDate.from(trip.firstnight);
    let runningDate = new Date(trip.firstnight);

    trip.legs.forEach((leg: Array<any>) => {
      const city = leg[0];
      const country = countryFromCity(city, geo);
      const durationDays = leg[1];

      for (let i = 0; i < durationDays; i++) {
        let date = {
          // ISO format
          date: runningDate.toLocaleDateString("en-CA"),
          country: country,
        };
        // lol
        runningDate = timeDay.offset(runningDate, 1);

        tripDates.push(date);
      }
    });
  });
  return tripDates;
}
