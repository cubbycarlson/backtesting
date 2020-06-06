// run this to convert IHME csv into public data

let csv = require("csv-parser");
const fs = require('fs');
const statesObject = require('./states').states

fs.mkdirSync(__dirname + "/public/data/cdc", { recursive: true }, (err) => {
  if (err) throw err
})

let states = [];
for (state in statesObject) {
  states.push({ name: statesObject[state], abbreviation: state })
}
states.push({ name: 'United States', abbreviation: "US" });

function isoToDate(isoDateObject) {
   let month = isoDateObject.getMonth() + 1
   if (month < 10) {
     month = '0' + month.toString()
   } else {
     month = month.toString()
   }
   let date = isoDateObject.getDate()
   if (date < 10) {
     date = '0' + date.toString()
   } else {
     date = date.toString()
   }
   let year = isoDateObject.getFullYear()
   let fullDate = month + '-' + date + '-' + year
   return fullDate
 }



const results = [];
fs.createReadStream(__dirname + '/public/CDC/Excess_Deaths_Associated_with_COVID-19.csv')
  .pipe(csv())
  .on('data', data => results.push(data))
  .on('end', () => {
    let filtered = results.filter(a => {
      return (new Date(a['﻿Week Ending Date']) > new Date("2/1/2020"));
    }).filter(b => {
      return b["Exceeds Threshold"] === "TRUE"
    }).filter(c => {
      return c["Type"] === "Predicted (weighted)"
    }).filter(d => {
      return d["Outcome"] === "All causes"
    })

    states.forEach(state => {
      let stateArrayHigher = [];
      let stateArrayLower = [];
      let higherDeathCounter = 0;
      let lowerDeathCounter = 0;
      filtered.filter(e => e["State"] == state.name).forEach(result => {
          let higherDeath = Number(result["Excess Higher Estimate"]);
          let lowerDeath = Number(result["Excess Lower Estimate"]);
          higherDeathCounter += higherDeath;
          lowerDeathCounter += lowerDeath;
          stateArrayHigher.push({
            date: isoToDate(new Date(result['﻿Week Ending Date'])),
            death: higherDeathCounter
          })
          stateArrayLower.push({
            date: isoToDate(new Date(result['﻿Week Ending Date'])),
            death: lowerDeathCounter
          })
      })

      fs.writeFileSync(__dirname + "/public/data/cdc/higher/" + state.abbreviation + ".json", JSON.stringify(stateArrayHigher), err => {
        if (err) throw err;
      })

      fs.writeFileSync(__dirname + "/public/data/cdc/lower/" + state.abbreviation + ".json", JSON.stringify(stateArrayLower), err => {
        if (err) throw err;
      })
    })
  });
