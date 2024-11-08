module.exports = (mongoose) => {
  const Trip = mongoose.model(
    "trip",
    mongoose.Schema(
      {
        source: {
          type: String,
          required: true,
        },
        destination: {
          type: String,
          required: true,
        },
        client: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "companies",
          required: true,
        },
        vehicle: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "vehicle",
          required: true,
        },
        driver: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "drivers",
          required: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: false,
          default: null
        },
        fuelLevel: {
          type: String,
          default: 'N/A'
        },
        avgSpeed: {
          type: String,
          default: 'N/A'
        },
        deletedAt: {
          type: Boolean,
          default: false,
        },
      },
      { timestamps: true }
    )
  );
  return Trip;
};
