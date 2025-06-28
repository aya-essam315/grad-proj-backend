import { asyncHandler } from "../../utils/errors/async.handler.js";
import Randomstring from "randomstring";
import { emailEvent } from "../../utils/events/send.email.js";
import { UserModel } from "../../db/models/user.model.js";
import { hashData } from "../../utils/security/hash.js";
import { compareValues } from "../../utils/security/hash.js";
import { generateToken } from "../../utils/security/token.js";
import { OAuth2Client } from "google-auth-library";
import { successResponse } from "../../utils/success/success.response.js";


export const signUp = asyncHandler(async (req,res,next) => {
    const {firstName, lastName, email, password, DOB, learningStyle, role}= req.body;
    
    const userExists = await UserModel.findOne({email});
    if(userExists){
        return next(new Error("User already exists", {cause:409}));
             }
    // const OTP = Randomstring.generate({length:6, charset:"alphanumeric"});
    
    // emailEvent.emit("sendEmail", {email, OTP, subject:"confirmation Email"});
    const createdUser = await UserModel.create({
       firstName,
       lastName,
       email,
       password,
       DOB,
       learningStyle,
       role

    });
      successResponse({res, message:"done"})
})



export const logIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));
  if (!user.isConfirmed)
    return next(new Error("Email not confirmed", { cause: 401 }));

  //check if 30 days has passed from delete account
  if (user.isDeleted == true) {
    const currentDate = new Date();
    const deletedAtDate = new Date(user.deletedAt);
    const timeDifference = currentDate - deletedAtDate;
    const after30Days = 30 * 24 * 60 * 60 * 1000;
    if (timeDifference > after30Days) {
      return next(new Error("User deleted", { cause: 401 }));
    }

    user.isDeleted = false;
  }
  if (!compareValues({ data: password, hashedData: user.password })) {
    return next(new Error("Invalid password", { cause: 401 }));
  }
  const access_token = generateToken({
    payload: { id: user._id },
    //  expiresIn:3600
  });
  const refresh_token = generateToken({
    payload: { id: user._id },
    expiresIn: 604800,
  });
  await user.save();
  successResponse({
    res,
    message: "loged in successfully",
    data: { access_token, refresh_token, role: user.role },
  });

})
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.authUser.id);
  if (!user) return next(new Error("User not found", { cause: 404 }));
  successResponse({ res, data: user });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  // console.log(req.body);

  const { email } = req.body;

  const user = await UserModel.findOne({ email }, { isDeleted: false });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const OTP = Randomstring.generate({ length: 6, charset: "alphanumeric" });
  console.log(OTP);

  emailEvent.emit("sendEmail", { email, OTP, subject: "forgetpassord" });
  user.OTP.push({
    code: hashData({ data: OTP }),
    codeType: "forgetPassword",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await user.save();
  // console.log(user.OTP[6]);
  successResponse({ res, message: "code has sent to reset password" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, OTP, newPassword } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (!user.isConfirmed)
    return next(new Error("Email not confirmed", { cause: 401 }));
  const latestOtp = user.OTP[user.OTP.length - 1];
  // console.log(latestOtp);

  if (latestOtp.expiresAt < Date.now()) {
    return next(new Error("OTP expired", { cause: 401 }));
  }
  if (latestOtp.codeType != "forgetPassword")
    return next(new Error("not allowed", { cause: 401 }));
  if (!compareValues({ data: OTP, hashedData: latestOtp.code }))
    return next(new Error("invalid otp", { cause: 401 }));

  user.password = newPassword;
  user.changeCredentialTime = Date.now();
  user.markModified("password");

  await user.save();
  // console.log(user);
  successResponse({ res, message: "Password reset successfully" });
});
