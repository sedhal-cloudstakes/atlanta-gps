module.exports = (mongoose) => {
  const EngineStatus = mongoose.model(
    "engine_status",
    mongoose.Schema(
      {
        userId: {
          type: String,
          required: true,
        },
        vehicleId: {
          type: String,
          required: true,
        },
        userType: {
          type: String,
          required: true,
        },
        engineStausBefore: {
          type: Boolean,
        },
        engineStausAfter: {
          type: Boolean,
        },
        appType: {
          type: String,
          enum: ["mobile", "web"],
        },
        executeStatus: {
          type: String,
          enum: ["inprocess", "success", "failed"],
        },
        executeStatusReason: {
          type: String,
        },
        timeStamp: {
          type: Date,
        },
      },
      { timestamps: true }
    )
  );
  return EngineStatus;
};
