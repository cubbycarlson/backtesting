const fetch = require('node-fetch');
const states = require("./states").states;
const stateAbbreviations = require("./states").stateAbbreviations;
const fs = require('fs');
let csv = require("csv-parser");

fs.mkdirSync("./public/data/test", { recursive: true }, (err) => {
  if (err) throw err
})

fs.mkdirSync("./public/data/test/actual", { recursive: true }, (err) => {
  if (err) throw err
})

function parseDate (strDate, format) {
  // strDate is format "YYYYMMDD", return "MM-DD-YYYY"
  let str = strDate.toString();
  let year = str.slice(0,4);
  let month = str.slice(4,6);
  let day = str.slice(6,8);
  return month + "-" + day + "-" + year
 }

function rearrangeDate(strDate) {
  // strDate is format "YYYY-MM-DD", return "MM-DD-YYYY"
  let str = strDate.toString();
  let year = str.slice(0,4);
  let month = str.slice(5,7);
  let day = str.slice(8,10);
  return month + "-" + day + "-" + year
}

const downloadFile = (async (url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", (err) => {
        reject(err);
      });
      fileStream.on("finish", function() {
        resolve();
      });
    });
});

let covidtrackingUrl = "https://covidtracking.com/api/v1/states/daily.json"
let nytUsaUrl = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv"
let ntyStatesUrl = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv"
let nytCountiesUrl = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv"

function getData() {
   let urls = [
     downloadFile(covidtrackingUrl, __dirname + "/public/data/test/actual/hospitalizations.json"),
     downloadFile(nytUsaUrl, __dirname + "/public/data/test/actual/us.csv"),
     downloadFile(ntyStatesUrl, __dirname + "/public/data/test/actual/states.csv"),
     downloadFile(nytCountiesUrl, __dirname + "/public/data/test/actual/counties.csv")
   ]
   return Promise.all(urls);
}

getData()
  .then(nothing => {
    let hospitalizationsRaw = fs.readFileSync(__dirname + '/public/data/test/actual/hospitalizations.json');
    let hospitalizationsData = JSON.parse(hospitalizationsRaw);

    let usaData = [];
    fs.createReadStream(__dirname + '/public/data/test/actual/us.csv')
      .pipe(csv())
      .on('data', data => usaData.push(data))
      .on('end', () => {
        console.log("usa format:", usaData[0])
        console.log

        let statesData = [];
        fs.createReadStream(__dirname + '/public/data/test/actual/states.csv')
          .pipe(csv())
          .on('data', data => statesData.push(data))
          .on('end', () => {
            console.log("state format:", statesData[0])

            for (state in states) {
              let stateHospitalizations = hospitalizationsData
                .filter(a => a.state === state)
                .map(b => {
                  return {
                    date: parseDate(b.date.toString()),
                    hospitalizations: b.hospitalizedCurrently || 0
                  }
                })
                .reverse()

              let stateDeath = statesData
                .filter(a => a.state === states[state])
                .map(b => {
                  return {
                    date: rearrangeDate(b.date),
                    death: Number(b.deaths)
                  }
                })

              let stateArray = [];
              let stateArrayObject = { hospitalizations: 0, death: 0 }
              stateDeath.forEach(deathRow => {
                stateHospitalizations.forEach(hospRow => {
                  if (deathRow.date == hospRow.date) {
                    stateArray.push({
                      date: deathRow.date,
                      hospitalizations: hospRow.hospitalizations,
                      death: deathRow.death
                    })
                  }
                })
              })
              fs.writeFileSync(__dirname + '/public/data/actual/' + state + '.json', JSON.stringify(stateArray), err => {
                if (err) throw err;
                console.log('updating');
              })
            }
        })

      })

      console.log(usaData);

    //
    // let counties = [];
    // fs.createReadStream(__dirname + '/public/data/test/actual/counties.csv')
    //   .pipe(csv())
    //   .on('data', data => usa.push(data))
    //   .on('end', () => { console.log(usa) })


    //
    //
    // fetch("https://covidtracking.com/api/v1/states/daily.json")
    //   .then(res => res.json())
    //   .then(json => {
    //     let actuals = json
    //       .reverse()
    //       .filter(row => row.date > 20200312 && row.state == state)
    //       .map(row => {
    //         return {
    //           date: parseDate(row.date),
    //           hospitalizations: row.hospitalizedCurrently || 0,
    //           death: row.death || 0
    //         }
    //       })
    //
    //       fs.writeFileSync('./public/data/actual/' + state + '.json', JSON.stringify(actuals), err => {
    //         if (err) throw err;
    //         console.log('updating');
    //       })
    //
    //     return actuals;
    //   })
    //   .catch(err => console.log("ERROR", err))





  })
  .catch(err => console.log(err))


function getUsaData() {

}

function getStateData (state) {

}

function getCountyData () {

}
