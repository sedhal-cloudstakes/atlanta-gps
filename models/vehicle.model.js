module.exports = (mongoose) => {
  const VehicleSchema = mongoose.Schema(
    {
      vehicleNo: {
        type: String,
        unique: true,
        required: true,
      },
      truckModel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'truck_models',
        required:true
      },
      device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "devices",
        required: false, // do true whenever device implementation
      },
      client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies",
        required: true,
      },
      vehiclePhoto: {
        type: String,
        required: true,
      },
      RCPhoto: {
        type: String,
        required: true,
      },
      wireCut: {
        type: Boolean,
        default: false
      },
      tripVehicleStatus: {
        type: String,
        enum: ["moving", "idle", "stopped", "offline"],
        required: true,
        default: "offline"
      },
      gprsCommand: {
        type: String,
      },
      engineValueUpdate: {
        type: Boolean,
        default: false
      },
      engineOn: {
        type: Boolean,
        required: true,
        default: true
      },
      ignation: {
        type: Boolean
      },
      otp: {
        type: Number,
      },
      distance: {
        type: Number,
        default: 0
      },
      currentCoordinates: {
        type: [Number, Number],
        index: '2d'
      },
      harshAccelerationCount: {
        type: Number,
        default: 0
      },
      harshBrakingCount: {
        type: Number,
        default: 0
      },
      planId: {
        type: mongoose.Schema.Types.ObjectId
      },
      planStartDate: {
        type: String,
      },
      planEndDate: {
        type: String,
      },
      deletedAt: {
        type: Boolean,
        default: false
      },
    },
      { timestamps: true }
    )

    // Define the fields to exclude from the JSON response
    const excludedFields = ['createdAt','updatedAt','deletedAt','__v'];
    VehicleSchema.set('toJSON', {
      transform: function (doc, ret) {
        excludedFields.forEach((field) => {
          delete ret[field];
        });
      }
    });

    const Vehicle = mongoose.model("vehicle", VehicleSchema)
    return Vehicle;
};