const fs = require('fs');
const stateAbbreviations = require("./states").stateAbbreviations;
const dateToCommit = require('./dateToCommit').dateToCommit;
const interventions = require('./populateProjectionData').interventions;

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

      function concatUsa () {
        let concatUsaObject = {};
        let startDate = '04-01-2020';
        let endDate = '04-01-2020';
        for (dates in usaArray) {
          if (usaArray[dates].date < startDate) startDate = usaArray[dates].date
          if (usaArray[dates].date > endDate) endDate = usaArray[dates].date
        }

        let newStartDate = new Date(startDate);
        let newEndDate = new Date(endDate);

        concatUsaObject = {}

        for (let i = newStartDate; newStartDate < newEndDate; newStartDate.setDate(newStartDate.getDate() + 4)) {
          concatUsaObject[isoToDate(newStartDate)] = { death: 0, hospitalizations: 0 };
        }

        return concatUsaObject;
      }

      let concatUsaObject = concatUsa(); // object with format commit: { date: {death = 0, hospitalization = 0} }
      // console.log(usaArray); array of dates with format {date, death, hospitalizations}

      // goal = array of dates with format {date, death, hospitalizations}

      for (date in concatUsaObject) {
        usaArray.forEach(row => {
          let concatDate = new Date(date);
          let arrayDate = new Date(row.date);

          if (concatDate.getTime() == arrayDate.getTime()) {
            concatUsaObject[date].death = concatUsaObject[date].death += row.death
            concatUsaObject[date].hospitalizations = concatUsaObject[date].hospitalizations += row.hospitalizations
          }
          concatDate.setDate(concatDate.getDate() + 1)
          if (concatDate.getTime() == arrayDate.getTime()) {
            concatUsaObject[date].death = concatUsaObject[date].death += row.death
            concatUsaObject[date].hospitalizations = concatUsaObject[date].hospitalizations += row.hospitalizations
          }
          concatDate.setDate(concatDate.getDate() + 1)
          if (concatDate.getTime() == arrayDate.getTime()) {
            concatUsaObject[date].death = concatUsaObject[date].death += row.death
            concatUsaObject[date].hospitalizations = concatUsaObject[date].hospitalizations += row.hospitalizations
          }
          concatDate.setDate(concatDate.getDate() + 1)
          if (concatDate.getTime() == arrayDate.getTime()) {
            concatUsaObject[date].death = concatUsaObject[date].death += row.death
            concatUsaObject[date].hospitalizations = concatUsaObject[date].hospitalizations += row.hospitalizations
          }
        });
      }

      let usaArrayConcat = [];
      for (concatDate in concatUsaObject) {
        usaArrayConcat.push({
          date: concatDate,
          death: concatUsaObject[concatDate].death,
          hospitalizations: concatUsaObject[concatDate].hospitalizations,
        })
      }

      fs.writeFileSync('./public/data/projections/' + commitDate + '/' + intervention + '/US.json', JSON.stringify(usaArrayConcat), err => {
        if (err) throw err;
        console.log('updating');
      })
    }
  }
  for (intervention in interventions) {
    populate(interventions[intervention])
  }
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
