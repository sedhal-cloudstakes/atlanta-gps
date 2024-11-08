const net = require("net");
const moment = require('moment');
const { URL, DB_NAME } = require("./config");
const db = require("./models");
var ObjectId = require("mongodb").ObjectId;
const Location = db.locations;
const Vehicle = db.vehicles;
const Device = db.devices;
const IgnitionStatus = db.ignition_status;
const { getAddressQuery, addNotificationToDb } = require("./lib/Helper");

const server = net.createServer(async (socket) => {
  socket.on("data", async (data) => {
    try {
      var vehicleData;
      var packetString = data.toString("utf8");
      const parsedPacketData = parsePacket(packetString);
      console.log("parsedPacketData--", parsedPacketData);
      if (parsedPacketData.type === "LocationPacket"){
        const dateTimeString = `${parsedPacketData.data.date} ${parsedPacketData.data.time}`;
        const formattedDate = moment(dateTimeString, 'DDMMYYYY HHmmss').toISOString();
        const ImeiNumber = parsedPacketData?.data?.IMEI;
        let jsonData = {
          lat: parsedPacketData?.data?.latitude,
          lng: parsedPacketData?.data?.longitude,
          speed: parseFloat(parsedPacketData?.data?.speed),
          ignition: parseInt(parsedPacketData?.data?.ignitionStatus),
          timeStamp: formattedDate,
          address: ""
        };
        console.log(ImeiNumber, 'jsonData', jsonData);
        const getAddress = await getAddressQuery(jsonData.lat, jsonData.lng);
        if (getAddress != 0) {
          jsonData.address = getAddress;
        }
        vehicleData = await getVehiclesByIMEI(ImeiNumber, jsonData.ignition, jsonData.speed, jsonData.lat, jsonData.lng);
        if (vehicleData !== undefined && vehicleData !== null && vehicleData !== '' && vehicleData?._id !== undefined && vehicleData?._id !== null && vehicleData?._id !== '') {
          console.log("vehicle found!");
          jsonData.vehicleNo = vehicleData.vehicleNo;
          jsonData.tripVehicleStatus = vehicleData.tripVehicleStatus;
          const lastIgnationStatus = await Location.findOne({ vehicleId: new ObjectId(vehicleData._id) }).sort({ createdAt: -1 });
          if (lastIgnationStatus?.ignition !== null && lastIgnationStatus?.ignition !== undefined && lastIgnationStatus?.ignition !== '' && lastIgnationStatus?.ignition != jsonData?.ignition) {
            try {
              const ignitionRecord = new IgnitionStatus({
                vehicleId: vehicleData._id,
                ignition: jsonData?.ignition == 1 ? true : false,
                timeStamp: moment().toDate()
              });
              await ignitionRecord.save();
              // Check if the engine is turned on
              if (jsonData?.ignition == 1) {
                await addNotificationToDb({type: "IGNITION_ON", vehicleNo: vehicleData.vehicleNo, clientId: vehicleData.client, address: jsonData.address})
              } else {
                await addNotificationToDb({type: "IGNITION_OFF", vehicleNo: vehicleData.vehicleNo, clientId: vehicleData.client, address: jsonData.address})
              }
            } catch (error) {
              throw error;
            }
          }
          var location = new Location();
          location.deviceId = ImeiNumber;
          location.speed = jsonData.speed;
          location.coordinates = [jsonData.lat, jsonData.lng];
          location.ignition = jsonData.ignition;
          location.vehicleNo = vehicleData.vehicleNo;
          location.distance = 0;
          location.timeStamp = jsonData.timeStamp;
          location.vehicleId = vehicleData._id;
          location.address = jsonData.address;
          location.save();
          console.log('loc AIS 140 saved!--');
        }
      }
    } catch (error) {
      console.log("error", error.message);
    }
  });
  socket.on("end", () => {
    console.log("Client disconnected");
  });
  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});

function parsePacket(packetString) {
  const dataArray = packetString.split(",");
  if (dataArray[0] === "$CP" && dataArray[2].startsWith("V")) {
    return { type: 'LocationPacket', data: parseLocationPacket(dataArray) };
  } else if (dataArray[4] === "OBD" && dataArray[2] === "ASP") {
    return { type: 'CanDataPacket', data: parseCanDataPacket(dataArray) };
  } else {
    throw new Error("Unknown packet type");
  }
}

// Location data packet
function parseLocationPacket(locationDataArray) {
  const locationData = {
    startCharacter: locationDataArray[0], // '$CP'
    header: locationDataArray[1], // 'ASP'
    vendorId: locationDataArray[2], // 'V494'
    packetType: locationDataArray[3], // 'NR'
    messageId: locationDataArray[4], // '02'
    packetStatus: locationDataArray[5], // 'H'
    IMEI: locationDataArray[6], // '863070046468954'
    vehicleRegNo: locationDataArray[7], // ''
    gpsFix: locationDataArray[8], // '1'
    date: locationDataArray[9], // '13082024'
    time: locationDataArray[10], // '110849' UTC format
    latitude: locationDataArray[11], // '22.983683'
    latitudeDir: locationDataArray[12], // 'N'
    longitude: locationDataArray[13], // '72.626175'
    longitudeDir: locationDataArray[14], // 'E'
    speed: locationDataArray[15], // '0.0'
    heading: locationDataArray[16], // '0.00'
    noOfSatellites: locationDataArray[17], // '31'
    altitude: locationDataArray[18], // '54.0'
    pdop: locationDataArray[19], // '1.4'
    hdop: locationDataArray[20], // '0.6'
    networkOperator: locationDataArray[21], // 'Airtel'
    ignitionStatus: locationDataArray[22], // '0'
    mainPowerStatus: locationDataArray[23], // '1'
    mainInputVoltage: locationDataArray[24], // '24.3'
    internalBatteryVoltage: locationDataArray[25], // '3.9'
    emergencyStatus: locationDataArray[26], // '0'
    tamperAlert: locationDataArray[27], // 'C'
    gsmSignalStrength: locationDataArray[28], // '31'
    mcc: locationDataArray[29], // '404'
    mnc: locationDataArray[30], // '98'
    lac: locationDataArray[31], // '1546'
    cellId: locationDataArray[32], // 'ad4'
    endCharacter: locationDataArray[48], // '()*DC\r\n'
    checksum: locationDataArray[49], // Checksum if available
  };
  return locationData;
}

// CAN Data Packet
function parseCanDataPacket(canDataArray) {
  console.log("can packet");
  const canData = {
    startCharacter: canDataArray[0],
    header: canDataArray[1], // '000'
    VendorID: canDataArray[2], // 'ASP'
    firmwareVersion: canDataArray[3], // 'V211'
    packetType: canDataArray[4], // 'OBD'
    IMEI: canDataArray[5], // '863070046468954'
    vehicleRegNo: canDataArray[6], // '0000000000' (Placeholder?)
    date: canDataArray[7], // '13082024' (DDMMYYYY format)
    time: canDataArray[8], // '105836' (HHMMSS format)
    fuelSystemStatus: hexToDecimal(canDataArray[9]),
    calculatedEngineLoad: hexToDecimal(canDataArray[10]),
    engineCoolantTemperature: hexToDecimal(canDataArray[11]),
    shortTermFuelTrim: hexToDecimal(canDataArray[12]),
    longTermFuelTrim: hexToDecimal(canDataArray[13]),
    intakeManifoldPressure: hexToDecimal(canDataArray[14]),
    engineSpeed: hexToDecimal(canDataArray[15]),
    vehicleSpeed: hexToDecimal(canDataArray[16]),
    timingAdvance: hexToDecimal(canDataArray[17]),
    intakeAirTemperature: hexToDecimal(canDataArray[18]),
    throttlePosition: hexToDecimal(canDataArray[19]),
    oxygenSensorsPresent: hexToDecimal(canDataArray[20]),
    oxygenSensor1: hexToDecimal(canDataArray[21]),
    oxygenSensor2: hexToDecimal(canDataArray[22]),
    obdStandardsConformity: hexToDecimal(canDataArray[23]),
    runTimeSinceEngineStart: hexToDecimal(canDataArray[24]),
    distanceTraveledWithMILOn: hexToDecimal(canDataArray[25]),
    commandedEGR: hexToDecimal(canDataArray[26]),
    commandedEvaporativePurge: hexToDecimal(canDataArray[27]),
    warmUpsSinceCodesCleared: hexToDecimal(canDataArray[28]),
    distanceTraveledSinceCodesCleared: hexToDecimal(canDataArray[29]),
    miscellaneous: {
      field1: canDataArray[30],
      field2: canDataArray[31],
      field3: canDataArray[32],
      field4: canDataArray[33],
      field5: canDataArray[34],
    },
  };
  return canData;
}

function hexToDecimal(hexString) {
  return parseInt(hexString, 16);
}

async function getVehiclesByIMEI(imeiNumber, Ignitation, speed, latitude, longitude) {
  try {
    const device = await Device.findOne({ ImeiNo: imeiNumber.toString() });
    console.log("-----device", device);
    if (device) {
      const condition = { device: device._id };
      let update = { $set: {} };
      if (Ignitation == 1 && speed <= 10) {
        update.$set.tripVehicleStatus = 'idle';
        update.$set.distance = 0;
        update.$set.harshBrakingCount = 0;
      } else if (Ignitation == 1 && speed > 10) {
        update.$set.tripVehicleStatus = 'moving';
        update.$set.distance = 0;
        update.$set.harshBrakingCount = 0;
      } else if (Ignitation == 0 || speed == 0) {
        update.$set.tripVehicleStatus = 'offline';
        update.$set.distance = 0;
        update.$set.harshBrakingCount = 0;
      }
      if (latitude !== "" && longitude !== "") {
        update.$set.currentCoordinates = [latitude, longitude];
      }
      // Use `populate` to retrieve the associated Vehicle records
      let vehicleData = await Vehicle.findOneAndUpdate(condition, update, { new: true }).populate('device').populate({
        path: 'client',
        select: '_id fcmToken',
      });
      return vehicleData;
    } else {
      return 'Device with the specified IMEI not found.';
    }
  } catch (error) {
    console.log('errror in the main catch ', error)
    throw error;
  }
};

const PORT = 9001;
server.listen(PORT, async () => {
  await db.mongoose.connect(URL, {
    dbName: DB_NAME,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,

  });
  console.log(`Server for Socket.io is running on port ${PORT}`);
});