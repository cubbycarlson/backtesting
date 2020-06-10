let modelsRaw = [
  {
    name: "can",
    folderName: "projections",
    dates: [
      "03-19-2020",
      "03-23-2020",
      "03-27-2020",
      "03-31-2020",
      "04-04-2020",
      "04-06-2020",
      "04-09-2020",
      "04-12-2020",
      "04-14-2020",
      "05-06-2020",
      "05-08-2020",
      "05-11-2020",
      "05-14-2020",
      "05-20-2020",
      "05-21-2020",
      "05-22-2020",
      "05-26-2020",
      "05-27-2020",
      "05-28-2020",
      "05-29-2020",
      "06-01-2020",
      "06-04-2020",
      "06-05-2020",
      "06-06-2020"
      ],
    hasHospitalizations: true
  },

  { name: "ihme",
    folderName: "IHME",
    dates: [
      "03-25-2020",
      "03-31-2020",
      "04-08-2020",
      "04-13-2020",
      "05-20-2020",
      "05-29-2020"
      ],
    hasHospitalizations: true
  },
  //
  // cdc: {
  //   folderName: "projections",
  //   dates: [
  //     "higher",
  //     "lower"
  //   ],
  //   hasHospitalizations: true
  // },

  { name: 'ucla',
    folderName: "UCLA",
    // baseUrl: prefix + "/UCLA-SuEIR",
    dates: ["2020-05-01", "2020-05-10", "2020-05-17", "2020-05-24", "2020-05-31", "2020-06-07"],
    suffix: "-UCLA-SuEIR.csv",
    hasHospitalizations: false
  },

  { name: 'mit',
    folderName: "MIT",
    // baseUrl: prefix + "/MIT_CovidAnalytics-DELPHI",
    dates: ["2020-04-22", "2020-04-27", "2020-04-30", "2020-05-04", "2020-05-10", "2020-05-18", "2020-05-25", "2020-06-01", "2020-06-08"],
    suffix: "-MIT_CovidAnalytics-DELPHI.csv",
    hasHospitalizations: false
  },

  { name: 'ut',
    folderName: "UT",
    // baseUrl: prefix + "/UT-Mobility",
    dates: ["2020-04-20", "2020-04-27", "2020-05-04", "2020-05-11", "2020-05-18", "2020-05-25", "2020-06-01", "2020-06-08"],
    suffix: "-UT-Mobility.csv",
    hasHospitalizations: false
  }
]

function rearrangeDate(strDate) {
  // strDate is format "YYYY-MM-DD", return "MM-DD-YYYY"
  let str = strDate.toString();
  let year = str.slice(0,4);
  let month = str.slice(5,7);
  let day = str.slice(8,10);
  return month + "-" + day + "-" + year
}

let models = modelsRaw.map(model => {
  if (model.name === "can" || model.name === "ihme") return model;
  let newModel = model;
  newModel.dates = model.dates.map(date => rearrangeDate(date))
  return newModel
})
