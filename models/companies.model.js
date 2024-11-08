const { ROLE } = require("../config/roles");
module.exports = (mongoose) => {
 const CompanySchema = mongoose.Schema(
      {
        name: {
          type: String,
          required: true,
        },
        ownerName: {
          type: String,
          required: true,
        },
        mobileNo: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          trim: true,
          lowercase: true,
          unique: true,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
        dob: {
          type: Date,
          required: false
        },
        address: {
          type: String,
          required: true,
        },
        state: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "states",
          required: true,
        },
        city: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "cities",
          required: true,
        },
        photo: {
          type: String
        },
        adharPhoto: {
          type: String,
        },
        panPhoto: {
          type: String,
        },
        cart: [{
          plan: { type: mongoose.Schema.Types.ObjectId, ref: 'plans' },
          quantity: Number,
        }],
        plan: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "plans",
        },
        planStartDate: {
          type : Date
        },
        planEndDate: {
          type : Date
        },
        NumberOfVehicle: {
          type: Number
        },
        fcmToken: {
          type: String
        },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Approved",
        },
        otp: {
          type: Number,
          default: null
        },
        role: {
          type: String,
          enum: [ROLE.user],
          default: ROLE.user,
          required: false
        },
        deletedAt: {
          type: Boolean,
          default: false
        }
      },
      { timestamps: true }
    );

    CompanySchema.pre('save', async function (next) {
      const company = this;
      
      // Check if the password field is modified or is new
      if (!company.isModified('password')) {
        return next();
      }
      // Generate a salt and hash the password
      const hashedPassword = await bcrypt.hash(company.password, 12);
      // Replace the plaintext password with the hashed password
      company.password = hashedPassword;
      next();
    });

    // Define the fields to exclude from the JSON response
    const excludedFields = ['password', 'createdAt','updatedAt','deletedAt','__v'];
    CompanySchema.set('toJSON', {
      transform: function (doc, ret) {
        excludedFields.forEach((field) => {
          delete ret[field];
        });
      }
    });

    const Companies = mongoose.model("companies", CompanySchema)
    return Companies;
};
