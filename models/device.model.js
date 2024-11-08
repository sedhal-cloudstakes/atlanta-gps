module.exports = (mongoose) => {
const Devices = mongoose.model(
    "devices",
    mongoose.Schema(
      {
        ImeiNo: {
          type: String,
          required: true,
        },
        serialNo: {
          type: String,
          required: true
        },
        configuration: {
          type: String,
          required: false
        },
        firmware: {
          type: String,
          required: false
        },
        iccidNo: {
          type: String,
          required: false
        },
        imsiNo: {
          type: String,
          required: false
        },
        status: {
          type: String,
          required: true
        },
        deletedAt: {
          type: Boolean,
          default: false
        },
      },
      { timestamps: true }
    )
  );
  return Devices;
};
