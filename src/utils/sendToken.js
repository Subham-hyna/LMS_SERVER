import { User } from "../models/user.model.js"
import { ApiError } from "./apiError.js"
import { ApiResponse } from "./apiResponse.js"

export const sendToken = async(user, statusCode, res, message) => {
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true
    }

    const loggedInUser = await User.findById(user._id);
  
    return res
    .status(statusCode)
    .cookie("LMS_accessToken", accessToken, options)
    .cookie("LMS_refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user:loggedInUser, accessToken, refreshToken, message
            },
            "User logged In Successfully"
        )
    )

  };