const fs = require('fs');
const stateAbbreviations = require("./states").stateAbbreviations;
const dateToCommit = require('./dateToCommit').dateToCommit;
const interventions = require('./populateProjectionData').interventions;

function populateUsaData() {
  function populate (intervention) {
    let usa = {};
    for (let commit in dateToCommit) {
      usa[commit] = {};
      let json = [];
      stateAbbreviations.forEach(state => {
        let raw = fs.readFileSync(__dirname + '/public/data/projections/' + commit + '/' + intervention + '/' + state + '.json');
        let data = JSON.parse(raw);
        json = json.concat(data);
      });

      json.forEach(stateData => {
        usa[commit][stateData.date] = {
          death: 0,
          hospitalizations: 0
        }
      })

      json.forEach(stateData => {
        usa[commit][stateData.date].death = usa[commit][stateData.date].death += stateData.death
        usa[commit][stateData.date].hospitalizations = usa[commit][stateData.date].hospitalizations += stateData.hospitalizations
      })
    }

    for (let commitDate in usa) {
      let usaArray = [];
      for (let date in usa[commitDate]) {
        let row = {
          date,
          death: usa[commitDate][date].death,
          hospitalizations: usa[commitDate][date].hospitalizations
        }
        usaArray.push(row);
      }

      fs.writeFileSync('./public/data/projections/' + commitDate + '/' + intervention + '/US.json', JSON.stringify(usaArray), err => {
        if (err) throw err;
        console.log('updating');
      })
    }
  }
  for (intervention in interventions) {
    populate(interventions[intervention])
  }
  // populate();
}

function populateUsaDataActual () {
  let usa = {};
  let json = [];
  stateAbbreviations.forEach(state => {
    let raw = fs.readFileSync(__dirname + '/public/data/actual/' + state + '.json');
    let data = JSON.parse(raw);
    json = json.concat(data);
  });

  json.forEach(stateData => {
    usa[stateData.date] = {
      death: 0,
      hospitalizations: 0
    }
  })

  json.forEach(stateData => {
    usa[stateData.date].death = usa[stateData.date].death += stateData.death
    usa[stateData.date].hospitalizations = usa[stateData.date].hospitalizations += stateData.hospitalizations
  })

  let usaArray = [];
  for (let date in usa) {
    let row = {
      date,
      death: usa[date].death,
      hospitalizations: usa[date].hospitalizations
    }
    usaArray.push(row);
  }

  fs.writeFileSync(__dirname + '/public/data/actual/US.json', JSON.stringify(usaArray), err => {
    console.log(err);
    if (err) throw err;
    console.log('updating');
  })
}

exports.populateUsaData = populateUsaData;
exports.populateUsaDataActual = populateUsaDataActual;
