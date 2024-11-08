module.exports = (mongoose) => {
    const Support = mongoose.model(
      "support",
      mongoose.Schema(
        {
            client: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "companies",
              required: true,
            },
            vehicle: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'vehicle',
                required: true
            },
            supportType: {
                type: Number,
                enum: [1, 2, 3, 4, 5, 6], // 1-GPS related issue, 2-Sensor related issue,3-Account related issue,4-Report not generate,5-Vehicle tracking issue,6-Other issue
                require: true
            },
            status: {
              type: String,
              enum: ['created', 'in-progress', 'resolved', 'rejected'],
              default: 'created'
            },
            message: {
                type: String,
                require: true
            }
        },
        { timestamps: true }
      )
    );
    return Support;
  };