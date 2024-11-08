module.exports = (mongoose) => {
    const Faq = mongoose.model(
      "faq",
      mongoose.Schema(
        {
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
        },
        { timestamps: true }
      )
    );
    return Faq;
  };