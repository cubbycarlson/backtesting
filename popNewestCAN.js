const fs = require('fs');
const fetch = require('node-fetch');
const states = require("./states")
const snapShotDates = require("./dateToCommit").snapShotDates

fs.mkdirSync("./public/data/projections", { recursive: true }, (err) => {
  if (err) throw err
})

function columnId(columnName, date) {
  const columns = { // NOTE: WHAT'S THIS?
    'hospitalizations': 8,
    'beds': 11,
    'cumulativeDeaths': 10,
    'cumulativeInfected': 9,
    'totalPopulation': 16,
    'date': 0
  }
  if (new Date(date) < new Date("2020,3,31")) {
    return columns[columnName]
  } else {
    return columns[columnName] + 1
  }
}

const interventions = {
  noAction: 0,
  strictShelterInPlace: 1,
  projected: 2,
  weakShelterInPlace: 3,
  // weakShetlerInPlaceTest: 7
}

function rearrangeDate(strDate) {
  // strDate is format "YYYY-MM-DD", return "MM-DD-YYYY"
  let str = strDate.toString();
  let year = str.slice(0,4);
  let month = str.slice(5,7);
  let day = str.slice(8,10);
  return month + "-" + day + "-" + year
}

function cumulativeToDaily (cumArray) {
  let dailyArray = [];
  for (let i = 0; i < cumArray.length; i++) {
    if (i === 0) {
      dailyArray[i] = cumArray[i]
    } else {
      dailyArray[i] = cumArray[i] - cumArray[i-1];
    }
  }
  return dailyArray
}

// example: https://data.covidactnow.org/snapshot/631/us/states/CA.OBSERVED_INTERVENTION.json
const canRepoUrl = "https://data.covidactnow.org/snapshot"

let interventionsList = ["NO_INTERVENTION", "WEAK_INTERVENTION", "OBSERVED_INTERVENTION", "STRONG_INTERVENTION"]

function getProjections(date, state, intervention) {

  console.log(date, state, intervention)
  const commit = snapShotDates[date];

  function checkStatus(res) {
    if (res.ok) {
        return res;
    } else {
        throw 'try again'
    }
  }

  console.log('fetching: ' + canRepoUrl + '/' + snapShotDates[date] + '/us/states/' + state + '.' + interventionsList[intervention] + '.timeseries.json')
  fetch(canRepoUrl + '/' + snapShotDates[date] + '/us/states/' + state + '.' + interventionsList[intervention] + '.timeseries.json')
    .then(checkStatus)
    .then(res => res.json())
    .then(projectionJsonRaw => {
      let timeseries = projectionJsonRaw.timeseries;
      let data = [];
      timeseries.forEach(row => {
        data.push({ date: rearrangeDate(row.date), death: row.cumulativeDeaths, hospitalizations: row.hospitalBedsRequired })
      })

      fs.writeFileSync(__dirname + '/public/data/projections/' + date + '/' + intervention + '/' + state + '.json', JSON.stringify(data), err => {
        if (err) throw err;
        console.log('updating', projectionJson.length, date, state);
      })
    })
    .catch(string => {
      // console.log(string)
      // tries lowercase instead of uppercase states
      // console.log('fetching: ' + canRepoUrl + '/' + snapShotDates[date] + '/us/states/' + state.toLowerCase() + '.' + interventionsList[intervention] + '.json')
      // fetch(canRepoUrl + '/' + snapShotDates[date] + '/' + state.toLowerCase() + '.' + interventionsList[intervention] + '.json')
      // .then(checkStatus)
      // .then(res => res.json())
      // .then(projectionJsonRaw => {
      //   let projectionJson = projectionJsonRaw.map(row => dailyStatistic(row, date))
      //   console.log('there');
      //   fs.writeFileSync(__dirname + '/public/data/projections/' + date + '/' + intervention + '/' + state + '.json', JSON.stringify(projectionJson), err => {
      //     if (err) throw err;
      //     console.log('updating', projectionJson.length, date, state);
      //   })
      // })
      // .catch(err => {
      //   console.log(err)
      // })
    })
    .catch(err => {
      console.log(err)
    })
}

const abbreviations = states.stateAbbreviations;

function populateProjectionData () {
  for (let commitDate in snapShotDates) {
    for (let intervention in interventions) {
      fs.mkdirSync("./public/data/projections/" + commitDate, { recursive: true }, (err) => {
        console.log(err);
      })
      fs.mkdirSync("./public/data/projections/" + commitDate + '/' + interventions[intervention], { recursive: true }, (err) => {
        console.log(err);
      })
    }
    abbreviations.forEach(state => {
      for (let intervention in interventions) {
        getProjections(commitDate, state, interventions[intervention]) // this is always 1, ask about and fix
      }
    })
  }
}

populateProjectionData();



exports.populateNewerProjectionData = populateProjectionData;
exports.interventions = interventions;
