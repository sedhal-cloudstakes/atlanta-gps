module.exports = (mongoose) => {
    const IgnitionStatus = mongoose.model(
      "ignition_status",
      mongoose.Schema(
        {
          ignition: {
            type: Boolean
          },
          vehicleId: {
            type: String,
            required: true,
          },
          timeStamp: {
            type: Date
          },
        },
        { timestamps: true }
      )
    );
    return IgnitionStatus;
  };
  