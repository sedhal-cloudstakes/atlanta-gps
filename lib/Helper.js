const db = require('../models');
require("dotenv").config();
const Address = db.address;
const Notification = db.notifications;
const Company = db.companies;
const axios = require('axios');
var ObjectId = require("mongodb").ObjectId;

const correspondenceTable = [
  { liters: 0, hertz: 98, volts: 0.827 },
  { liters: 10, hertz: 288, volts: 1.746 },
  { liters: 20, hertz: 331, volts: 1.952 },
  { liters: 30, hertz: 374, volts: 2.159 },
  { liters: 40, hertz: 416, volts: 2.363 },
  { liters: 50, hertz: 459, volts: 2.567 },
  { liters: 60, hertz: 503, volts: 2.783 },
  { liters: 70, hertz: 539, volts: 2.957 },
  { liters: 80, hertz: 580, volts: 3.152 },
  { liters: 90, hertz: 623, volts: 3.360 },
  { liters: 100, hertz: 664, volts: 3.558 },
  { liters: 110, hertz: 705, volts: 3.755 },
  { liters: 120, hertz: 746, volts: 3.952 },
  { liters: 130, hertz: 787, volts: 4.149 },
  { liters: 140, hertz: 827, volts: 4.344 },
  { liters: 150, hertz: 869, volts: 4.548 },
  { liters: 160, hertz: 909, volts: 4.741 },
  { liters: 170, hertz: 950, volts: 4.938 },
  { liters: 180, hertz: 990, volts: 5.131 },
  { liters: 190, hertz: 1031, volts: 5.325 },
  { liters: 200, hertz: 1071, volts: 5.520 },
  { liters: 210, hertz: 1111, volts: 5.713 },
  { liters: 220, hertz: 1150, volts: 5.903 },
  { liters: 230, hertz: 1191, volts: 6.098 },
  { liters: 240, hertz: 1231, volts: 6.290 },
  { liters: 250, hertz: 1270, volts: 6.481 },
  { liters: 260, hertz: 1310, volts: 6.671 },
  { liters: 270, hertz: 1350, volts: 6.863 },
  { liters: 280, hertz: 1389, volts: 7.054 },
  { liters: 290, hertz: 1428, volts: 7.242 },
  { liters: 300, hertz: 1468, volts: 7.434 },
  { liters: 310, hertz: 1507, volts: 7.624 },
  { liters: 320, hertz: 1547, volts: 7.815 },
  { liters: 330, hertz: 1586, volts: 8.005 },
  { liters: 340, hertz: 1626, volts: 8.195 },
  { liters: 350, hertz: 1665, volts: 8.383 },
  { liters: 360, hertz: 1704, volts: 8.573 },
  { liters: 370, hertz: 1744, volts: 8.763 },
  { liters: 380, hertz: 1780, volts: 8.937 },
  { liters: 390, hertz: 1821, volts: 9.137 },
  { liters: 400, hertz: 1863, volts: 9.341 },
  { liters: 410, hertz: 1911, volts: 9.573 },
  { liters: 411, hertz: 2000, volts: 10.000 }
];

async function convertMillivoltsToLiters(mV) {
  try {
    // Convert the millivolts to volts
    const volts = mV / 1000;
    const decimalPlaces = 1;
    // Iterate through the table and find the corresponding liters
    for (let i = 0; i < correspondenceTable.length - 1; i++) {
      if (volts >= correspondenceTable[i].volts && volts <= correspondenceTable[i + 1].volts) {
        const volts1 = correspondenceTable[i].volts;
        const volts2 = correspondenceTable[i + 1].volts;
        const liters1 = correspondenceTable[i].liters;
        const liters2 = correspondenceTable[i + 1].liters;
        // Linear interpolation to estimate liters
        let estimatedLiters = liters1 + (liters2 - liters1) * (volts - volts1) / (volts2 - volts1);
        const roundedFuelLevel = (Math.round(estimatedLiters * 2) / 2).toFixed(decimalPlaces);
        // Convert the fuel level to a string
        if (roundedFuelLevel % 1 === 0) {
          const fuelLevel = parseInt(roundedFuelLevel.slice(0, -2));
          return fuelLevel;
        } else {
          return roundedFuelLevel;
        }
      }
    }
    return 'Value out of range';
  } catch(error) {
    throw error;
  }
}

// Alert for low fuel
function calculateLowFuel(fuelData, type) {
  try {
    const tankCapacity = 410;
    let currentDieselLevel;
    if (type === 'dashboard') {
      currentDieselLevel = fuelData[fuelData.length - 1]?.fuel;
    } else {
      currentDieselLevel = fuelData;
    }
    // Calculate 10% of the tank size
    const tenPercentOfTank = tankCapacity * 0.1;
    // Check if the current diesel level is less than 10%
    const isLessThanTenPercent = currentDieselLevel < tenPercentOfTank;
    if (isLessThanTenPercent) {
      if (type === 'dashboard') {
        return true;
      } else {
        const fuelConsumed = tankCapacity - currentDieselLevel;
        if (fuelConsumed % 10 === 0) {
          return true; // Send notification for every 10 liters consumed
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

async function sendNotificationToUser (title, value, token, redirection, vehicleNo) {
  try {
    let payload = {
      notification: {
        title: title,
        body: value
      },
      data: {
        redirection: redirection
      },
      token: token
    };

    if (vehicleNo !== '') {
      payload.data.vehicleNo = vehicleNo;
    }

    const response = await getMessaging().send(payload);
    console.log('Successfully sent message:', response);
    // return response;
  } catch (error) {
    throw error;
  }
}

function getDistanceBetweenTwoPoints(lat1, long1, lat2, long2) {

  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;

  const theta = long1 - long2;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344; //convert miles to km

  return Math.round(dist * 1000);
}
// axios request
const getAddressFromLatLong = async (lat, long) => {
  const options = {
    method: 'POST',
    url: 'https://places.googleapis.com/v1/places:searchNearby',
    data: {
      "includedTypes": ["car_dealer", "car_rental", "car_repair", "car_wash", "gas_station", "historical_landmark", "atm", "bank", "fast_food_restaurant", "indian_restaurant", "restaurant", "sandwich_shop", "vegetarian_restaurant", "administrative_area_level_1", "administrative_area_level_2", "country", "locality", "postal_code", "police", "post_office", "guest_house", "hotel", "telecommunications_service_provider", "travel_agency", "auto_parts_store", "stadium", "airport", "bus_station", "bus_stop", "ferry_terminal", "train_station", "truck_stop"],
      "maxResultCount": 1,
      "locationRestriction": {
        "circle": {
          "center": {
            "latitude": lat,
            "longitude": long
          },
          "radius": 500.0
        }
      }
    },
    headers: {
      "X-Goog-Api-Key": `${process.env.GOOGLE_MAP_KEY}`,
      "Content-Type": "application/json",
      "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.primaryTypeDisplayName,places.location,places.addressComponents,places.shortFormattedAddress",
    }
  };

  try {
    const response = await axios.request(options);
    console.log("response ", response.data);
    let finalAddress;
    if (response.data) {
      let data = response.data.places[0];
      let placeName;
      let formattedAdd = data.formattedAddress;
      console.log('formattedAdd ', formattedAdd);
      let addLat = Number(data.location.latitude).toFixed(6);
      let addLong = Number(data.location.longitude).toFixed(6);
      let distanceInMtrs = getDistanceBetweenTwoPoints(lat, long, addLat, addLong);
      if (data?.displayName && typeof data?.displayName === "object") {
        placeName = data?.displayName?.text;
        const formatGoogleAddress = (string) => string.split(', ').filter(part => !part.includes("+")).join(', ') || string;
        finalAddress = `${distanceInMtrs}M from ${placeName}, ${formatGoogleAddress(formattedAdd)}`
      } else {
        console.log('we are in else ')
        finalAddress = `${distanceInMtrs}M from ${formattedAdd}`
      }
    }
    return finalAddress;
  } catch (error) {
    console.log('we are in ewrror')
    console.error(error.response.data);
    return 0;
  }
}

const addNotificationToDb = async (data) => {
  try {
    let dataObj = {
      type: data.type,
      vehicleNo: data.vehicleNo,
      clientId: data.clientId,
    }
    switch (data.type) {
      case "IGNITION_ON":
      case "IGNITION_OFF":
        dataObj.address = data.address;
        break;
      case "LOW_FUEL":
      case "FUEL_FILLED":
      case "SUDDEN_FUEL_DROP":
        dataObj.fuel = data.fuel;
        dataObj.address = data.address;
        break;
      case "OVERSPEED":
        dataObj.address = data.address;
        dataObj.speed = data.speed;
        dataObj.message = data.message;
      default:
        dataObj.speed = data.speed;
        break;
    }
    const createNotification = await Notification.create(dataObj);
    if (createNotification) {
      // update user unread notification count
      const getCount = await Company.findOne({ _id: ObjectId(dataObj.clientId) });
      if (typeof getCount.unreadNotificationCount === "number") {
        let updatedCount = getCount.unreadNotificationCount + 1;
        await Company.updateOne({ _id: ObjectId(dataObj.clientId) }, { unreadNotificationCount: updatedCount }, { new: true });
      }
    } else {
      return 0;
    }

  } catch (error) {
    return 0;
  }
}

let milesToRadian = function (miles) {
  let earthRadiusInMiles = 3959;
  return miles / earthRadiusInMiles;
};

const getAddressQuery = async (lat, long) => {
  try {
    
      let lattitude = parseFloat(lat);
      let longitude = parseFloat(long);
      
      let queryObj = {
        type: "Point",
        coordinates: [lattitude, longitude]
      }
      let findAddressInDb = await Address.find({
        location: {
          $geoWithin: {
            $centerSphere: [queryObj.coordinates, milesToRadian(0.31)] // 500m is equal to 0.31 miles
          }
        }
      }).limit(1);
      if (findAddressInDb.length === 1) {
        return findAddressInDb[0].address;
      } else {
        let address = await getAddressFromLatLong(lattitude, longitude);
        if (address === 0) {
          return 0;
        } else {
          await Address.create({
            address: String(address),
            location: {
              coordinates: [lattitude, longitude]
            }
          });
          return address;
        }
      }

  } catch (error) {
    console.log('error in address ', error);
    return 0;
  }
}

function convertUSTtoIST(ustDateTime) {
  // Define time zones
  const ustTimeZone = 'Etc/UTC'; // UST time zone
  const istTimeZone = 'Asia/Kolkata'; // IST time zone

  // Parse the input date and time as UST
  const ustMoment = moment.tz(ustDateTime, ustTimeZone);

  // Convert UST date and time to IST date and time
  const istMoment = ustMoment.clone().tz(istTimeZone);

  // Return the IST date and time as a string
  return istMoment.format('DD/MM/YYYY hh:mm:ss A');
}

function convertISTtoUTC(dateInIST) {
  return moment.utc(dateInIST, "YYYY-MM-DDTHH:mm:ss.SSSZ").toDate();
}

module.exports = {
    convertMillivoltsToLiters: convertMillivoltsToLiters,
    calculateLowFuel: calculateLowFuel,
    sendNotificationToUser:sendNotificationToUser,
    getAddressQuery: getAddressQuery,
    convertUSTtoIST: convertUSTtoIST,
    convertISTtoUTC: convertISTtoUTC,
    addNotificationToDb: addNotificationToDb
};
