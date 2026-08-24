const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// ADDRESS SCHEMA (STRONG)
const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true },
);

// USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    // AUTH
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    passwordResetToken: {
      type: String,
    },

    passwordResetExpires: {
      type: Date,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    //  PROFILE
    fullName: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    addresses: [addressSchema],
  },
  {
    timestamps: true,

    // JSON transform (SECURITY)
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// HASH PASSWORD (HOOK)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// INSTANCE METHOD
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//  STATIC METHOD (OPTIONAL PRO LEVEL)
userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

userSchema.methods.generatePasswordResetToken = function () {
  /*
    |--------------------------------------------------------------------------
    | GENERATE RAW TOKEN
    |--------------------------------------------------------------------------
    */

  const resetToken = crypto.randomBytes(32).toString("hex");

  /*
    |--------------------------------------------------------------------------
    | HASH TOKEN
    |--------------------------------------------------------------------------
    */

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  /*
    |--------------------------------------------------------------------------
    | EXPIRY
    |--------------------------------------------------------------------------
    */

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
