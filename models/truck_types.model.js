const { ROLE } = require("../config/roles");

module.exports = (mongoose) => {
  const TruckTypes = mongoose.model(
    "truck_types",
    mongoose.Schema(
      {
        name: {
          type: String,
          required: true,
        }
      },
      { timestamps: true }
    )
  );
  return TruckTypes;
};