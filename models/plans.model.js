module.exports = (mongoose) => {
  const planSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      features: {
        type: Array,
        required: true,
      },
      deletedAt: {
        type: Boolean,
        default: false
      }
    },
    { timestamps: true }
  );

  // Define the fields to exclude from the JSON response
  const excludedFields = ['createdAt','updatedAt','deletedAt','__v'];
  planSchema.set('toJSON', {
    transform: function (doc, ret) {
      excludedFields.forEach((field) => {
        delete ret[field];
      });
    }
  });
  
  const Plans = mongoose.model("plans", planSchema);
  return Plans;
};
