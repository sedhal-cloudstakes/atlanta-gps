module.exports = (mongoose) => {
    const LocationSchema = mongoose.Schema(
        {
          deviceId: {
            type: String,
            required: false,
          },
          coordinates: {
            type: [Number, Number],
            index: '2d'
          },
          speed: Number,
          fuel: {
            type: Number,
            min: 0,
            max: 420,
            default: 0,
            required: false,
          },
          fuelStationName: {
            type: String,
          },
          fuelStationAddress: {
            type: String
          },
          movement: {
            type: Boolean
          },
          ignition: {
            type: Boolean
          },
          vehicleNo: {
            type: String
          },
          distance: {
            type: Number,
            default: 0
          },
          timeStamp: {
            type: Date
          },
          vehicleId: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "vehicle",
            required: true
          },
          address: {
            type: String
          }
        },
        { timestamps: true }
      );

      // Create the index on the vehicleNo field
      LocationSchema.index({ vehicleNo: 1 });

      const Locations = mongoose.model("locations", LocationSchema)
      return Locations;
  };