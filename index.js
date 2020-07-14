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

app.get('/all', (req, res) => {
  console.log("request at /all");
  res.sendFile(path.join(__dirname + '/allTable.html'));
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

app.get("/repop/new/usa", (req, res) => {
  populateUsaData.populateUsaData();
  res.send('repop new usa!')
});

app.get('/pull/actual', (req, res) => {
  getActualData();
  res.send("repop actual!");
});

app.get('/pull/actual/usa', (req, res) => {
  populateUsaData.populateUsaDataActual();
  res.send('repop usa!');
});

app.listen(process.env.PORT || 9999, () => {
  console.log("listening...");
});
