module.exports = (mongoose) => {
  const Terms = mongoose.model(
    "terms",
    mongoose.Schema(
      {
        content: {
          type: String,
          default: null
        },
        deletedAt: {
          type: Boolean,
          default: false,
        },
      },
      { timestamps: true }
    )
  );
  return Terms;
};
