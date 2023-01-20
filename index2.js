const { nextISSTimesForMyLocation } = require('./iss_promised');


const printPassTimes = function(timeStamps) {
  for (const pass of timeStamps) {
    const dates = new Date(0);
    dates.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${dates} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((timeStamps) => {
    printPassTimes(timeStamps);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  })