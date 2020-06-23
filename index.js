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

app.get('/old', (req, res) => {
  console.log("request at /");
  res.sendFile(path.join(__dirname + '/old.html'));
})

app.get('/comparison', (req, res) => {
  console.log("request at /comparison");
  res.sendFile(path.join(__dirname + '/comparison.html'));
})

app.get('/comparison1', (req, res) => {
  console.log("request at /comparison1");
  res.redirect('/comparison')
})

app.get('/comparison2', (req, res) => {
  console.log("request at /comparison");
  res.sendFile(path.join(__dirname + '/comparisonpreset.html'));
})

app.get('/comparison3', (req, res) => {
  console.log("request at /comparison");
  res.sendFile(path.join(__dirname + '/comparisonpreset2.html'));
})

app.get('/comparison/ihme', (req, res) => {
  console.log("request at /comparison/ihme");
  res.sendFile(path.join(__dirname + '/ihme.html'));
})

app.get('/comparison/ihme2', (req, res) => {
  console.log("request at /comparison/ihme2");
  res.sendFile(path.join(__dirname + '/ihme2.html'));
})

app.get('/comparison/cdc', (req, res) => {
  console.log("request at /comparison/cdc");
  res.sendFile(path.join(__dirname + '/cdc.html'));
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
  populateUsaData.populateUsaData();
  populateUsaData.populateUsaDataActual();

  // res.redirect('/')
  res.send('repop usa!');
  // res.sendFile(path.join(__dirname + '/html/index.html'));
})

app.get('/comparison/ihme/table', (req, res) => {
  res.sendFile(path.join(__dirname + '/ihmetable.html'));
})

app.get('/pull/actual', (req, res) => {
  getActualData();
  res.redirect("/");
})

app.get('/all', (req, res) => {
  res.sendFile(path.join(__dirname + '/allTable.html'));
})

app.get('/beta', (req, res) => {
  res.sendFile(path.join(__dirname + '/beta.html'));
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname + '/test.html'));
});

app.get("/tooltip", (req,res) => {
  res.sendFile(path.join(__dirname + '/tooltip.html'));

})


app.listen(process.env.PORT || 9999, () => {
  console.log("listening...");
});
