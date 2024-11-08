module.exports = (mongoose) => {
    const Cities = mongoose.model(
      "cities",
      mongoose.Schema(
        {
          name: {
            type: String,
            required: true,
          },
          state: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'states',
            required: true
          },
          lat: {
            type: Number
          },
          long: {
            type: Number
          }
        },
        { timestamps: true }
      )
    );
    return Cities;
  };