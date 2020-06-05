// run this to convert IHME csv into public data

let csv = require("csv-parser");
const fs = require('fs');
const statesObject = require('./states').states

fs.mkdirSync(__dirname + "/public/data/IHME", { recursive: true }, (err) => {
  if (err) throw err
})

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

const results = [];
fs.createReadStream(__dirname + '/public/IHME/Hospitalization_all_locs.csv')
  .pipe(csv())
  .on('data', data => results.push(data))
  .on('end', () => {
    // console.log(results[results.length-1]);
    states.forEach(state => {
      let stateArray = [];
      results.forEach(result => {
        if (result["location_name"] == state.name) {
          stateArray.push({
            date: parseDate(result["date"]),
            death: result["totdea_mean"],
            hospitalizations: result["allbed_mean"]
          })
        }
      })

      fs.writeFileSync(__dirname + "/public/data/IHME/" + state.abbreviation + ".json", JSON.stringify(stateArray), err => {
        if (err) throw err;
      })
    })
  });
