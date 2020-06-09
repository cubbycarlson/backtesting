// run this to convert IHME csv into public data

let csv = require("csv-parser");
const fs = require('fs');
const statesObject = require('./states').states

fs.mkdirSync(__dirname + "/public/data/IHME", { recursive: true }, (err) => {
  if (err) throw err
})

let ihmeDates = ["03-25-2020", "03-31-2020", "04-08-2020", "04-13-2020", "05-20-2020", "05-29-2020"];
// let ihmeDates = ["04-08-2020", "04-13-2020", "05-20-2020", "05-29-2020"];
// 03-25-2020 has "location_name" onstead of "location", and "date_reported" instead of "date"

let states = [];
for (state in statesObject) {
  states.push({ name: statesObject[state], abbreviation: state })
}
states.push({ name: 'United States of America', abbreviation: "US" });

function parseDate (strDate) {
  // YYYY-MM-DD to MM-DD-YYYY
  let str = strDate.toString();
  let year = str.slice(0,4);
  let month = str.slice(5,7);
  let day = str.slice(8,10);
  return month + "-" + day + "-" + year
}

ihmeDates.forEach(commit => {
  fs.mkdirSync(__dirname + "/public/data/IHME/" + commit, { recursive: true }, (err) => {
    if (err) throw err
  })

  const results = [];
  fs.createReadStream(__dirname + '/public/IHME ' + commit + '/Hospitalization_all_locs.csv')
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', () => {
      if (commit == "03-25-2020") {
        states.forEach(state => {
          let stateArray = [];
          results.forEach(result => {
            if (result["location_name"] == state.name) {
              stateArray.push({
                date: parseDate(result["date_reported"]),
                death: Number(result["totdea_mean"]),
                hospitalizations: Number(result["allbed_mean"])
              })
            }
          })

          fs.writeFileSync(__dirname + "/public/data/IHME/" + commit + "/" + state.abbreviation + ".json", JSON.stringify(stateArray), err => {
            if (err) throw err;
          })
        })
      } else if (commit == "03-31-2020") {
        states.forEach(state => {
          let stateArray = [];
          results.forEach(result => {
            if (result["location"] == state.name) {
              stateArray.push({
                date: parseDate(result["date"]),
                death: Number(result["totdea_mean"]),
                hospitalizations: Number(result["allbed_mean"])
              })
            }
          })
          console.log(stateArray);

          fs.writeFileSync(__dirname + "/public/data/IHME/" + commit + "/" + state.abbreviation + ".json", JSON.stringify(stateArray), err => {
            if (err) throw err;
          })
        })
      } else {
        states.forEach(state => {
          let stateArray = [];
          results.forEach(result => {
            if (result["location_name"] == state.name) {
              stateArray.push({
                date: parseDate(result["date"]),
                death: Number(result["totdea_mean"]),
                hospitalizations: Number(result["allbed_mean"])
              })
            }
          })
          console.log(stateArray);

          fs.writeFileSync(__dirname + "/public/data/IHME/" + commit + "/" + state.abbreviation + ".json", JSON.stringify(stateArray), err => {
            if (err) throw err;
          })
        })
      }
    });
})
