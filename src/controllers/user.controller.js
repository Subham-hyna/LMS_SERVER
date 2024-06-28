import {asyncHandler} from "../utils/asyncHandler.js"
import { sendEmail } from "../utils/sendEmail.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { User } from "../models/user.model.js";
import crypto from "crypto";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import userVerificationTemplate from "../mailTemplates/userVerification.template.js";
import userCredentialsTemplate from "../mailTemplates/userCredentials.template.js";
import { sendToken } from "../utils/sendToken.js";
import { ApiFeatures } from "../utils/apiFeatures.js";
import { USER_RESULT_PER_PAGE } from "../constants.js";
import { passwordResetMail } from "../mailTemplates/passwordReset.template.js";

export const registerUser = asyncHandler( async(req,res,next) => {

    const { name, email, registrationNo } = req.body;

    if( [name,email,registrationNo].some((field) => field.trim() === "")){
        return next(new ApiError(400, "All fields are required"))
    }

    const userExist = await User.findOne({
        $or: [{ email }, { registrationNo }]
    })

    if(userExist){
        if(userExist.isUserVerified){
            return next(new ApiError(400,"User already exist for this email or registartion Number"))
        }
        else{
            const image = await uploadOnCloudinary(req.file.path)
            const avatar = {
              public_id : image.public_id,
              url : image.secure_url
            }
            await deleteFromCloudinary(userExist.avatar.public_id);
            const updatedUser = await User.findByIdAndUpdate(
                userExist._id,
                {
                    $set: {
                        name,
                        email,
                        registrationNo,
                        avatar
                    }
                },
                {
                    new: true
                }
            )

            const {verifyToken, OTP} = updatedUser.generateVerificationTokenAndOtp();
    
            await updatedUser.save({ validateBeforeSave: false });
          
            const VerificationLink = process.env.FRONTEND_URL+ "user/verify/" + verifyToken ;

            await sendEmail(updatedUser.email,"User Verification", userVerificationTemplate(updatedUser.name,VerificationLink,OTP))

            res.status(200).json(
                new ApiResponse(200,{user:updatedUser},"User Updated not verified")
            )
        }
    }else{
        const image = await uploadOnCloudinary(req.file.path)
        const avatar = {
          public_id : image.public_id,
          url : image.secure_url
        }
        const user = await User.create({
            name,
            email,
            registrationNo,
            avatar,
            password: "123456"
        })

        const createdUser = await User.findById(user._id);

        if(!createdUser){
            return next(new ApiError(400,"Something went wrong while registering the user"));
        }

        const {verifyToken, OTP} = createdUser.generateVerificationTokenAndOtp();
    
            await createdUser.save({ validateBeforeSave: false });
          
            const VerificationLink = process.env.FRONTEND_URL + "user/verify/" +verifyToken ;

            await sendEmail(createdUser.email,"User Verification", userVerificationTemplate(createdUser.name,VerificationLink,OTP))

        res
        .status(201)
        .json(
            new ApiResponse(201,{user:createdUser},"User Created Successfully")
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
    }).select("+password")

    if(!user){
        return next(new ApiError(400,"Verification Link is invalid"))
    }

    if(user.verificationOTP !== otp){
        return next(new ApiError(400,"OTP is invalid"))
    }

    let password = '';
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$';
 
    for (let i = 1; i <= 8; i++) {
        let char = Math.floor(Math.random()
            * str.length + 1);
 
        password += str.charAt(char)
    }

    const verifiedUser = await User.findByIdAndUpdate(
        user._id,
        {
            $unset:{
                verificationOTP: 1,
                verificationToken: 1
            },
            $set:{
                isUserVerified: true
            }
        },
        {
            new: true
        }
    )
    
    verifiedUser.password = password;

    await verifiedUser.save({validateBeforeSave: false})

    await sendEmail(verifiedUser.email,"Account Credentials",userCredentialsTemplate(verifiedUser.name,verifiedUser.email,verifiedUser.registrationNo,password,process.env.FRONTEND_URL));

    res.status(201).json(
        new ApiResponse(201,{},"You are successfully Verified. Account Credentials have been set via email")
    )
})

export const loginUser = asyncHandler( async(req,res,next) => {

    const { email, registrationNo, password } = req.body;

    if((!email && !registrationNo) || !password){
        return next(new ApiError(400, "All fields are required"))
    }

    const user = await User.findOne({
        $or:[{ email },{ registrationNo }]
    }).select("+password")

    if(!user){
        return next(new ApiError(400,"User doesn't exist"));
    }

    if(!user.isUserVerified){
        return next(new ApiError(400,"User not verified. Check your mail for verification"))
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        return next(new ApiError(400,"Invalid user credentials"));
    }

    sendToken(user,200,res,"Logged In Successfully");
})

export const logout = asyncHandler( async(req,res,next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("LMS_accessToken", options)
    .clearCookie("LMS_refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export const getCurrentUser = asyncHandler(async(req,res,next)=>{
    res.status(200).json(
        new ApiResponse(200,{user:req.user},"User fetched successfully")
    )
})

export const changeCurrentPassword = asyncHandler(async(req,res,next) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id).select("+password")
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))

})

export const updateAvatar = asyncHandler(async(req,res,next) => {
    
    if(!req.file){
        return next(new ApiError(400,"Please select a file"))
    }

    const user = await User.findById(req.user?._id);
    await deleteFromCloudinary(user.avatar.public_id);


    const image = await uploadOnCloudinary(req.file.path);

    const avatar = {
        public_id: image.public_id,
        url: image.secure_url
    }

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            $set:{
                avatar
            }
        },
        {
            new: true
        }
    )

    if(!updatedUser){
        return next(new ApiError(401,"Avatar not uploaded"))
    }

    res
    .status(201)
    .json(
        new ApiResponse(201,{user: updatedUser},"Avatar Updated successfully")
    )
})

export const getUser = asyncHandler( async(req,res,next) => {

    const resultPerPage = USER_RESULT_PER_PAGE;

    let apiFeatures = new ApiFeatures(User.find({isUserVerified: true}).find({_id:{$ne:req.user._id}}).sort({createdAt : -1}),req.query)
    .searchUser()
    .filter()

    let users = await apiFeatures.query;

    const userFilteredCount = users.length;

    apiFeatures = new ApiFeatures(User.find({isUserVerified: true}).find({_id:{$ne:req.user._id}}).sort({createdAt : -1}),req.query)
    .searchUser()
    .filter()
    .pagination(resultPerPage);

    users = await apiFeatures.query;

    if(!users){
        return next(new ApiError(401,"Error in fetching users"))
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,{
            users,
            resultPerPage,
            userFilteredCount
        },"Users fetched successfully")
    )
})

export const getSingleUser = asyncHandler( async(req,res,next) => {

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ApiError(401,"User doesn't exist"));
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,
            {user},
            "User fetched successfully")
    )

})

export const changeMembershipStatus = asyncHandler( async(req,res,next) => {

    const { membershipStatus } = req.body;

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ApiError(401,"User doesn't exist"));
    }

    user.membershipStatus = membershipStatus;
    await user.save({validateBeforeSave: true});

    res
    .status(200)
    .json(
        new ApiResponse(200,
            {user},
            "User Membership Status changed successfully")
    )
})

export const forgotPassword = asyncHandler( async(req,res,next) => {

    const user = await User.findOne({ email: req.body.email , 
        isUserVerified: true});
  
    if (!user) {
      return next(new ApiError(404,"User not found"));
    }
  
    const resetToken = user.getResetPasswordToken();
    
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = process.env.FRONTEND_URL + "user/reset-password/" + resetToken ;
  
    try {
      await sendEmail(user.email , "Password Reset" , passwordResetMail(user.name , resetPasswordUrl));
  
      res.status(200).json(
        new ApiResponse(201,{},`Email send to ${user.email} successfully`)
      );
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ApiError(500,error.message));
    }
  });

export const resetPassword = asyncHandler(async (req, res, next) => {

    const { password, confirmPassword } = req.body;

    if(!password || !confirmPassword ){
        return next(new ApiError(400, "Fill up al the fields"))
    }

    if ( password !== confirmPassword ) {
        return next(new ApiError(400,"Password does not password"));
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      isUserVerified: true,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ApiError(
          400,
          "Reset Password Token is invalid or has been expired"
        )
      );
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save({validateBeforeSave: false});
  
    sendToken(user, 200, res , "Logged In successfully");
  });