const fetch = require('node-fetch');
const states = require("./states");
const fs = require('fs');

fs.mkdirSync("./public/data/actual", { recursive: true }, (err) => {
  if (err) throw err
})

function parseDate (strDate, format) {
  // strDate is format "YYYYMMDD", return "YYYY-MM-DD"
  // in original code, format was always '%m/%d/%y' in python code; may need to adjust this at later date
  let str = strDate.toString();
  let year = str.slice(0,4);
  let month = str.slice(4,6);
  let day = str.slice(6,8);
  return month + "-" + day + "-" + year
 }

function getActuals (state) {
  // returns array of objects, with each object signifying a unique date chronologically for given state; each object has this data structure:
  //   date: '2020-05-30',
  //   state: 'CA',
  //   positive: 106878,
  //   negative: 1781717,
  //   pending: null,
  //   hospitalizedCurrently: 4215,
  //   hospitalizedCumulative: null,
  //   inIcuCurrently: 1273,
  //   inIcuCumulative: null,
  //   onVentilatorCurrently: null,
  //   onVentilatorCumulative: null,
  //   recovered: null,
  //   dataQualityGrade: 'B',
  //   lastUpdateEt: '5/30/2020 00:00',
  //   hash: '42bd1ee85b659102f837c87be6d91b631dbdf30a',
  //   dateChecked: '2020-05-30T20:00:00Z',
  //   death: 4156,
  //   hospitalized: null,
  //   total: 1888595,
  //   totalTestResults: 1888595,
  //   posNeg: 1888595,
  //   fips: '06',
  //   deathIncrease: 88,
  //   hospitalizedIncrease: 0,
  //   negativeIncrease: 50125,
  //   positiveIncrease: 2992,
  //   totalTestResultsIncrease: 53117

  // reduce to just show date (reformatted), current hospitalizations, and deaths

  fetch("https://covidtracking.com/api/v1/states/daily.json")
    .then(res => res.json())
    .then(json => {
      let actuals = json
        .reverse()
        .filter(row => row.date > 20200312 && row.state == state)
        .map(row => {
          return {
            date: parseDate(row.date),
            hospitalizations: row.hospitalizedCurrently || 0,
            death: row.death || 0
          }
        })

        fs.writeFileSync('./public/data/actual/' + state + '.json', JSON.stringify(actuals), err => {
          if (err) throw err;
          console.log('updating');
        })

      return actuals;
    })
    .catch(err => console.log("ERROR", err))
}

const abbreviations = states.stateAbbreviations;
function populateActualData() {
  abbreviations.forEach(state => getActuals(state))
}

exports.populateActualData = populateActualData;
