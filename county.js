let fetch = require("node-fetch");
let fs = require("fs");
let states = require("./states.js").states;
let fipsUrl = "https://raw.githubusercontent.com/kjhealy/fips-codes/master/state_and_county_fips_master.csv"
let actualUrl = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv"

function parseDate (strDate) {
  // strDate is format "YYYY-MM-DD", return "MM-DD-YYYY"
  let str = strDate.toString();
  let year = str.slice(0,4);
  let month = str.slice(5,7);
  let day = str.slice(8,10);
  return month + "-" + day + "-" + year
}

function removeLeadingZero(fipsString) {
  if (fipsString.slice(0,1) == "0") return fipsString.slice(1,5);
  return fipsString
}

function addLeadingZero(fipsString) {
  if (fipsString.length == 4) return "0" + fipsString
  return fipsString
}


fs.mkdirSync("./public/data/actual/fips", { recursive: true }, (err) => {
  if (err) throw err
})

let fips = {}
fetch(fipsUrl).then(data => data.text())
  .then(text => {
    let lines = text.split("\n");
    lines = lines
      .map(a => a.replace("\r", ""))
      .map(b => b.split(","))
      .filter(c => { if (c[2] != "NA") return c })
      .filter((row, index) => { if (index != 0) return row })
    lines.forEach(line => {
      // console.log(line)
      fips[line[0]] = []
      // if (line[2] == state) fips[state].push({ name: line[1], fips: line[0] })
    })

    fips["46102"] = []; // Oglala County, South Dakota is missing

    // unsuspend & run this code to pull all actual data from NYT
    fetch(actualUrl).then(data => data.text())
      .then(text => {
        let lines = text.split("\n")
          .map(a => a.split(","))
          .filter((row, index) => { if (index != 0) return row })
        // [0] date in YYYY-MM-DD, [1] county, [2] state, [3] fips w/ leading 0, [4] cases, [5] deaths
        lines.forEach(line => {
          let date = parseDate(line[0]);
          let fip = line[3];
          let death = line[5];
          let cases = line[4];
          if (fip != "") {
            if (fips[removeLeadingZero(fip)] != undefined) {
              fips[removeLeadingZero(fip)].push({
                date,
                death,
                cases
              })
            }
          }
        })

        for (fip in fips) {
          fs.writeFileSync('./public/data/actual/fips/' + fip + '.json', JSON.stringify(fips[fip]), err => {
            if (err) throw err;
            console.log('updating');
          })
        }
      }).catch(err => console.log(err, "ERROR"))




    // this is all probably a bad idea to do:

    // let interventions = ["NO_INTERVENTION", "WEAK_INTERVENTION", "OBSERVED_INTERVENTION", "STRONG_INTERVENTION"]
    //
    // function checkStatus(res) {
    //   if (res.ok) {
    //       return res;
    //   } else {
    //       throw 'try again'
    //   }
    //
    // }
    // fs.mkdirSync("./public/data/actual/projections/latest", { recursive: true }, (err) => {
    //   if (err) throw err
    // })
    //
    // for (fip in fips) {
    //   fs.mkdirSync("./public/data/actual/projections/latest/" + fip, { recursive: true }, (err) => {
    //     if (err) throw err
    //   })
    //
    //   interventions.forEach((intervention, index) => {
    //     let url = "https://data.covidactnow.org/latest/us/counties/" + addLeadingZero(fip) + "." + intervention + ".timeseries.json"
    //     fetch(url).then(data => data.json())
    //       .then(checkStatus)
    //       .then(json => {
    //         console.log('here')
    //         let actuals = json.timeseries.map(date => {
    //           return {
    //             date: parseDate(date.date),
    //             death: date.cumulativeDeaths || 0
    //             // cases: date.cumulativeInfected || date.cumulativeConfirmedCases || 0
    //           }
    //         })
    //         fs.writeFileSync('./public/data/actual/projections/latest/' + fip + "/" + index + '.json', JSON.stringify(actuals), err => {
    //           if (err) throw err;
    //           console.log('updating');
    //         })
    //       }).catch(err => err);
    //   })
    // }
  }).catch(err => console.log(err))
