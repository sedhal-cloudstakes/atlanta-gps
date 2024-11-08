module.exports = (mongoose) => {
    const AddressSchema = mongoose.Schema(
        {
            location: {
                type: {
                  type: String,
                  default: 'Point',
                },
                coordinates: [Number],
            },
            address: {
                type: String,
                required: true
            }
        },
        { timestamps: true }
      );

      // Create the index on the location field
      AddressSchema.index({ location: 1 });

      const Address = mongoose.model("addresses", AddressSchema)
      return Address;
  };