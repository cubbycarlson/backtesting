const fs = require('fs');
const fetch = require('node-fetch');
const states = require("./states")
const dateToCommit = require("./dateToCommit")

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
  // weakShelterInPlaceTest: 7
}

function bestProjections(date) {
  if (date < "04-14-2020") {
    return interventions.strictShelterInPlace;
  } else {
    return interventions.projected
  }
}

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

function dailyStatistic (row, date) {
  function removeCommas(str) {
      while (str.search(",") >= 0) {
          str = (str + "").replace(',', '');
      }
      return str;
  };

  const newRow = {
    date: isoToDate(new Date(row[columnId('date', date)])),
    hospitalizations: Number(removeCommas(row[columnId('hospitalizations', date)])) || 0,
    death: Number(removeCommas(row[columnId('cumulativeDeaths'.replace(/\,/g,''), date)])) || 0
  }
  return newRow
}

const canRepoUrl = "https://raw.githubusercontent.com/covid-projections/covid-projections"
function getProjections(date, state, intervention, tester = false) {
  const commit = dateToCommit.dateToCommit[date];

  function checkStatus(res) {
    if (res.ok) {
        return res;
    } else {
        // console.log(res);
        throw 'try again'
    }
  }

  let fetchIntervention = intervention;
  if (intervention === 2) fetchIntervention = bestProjections(date);

  // if (tester) {
  //   fetch(canRepoUrl + '/' + commit + '/public/data/' + state.toLowerCase() + '.' + fetchIntervention + '.json')
  //     .then(res => {
  //       // console.log('HERE');
  //       return res.json();
  //     })
  //     .then(something => {
  //       console.log(canRepoUrl + '/' + commit + '/public/data/' + state + '.' + fetchIntervention + '.json');
  //       // console.log(something[35][8]);
  //       console.log(dailyStatistic(something[35], date))
  //       // console.log(something[36][8]);
  //       // console.log(dailyStatistic(something[36], date))
  //       // console.log(something[37][8]);
  //       // console.log(dailyStatistic(something[37], date))
  //     })
  // }

  console.log('fetching: ' + canRepoUrl + '/' + commit + '/public/data/' + state + '.' + fetchIntervention + '.json')
  fetch(canRepoUrl + '/' + commit + '/public/data/' + state + '.' + fetchIntervention + '.json')
    .then(checkStatus)
    .then(res => res.json())
    .then(projectionJsonRaw => {
      console.log('success: ' + canRepoUrl + '/' + commit + '/public/data/' + state + '.' + fetchIntervention + '.json')
      let projectionJson = projectionJsonRaw.map(row => dailyStatistic(row, date));
    })
    .catch(string => {
      // tries lowercase instead of uppercase states
      console.log('fetching: ' + canRepoUrl + '/' + commit + '/public/data/' + state.toLowerCase() + '.' + fetchIntervention + '.json')
      fetch(canRepoUrl + '/' + commit + '/public/data/' + state.toLowerCase() + '.' + fetchIntervention + '.json')
      .then(checkStatus)
      .then(res => res.json())
      .then(projectionJsonRaw => {
        console.log('success: ' + canRepoUrl + '/' + commit + '/public/data/' + state + '.' + fetchIntervention + '.json')
        let projectionJson = projectionJsonRaw.map(row => dailyStatistic(row, date))
        fs.writeFileSync(__dirname + '/public/data/projections/' + date + '/' + intervention + '/' + state + '.json', JSON.stringify(projectionJson), err => {
          // console.log('updating', projectionJson.length, date, state);
          if (err) throw err;
        })
      })
      .catch(err => {
        console.log('error: ' + canRepoUrl + '/' + commit + '/public/data/' + state.toLowerCase() + '.' + fetchIntervention + '.json')
      })
    })
    .catch(err => {
      console.log('error: ' + canRepoUrl + '/' + commit + '/public/data/' + state + '.' + fetchIntervention + '.json')
    })
}

const abbreviations = states.stateAbbreviations;

function populateProjectionData () {
  for (let commitDate in dateToCommit.dateToCommit) {
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
        let tester = (state == "CA" && commitDate == "03-23-2020")
        getProjections(commitDate, state, interventions[intervention], tester) // this is always 1, ask about and fix
      }
    })
  }
}

exports.populateProjectionData = populateProjectionData;
exports.interventions = interventions;
exports.bestProjections = bestProjections;
