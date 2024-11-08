module.exports = (mongoose) => {
  const Feedback = mongoose.model(
    "feedback",
    mongoose.Schema(
      {
        client: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "companies",
          required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        message: {
            type: String,
            required: true,
        },
      },
      { timestamps: true }
    )
  );
  return Feedback;
};
