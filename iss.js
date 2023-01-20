const request = require('request');


const fetchMyIP = (callback) => {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body)  => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) return callback(error, null);

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // if we get here, all's well and we got the data
    const data = JSON.parse(body).ip;
    callback(null, data);

  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) return callback(error, null);

    const dataObject = JSON.parse(body);

    if (dataObject.success === false) {
      const message = `Success status was ${dataObject.success}. Server message says: ${dataObject.message} when fetching for IP ${dataObject.ip}`;
      callback(Error(message), null);
      return;
    }

    const data = findKeyValue(dataObject, ["latitude", "longitude"]);
    callback(null, data);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code was ${response.statusCode} when fetching ISS overhead time stamps: ${body}`;
      callback(msg, null);
      return;
    }

    const data = JSON.parse(body);

    callback(null, data.response);
  });
};

//THIS FUNCTION CALLS BACK TO THE THREE EXTERIOR FUNCTIONS!
const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) return callback(error, null);

      fetchISSFlyOverTimes(coords, (error, timeStamps) => {
        if (error) return callback(error, null);

        callback(null, timeStamps);
      });
    });
  });
};




const findKeyValue = (object, keys) => { //helper function; extracts specified key-value pair
  let result = {};
  for (const [key, value] of Object.entries(object)) {
    for (let neededKey of keys) {
      if (key.includes(neededKey)) {
        result[key] = value;
      }
    }
  }
  return result;
};

module.exports = {
  nextISSTimesForMyLocation
};