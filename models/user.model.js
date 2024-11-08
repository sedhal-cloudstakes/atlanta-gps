const { ROLE } = require("../config/roles");
module.exports = (mongoose) => {
  const UserSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      photo: {
        type: String
      },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
      },
      role: {
        type: String,
        enum: [ROLE.superadmin, ROLE.admin, ROLE.accounts, ROLE.comapnyOwner],
      },
      deletedAt: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );
   const Users = mongoose.model("users", UserSchema)
   return Users;
};
