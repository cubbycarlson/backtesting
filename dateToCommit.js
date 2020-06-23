const dateToCommit = {
  // original launch
  '03-19-2020': 'b7a0a649d9fd89baafd86ff213d03f6fea2ccb97',

  // Wed Mar 25 01:17:28 2020 -0700 New model: updated hospitalization rate estimates and actuals
  // '3/23/2020': 'c2ecc44cb2a6b2c2a9e5d7c8630203285be672ff',

  // Date:   Wed Mar 25 23:27:12 2020 -0700  Reflect updated hospitalization data
  '03-23-2020': '5c67d6247bdfc804eb9a4250ffeaf10382dd1fed',

  // Regular model update
  '03-27-2020': '63c37955a64861793c4df96037713994feeb5e51',

  // 4/1: new model (seir)
  // ba7757763a076538650f4b2119f94fda1345195d (origin/simpler-model-naming, simpler-model-naming)

  // final deploy on 4/2; unclear if anything actually shipped on 4/1
  '03-31-2020': 'a331ddc130e73319f594126a0369d05564be8d28',
  '04-04-2020': '861ef5d2ad244fb44545aeee7055c9616329cad4',
  '04-06-2020': '78361eb19707f13284c8699098f77ca0565707bf',

  // Initial grand rapids model without data from 9th
  // '4/9/2020' :'067a5c5f851319514771d4d9082b047be247bba8'
  // Updated Grand Rapids model deployed on the 9th
  '04-09-2020': '7d0fc8157f2140124ea26068aaff01b44806e538',
  // Grand Rapids model deployed on the 12th
  '04-12-2020': '645ae78673bddd1dce3c7c1cf9062b75aca9b306',

  // initial inference model
  // '4/14/2020': 'c5264c5579e5e7858e8a1d7346f8601156d80caa',
  // '4/14/2020': 'b41e4f231466db5b0eb783621f7c166e4b4c55ba', #hostp norm fix
  // '4/14/2020': '1499559b9b390c9085457c0a501819cb951230f1', # final update
  '04-14-2020': 'da3e034c5602eeb1a1398d01251c93b7e4c51b70'
  // update with lower stay at home
 }

 const snapShotDates = { // from new API; comment out so I don't load a bunch
   "06-22-2020": "540",
   "06-20-2020": "537",
   "06-19-2020": "529",
   "06-18-2020": "522", // actually 06-19-2020 as well
   "06-17-2020": "517",
   "06-15-2020": "497",
   "06-12-2020": "480",
   "06-11-2020": "467",
   "06-09-2020": "447",

   // "06-06-2020": "432",
   // "06-05-2020": "422",
   // "06-04-2020": "417",
   // "06-01-2020": "396",
   // "05-29-2020": "385",
   // "05-28-2020": "375",
   // "05-27-2020": "373",
   // "05-26-2020": "370",
   // "05-22-2020": "359",
   // "05-21-2020": "354",
   // "05-20-2020": "323",
   // "05-14-2020": "292",
   // "05-11-2020": "276",
   // "05-08-2020": "271",
   // "05-06-2020": "261"
 }

 exports.dateToCommit = dateToCommit;
 exports.snapShotDates = snapShotDates;
