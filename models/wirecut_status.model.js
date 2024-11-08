module.exports = (mongoose) => {
    const WirecutStatus = mongoose.model(
      "wirecut_status",
      mongoose.Schema(
        {
          wireCut: {
            type: Boolean
          },
          vehicleId: {
            type: String,
            required: true,
          },
          timeStamp: {
            type: Date,
          },
        },
        { timestamps: true }
      )
    );
    return WirecutStatus;
  };
  