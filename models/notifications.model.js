module.exports = (mongoose) => {
    const Notifications = mongoose.model(
      "notifications",
      mongoose.Schema(
        {
          type: {
            type: String,
            enum: ["IGNITION_ON", "IGNITION_OFF", "LOW_FUEL", "FUEL_FILLED", "SUDDEN_FUEL_DROP", "OVERSPEED"],
            required: true,
          },
          vehicleNo: {
            type: String,
            required: true
          },
          clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "companies",
            required: true
          },
          address: {
            type: String
          },
          fuel: {
            type: String
          },
          speed: {
            type: String
          }
        },
        { timestamps: true }
      )
    );
    return Notifications;
  };