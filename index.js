const { /*fetchMyIP, fetchCoordsByIp, fetchISSFlyOverTimes, */nextISSTimesForMyLocation } = require('./iss');

const printPassTimes = function(timeStamps) {
  for (const pass of timeStamps) {
    const dates = new Date(0);
    dates.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${dates} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, timeStamps) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(timeStamps);
});


// Function calls below are no longer needed as these functions are all nested into nextISSTimesForMyLocation
// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log("It worked! Returned Ip:" , ip);
// });

// fetchCoordsByIp('70.31.71.249', (error, data) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log("It worked! Returned Coordinates:" , data);
// });

// fetchISSFlyOverTimes({ latitude: '49.27670', longitude: '-123.13000' }, (error, data) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log("It worked! Returned Overhead Time Stamps:" , data);
// });