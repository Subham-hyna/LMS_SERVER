import {asyncHandler} from "../utils/asyncHandler.js"
import { sendEmail } from "../utils/sendEmail.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { User } from "../models/user.model.js";
import crypto from "crypto";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import userVerificationTemplate from "../mailTemplates/userVerification.template.js";

export const registerUser = asyncHandler( async(req,res,next) => {

    const { name, email, registrationNo } = req.body;

    if( [name,email,registrationNo].some((field) => field.trim() === "")){
        return next(new ApiError(400, "All fields are required"))
    }

    const userExist = await User.findOne({
        $or: [{ email }, { registrationNo }]
    })


    const image = await uploadOnCloudinary(req.file.path)
    const avatar = {
      public_id : image.public_id,
      url : image.secure_url
    }

    if(userExist){
        if(userExist.isEmailVerified){
            return next(new ApiError(400,"User already exist"))
        }
        else{
            userExist.name = name;
            userExist.email = email;
            userExist.registrationNo = registrationNo;
            deleteFromCloudinary(userExist.avatar.public_id);
            userExist.avatar = avatar

            await userExist.save({validateBeforeSave : true});

            const updatedUser = await User.findById(userExist._id);

            const {verifyToken, OTP} = updatedUser.generateVerificationTokenAndOtp();
    
            await updatedUser.save({ validateBeforeSave: false });
          
            const VerificationLink = process.env.FRONTEND_URL + verifyToken ;

            await sendEmail(updatedUser.email,"User Verification Mail", userVerificationTemplate(updatedUser.name,VerificationLink,OTP))

            res.status(200).json(
                new ApiResponse(200,updatedUser,"User Updated not verified")
            )
        }
    }else{
        const user = await User.create({
            name,
            email,
            registrationNo,
            password: "123456",
            avatar
        })

        const createdUser = await User.findById(user._id);

        if(!createdUser){
            return next(new ApiError(400,"Something went wrong while registering the user"));
        }

        const {verifyToken, OTP} = createdUser.generateVerificationTokenAndOtp();
    
            await createdUser.save({ validateBeforeSave: false });
          
            const VerificationLink = process.env.FRONTEND_URL + verifyToken ;

            await sendEmail(createdUser.email,"User Verification Mail", userVerificationTemplate(createdUser.name,VerificationLink,OTP))

        res.status(201).json(
            new ApiResponse(201,createdUser,"User Created Successfully")
        )
    }

})

export const verifyUser = asyncHandler( async(req,res,next) => {

    const {token} = req.params;
    const {otp} = req.body;

    const verificationToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      verificationToken
    })

    if(!user){
        return next(new ApiError(402,"Verification Link is invalid"))
    }

    if(user.verificationOTP !== otp){
        return next(new ApiError(402,"OTP is invalid"))
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationOTP = undefined;

    await user.save({validateBeforeSave: false});

    res.status(201).json(
        new ApiResponse(201,user,"You are successfully Verified")
    )
})

export const loginUser = asyncHandler( async(req,res,next) => {
})