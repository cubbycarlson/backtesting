const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const populateProjectionData = require('./populateProjectionData').populateProjectionData;
const populateActualData = require('./populateActualData').populateActualData;
const populateUsaData = require('./populateUsaData');


app.use("/public", express.static("public"));

app.get('/', (req, res) => {
  console.log("request at /");
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/repop', (req, res) => {
  console.log("request at /repop");
  function populateAllData () {
    fs.mkdirSync("./public/data", { recursive: true }, (err) => {
      if (err) throw err
    })
    populateProjectionData();
    populateActualData();
  }

  populateAllData();
  res.redirect('/')
  // res.sendFile(path.join(__dirname + '/html/index.html'));
})

app.get('/repopUSA', (req, res) => {
  console.log("request at /repopUSA");
  populateUsaData.populateUsaData();
  populateUsaData.populateUsaDataActual();

  // res.redirect('/')
  res.send('repop USA!');
  // res.sendFile(path.join(__dirname + '/html/index.html'));
})

app.listen(process.env.PORT || 9999, () => {
  console.log("listening...");
});
