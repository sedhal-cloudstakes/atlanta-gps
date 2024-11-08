module.exports = (mongoose) => {
    const AboutUs = mongoose.model(
      "about",
      mongoose.Schema(
        {
          title: {
            type: String,
            required: true,
          },
          bannerImage: {
            type: String,
            required: true,
          },
          content: [
            {
              title: String,
              description: String
            }
          ]
        },
        { timestamps: true }
      )
    );
    return AboutUs;
  };