module.exports = (mongoose) => {
  const TruckBrands = mongoose.model(
    "truck_brands",
    mongoose.Schema(
      {
        name: {
          type: String,
          required: true,
        },
        truckType: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'truck_types',
          required:true
        },
      },
      { timestamps: true }
    )
  );
  return TruckBrands;
};