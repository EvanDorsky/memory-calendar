import { DateTime } from "luxon";

const f = Bun.file("data/trips.json");
const trips = JSON.parse(await f.text());

const g = Bun.file("data/geo.json");
const geo = JSON.parse(await g.text());

const tripDates = trips2Dates(trips, geo);

await Bun.write("public/data/dates.json", JSON.stringify(tripDates, null, 2));

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

function daysForYear(year: number) {
  const start = DateTime.utc(year, 1, 1);
  const end = DateTime.utc(year + 1, 1, 1);
  const dates = [];
  for (let d = start; d < end; d = d.plus({ days: 1 })) {
    dates.push({
      date: d,
      country: "",
    });
  }

  return dates;
}

function yearDays(years: Array<any>): Array<Object> {
  const allDays = [];

  // for each year
  for (let year = years[0]; year <= years[1]; year++) {
    allDays.push(...daysForYear(year));
  }

  return allDays;
}

export function trip2Dates(trip: Object, geo: Object) {
  const country = countryFromCity(city, geo);
}

export function trips2Dates(trips: Object, geo: Object): Array<any> {
  // parse out the legs, return a date list

  const days = yearDays([2022, 2025]);

  // the date list needs to have all the days from the entire year
  const tripDays: Array<any> = [];
  Object.entries(trips).forEach(([name, trip]) => {
    let runningDate = DateTime.fromISO(trip.firstnight);

    trip.legs.forEach((leg: Array<any>) => {
      const city = leg[0];
      const country = countryFromCity(city, geo);
      const durationDays = leg[1];

      for (let i = 0; i < durationDays; i++) {
        let date = {
          // ISO format
          date: runningDate,
          country: country,
        };

        runningDate = runningDate.plus({ days: 1 });

        tripDays.push(date);
      }
    });
  });

  // TODO: sort the tripDates list by date to make this next step faster

  days.forEach((day) => {
    const date = day.date

    tripDays.forEach((tripDay) => {
      const tripDate = DateTime.fromISO(tripDay.date);

      if (date.hasSame(tripDate, "day")) {
        day.country = tripDay.country;
      }
    });
  });

  return days;
}
