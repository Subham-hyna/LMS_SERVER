import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { MEMBERSHIP_STATUS, USER_ROLES } from "../constants.js";
import crypto from "crypto";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    registrationNo: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    avatar: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        }
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [6, "Password should be greater than 8 characters"],
      select: false,
    },
    refreshToken: {
        type: String,
        select: false
    },
    role: {
        type: String,
        required: true,
        enum : USER_ROLES,
        default: 'MEMBER'
    },
    membershipStatus: {
        type: String,
        required: true,
        enum : MEMBERSHIP_STATUS,
        default: 'ACTIVE'
    },
    isUserVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationOTP: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date
},
{
    timestamps: true
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateVerificationTokenAndOtp = function () {

  const verifyToken = crypto.randomBytes(20).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  let digits = '0123456789'; 
  let OTP = ''; 
  let len = digits.length 
  for (let i = 0; i < 6; i++) { 
      OTP += digits[Math.floor(Math.random() * len)]; 
  } 

  this.verificationOTP = OTP;
  return {verifyToken, OTP};
}

export const User = mongoose.model("User", userSchema)