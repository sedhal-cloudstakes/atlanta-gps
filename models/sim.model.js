module.exports = (mongoose) => {
    const SimCard = mongoose.model(
      "sim",
      mongoose.Schema(
        {
            MOBILE_NUMBER: {
                type: String,
                required: true,
            },
            SIM_NO: {
                type: String,
                required: true,
            },
            SIM_IMSI: {
                type: String,
                required: true,
            },
            BASKET_NAME: {
                type: String
            },
            SIM_STATUS: {
                type: String,
                required: true,
            },
            PLAN_NAME: {
                type: String,
                required: true,
            },
            Remarks1: {
                type: String
            },
            Remarks2: {
                type: String
            },
            Remarks3: {
                type: String
            },
            STATUS: {
                type: String,
                enum: ["Activate", "Deactivate"],
                required: true,
            }
        },
        { timestamps: true }
      )
    );
    return SimCard;
  };