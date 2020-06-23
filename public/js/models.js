let modelsRaw = [
  {
    name: "can",
    folderName: "projections",
    hasSubFolders: true,
    subFolders: ["0", "1", "2", "3"],
    displayName: "Covid Act Now",
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
      "06-06-2020",
      "06-09-2020",
      "06-11-2020",
      "06-12-2020",
      "06-15-2020",
      "06-18-2020",
      "06-19-2020",
      "06-20-2020",
      "06-22-2020"
      ],
    hasHospitalizations: true,
    countryLevel: true,
    stateLevel: true,
    countyLevel: true
  },

  { name: "ihme",
    folderName: "IHME",
    displayName: "IHME",
    hasSubFolders: false,
    dates: [
      "03-25-2020",
      "03-31-2020",
      "04-08-2020",
      "04-13-2020",
      "05-20-2020",
      "05-29-2020",
      "06-06-2020"
      ],
    hasHospitalizations: true,
    countryLevel: true,
    stateLevel: true,
    countyLevel: false
  },


  { name: 'ucla',
    folderName: "UCLA",
    displayName: "UCLA",
    hasSubFolders: false,
    // baseUrl: prefix + "/UCLA-SuEIR",
    dates: ["2020-05-01", "2020-05-10", "2020-05-17", "2020-05-24", "2020-05-31", "2020-06-07", "2020-06-14", "2020-06-21"],
    suffix: "-UCLA-SuEIR.csv",
    hasHospitalizations: false,
    countryLevel: true,
    stateLevel: true,
    countyLevel: false
  },

  { name: 'mit',
    folderName: "MIT",
    displayName: "MIT",
    hasSubFolders: false,
    // baseUrl: prefix + "/MIT_CovidAnalytics-DELPHI",
    dates: ["2020-04-22", "2020-04-27", "2020-04-30", "2020-05-04", "2020-05-10", "2020-05-18", "2020-05-25", "2020-06-01", "2020-06-08", "2020-06-15", "2020-06-22"],
    suffix: "-MIT_CovidAnalytics-DELPHI.csv",
    hasHospitalizations: false,
    countryLevel: true,
    stateLevel: true,
    countyLevel: false
  },

  { name: 'ut',
    folderName: "UT",
    displayName: "University of Texas",
    hasSubFolders: false,
    // baseUrl: prefix + "/UT-Mobility",
    dates: ["2020-04-20", "2020-04-27", "2020-05-04", "2020-05-11", "2020-05-18", "2020-05-25", "2020-06-01", "2020-06-08", "2020-06-15", "2020-06-22"],
    suffix: "-UT-Mobility.csv",
    hasHospitalizations: false,
    countryLevel: true,
    stateLevel: true,
    countyLevel: false
  },

  { name: 'YYG',
    folderName: "YYG",
    displayName: "Youyang Gu",
    hasSubFolders: false,
    // baseUrl: prefix + "/UT-Mobility",
    dates: ["2020-04-15", "2020-04-22", "2020-04-30", "2020-05-14", "2020-05-28", "2020-06-15", "2020-06-23"],
    suffix: "-UT-Mobility.csv",
    hasHospitalizations: false,
    countryLevel: true,
    stateLevel: true,
    countyLevel: false
  },
  // {
  //   name: 'cdc',
  //   folderName: "CDC",
  //   displayName: "CDC",
  //   hasSubFolders: false,
  //   // baseUrl: prefix + "/UT-Mobility",
  //   dates: ["higher", "lower"], // need a workaround for this issue
  //   // suffix: "-UT-Mobility.csv",
  //   hasHospitalizations: false,
  //   countryLevel: true,
  //   stateLevel: true,
  //   countyLevel: false
  // }
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


let modelsAvailable = {
  death: {
    country: [],
    state: [],
    // county: []
  },
  hospitalizations: {
    country: [],
    state: [],
    // county: []
  }
}

models.forEach(model => {
  let name = model.name;
  if (model.countryLevel) modelsAvailable.death.country.push(name)
  if (model.stateLevel) modelsAvailable.death.state.push(name)
  // if (model.countyLevel) DO THIS LATER
  if (model.hasHospitalizations) {
    if (model.countryLevel) modelsAvailable.hospitalizations.country.push(name)
    if (model.stateLevel) modelsAvailable.hospitalizations.state.push(name)
  }
})
