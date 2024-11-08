module.exports = (mongoose) => {
  const States = mongoose.model(
    "states",
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
  return States;
};