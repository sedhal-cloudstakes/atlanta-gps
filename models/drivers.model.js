const { ROLE } = require("../config/roles");
module.exports = (mongoose) => {
  const DriverSchema = mongoose.Schema(
      {
        name: {
          type: String,
          required: true,
        },
        client: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "companies",
          required: true,
        },
        dob: {
          type: Date,
          required: true
        },
        gender: {
          type: String,
          enum: ["Male", "Female"],
          required: true,
        },
        mobileNo: {
          type: String,
          required: true,
        },
        state: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'states',
          required:true
        },
        city: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'cities',
          required:true
        },
        address: {
          type: String,
          required: true,
        },
        drivingLicence: {
          type: String,
          required: true,
        },
        photo: {
          type: String,
          required: true,
        },
        adharPhoto: {
          type: String,
          required: true,
        },
        panPhoto: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          default: "Available",
          enum: ["Available", "OnTrip"],
          required: true,
        },
        deletedAt: {
          type: Boolean,
          default: false
        },
      },
      { timestamps: true }
    );

    // Define the fields to exclude from the JSON response
    const excludedFields = ['createdAt','updatedAt','deletedAt','__v'];
    DriverSchema.set('toJSON', {
      transform: function (doc, ret) {
        excludedFields.forEach((field) => {
          delete ret[field];
        });
      }
    });

    const Drivers = mongoose.model("drivers", DriverSchema) 
    return Drivers;
};
