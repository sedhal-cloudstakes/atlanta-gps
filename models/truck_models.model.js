module.exports = (mongoose) => {
    const TruckModels = mongoose.model(
      "truck_models",
      mongoose.Schema(
        {
          name: {
            type: String,
            required: true,
          },
          truckTypes: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'truck_types',
              required:true
          },
          truckBrands: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'truck_brands',
            required:false
          },
        },
        { timestamps: true }
      )
    );
    return TruckModels;
  };