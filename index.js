const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const populateProjectionData = require('./populateProjectionData').populateProjectionData;
const populateActualData = require('./populateActualData').populateActualData;
const populateUsaData = require('./populateUsaData');
const popNew = require('./populateNewProjectionData').populateNewProjectionData;
const getActualData = require('./getActualData').getActualData;

app.use("/public", express.static("public"));

app.get('/', (req, res) => {
  console.log("request at /");
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/repop/old', (req, res) => {
  console.log("request at /repop");
  function populateAllData () {
    fs.mkdirSync("./public/data", { recursive: true }, (err) => {
      if (err) throw err
    })
    populateProjectionData();
    populateActualData();
  }

  populateAllData();
  res.send("repop old!");
  // res.redirect('/')
  // res.sendFile(path.join(__dirname + '/html/index.html'));
})

app.get("/repop/new", (req, res) => {
  popNew();
  res.send('repop new!')
});

app.get('/repop/usa', (req, res) => {
  console.log("request at /repopUSA");
  // populateUsaData.populateUsaData();
  populateUsaData.populateUsaDataActual();

  // res.redirect('/')
  res.send('repop usa!');
  // res.sendFile(path.join(__dirname + '/html/index.html'));
})

app.get('/pull/actual', (req, res) => {
  getActualData();
  res.redirect("/");
})

app.listen(process.env.PORT || 9999, () => {
  console.log("listening...");
});

// TO DO: repop new a few times, repop usa prn, repop usa actual, get county data
