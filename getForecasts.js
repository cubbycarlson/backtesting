// run this to pull UCLA from github, save raw CSVs into UCLA folder, and covnert to JSON

const fetch = require('node-fetch');
const states = require("./states").states;
const fs = require('fs');
let csv = require("csv-parser");

states["US"] = "US";

// exampleUrl: "https://raw.githubusercontent.com/reichlab/covid19-forecast-hub/master/data-processed/UCLA-SuEIR/2020-05-01-UCLA-SuEIR.csv";
let prefix = "https://raw.githubusercontent.com/reichlab/covid19-forecast-hub/master/data-processed"

let models = {
  ucla: {
    folderName: "UCLA",
    baseUrl: prefix + "/UCLA-SuEIR",
    // dates: ["2020-05-01", "2020-05-10", "2020-05-17", "2020-05-24", "2020-05-31", "2020-06-07"],
    dates: ["2020-06-07", "2020-06-14", "2020-06-21"],
    suffix: "-UCLA-SuEIR.csv"
  },

  mit: {
    folderName: "MIT",
    baseUrl: prefix + "/MIT_CovidAnalytics-DELPHI",
    // dates: ["2020-04-22", "2020-04-27", "2020-04-30", "2020-05-04", "2020-05-10", "2020-05-18", "2020-05-25", "2020-06-01", "2020-06-08"],
    dates: ["2020-06-15", "2020-06-22"],
    suffix: "-MIT_CovidAnalytics-DELPHI.csv"
  },

  ut: {
    folderName: "UT",
    baseUrl: prefix + "/UT-Mobility",
    // dates: ["2020-04-20", "2020-04-27", "2020-05-04", "2020-05-11", "2020-05-18", "2020-05-25", "2020-06-01", "2020-06-08"],
    dates: ["2020-06-15", "2020-06-22"],
    suffix: "-UT-Mobility.csv"
  },

  yyg: {
    folderName: "YYG",
    baseUrl: prefix + "/YYG-ParamSearch",
    dates: ["2020-04-15", "2020-04-22", "2020-04-30", "2020-05-14", "2020-05-28", "2020-06-15", "2020-06-23"],
    suffix: "-YYG-ParamSearch.csv"
  }
}

function pullData(src) {
  fs.mkdirSync(__dirname + "/public/data/" + src.folderName, { recursive: true }, (err) => {
    if (err) throw err
  })

  let baseUrl = src.baseUrl;
  let dates = src.dates;

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

  function fetches() {
     let urls = dates.map(date => downloadFile(baseUrl + "/" + date + src.suffix, __dirname + "/public/data/" + src.folderName + '/' + date + ".csv"))
     return Promise.all(urls);
  }

  fetches()
    .then(nothing => {
      dates.forEach(date => {
        let correctDate = rearrangeDate(date);
        fs.mkdirSync(__dirname + "/public/data/" + src.folderName + '/' + correctDate, { recursive: true }, (err) => {
          if (err) throw err
        })

        let results = [];
        fs.createReadStream(__dirname + '/public/data/' + src.folderName + '/' + date + ".csv")
          .pipe(csv())
          .on('data', data => results.push(data))
          .on('end', () => {
            for (state in states) {
              let stateResults = results
                .filter(a => a["location_name"] == states[state])
                .filter(b => b['type'] == 'point')
                .map(c => {
                  return {
                    date: rearrangeDate(c["target_end_date"]),
                    death: Number(c["value"])
                  }
                })
              fs.writeFileSync(__dirname + '/public/data/' + src.folderName + '/' + correctDate + '/' + state + '.json', JSON.stringify(stateResults), err => {
                if (err) throw err;
                console.log('updating');
              })
            }

            let usaResults = results
              .filter(a => a["location"] == "US")
              .filter(b => b['type'] == 'point')
              .map(c => {
                return {
                  date: rearrangeDate(c["target_end_date"]),
                  death: Number(c["value"])
                }
              })
            fs.writeFileSync(__dirname + '/public/data/' + src.folderName + '/' + correctDate + '/US.json', JSON.stringify(usaResults), err => {
              if (err) throw err;
              console.log('updating');
            })

      })
    })
  })
  .catch(err => console.log(err))
}

for (model in models) pullData(models[model])
