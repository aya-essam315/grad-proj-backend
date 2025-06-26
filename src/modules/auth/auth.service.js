import { asyncHandler } from "../../utils/errors/async.handler.js";
import Randomstring from "randomstring";
import { emailEvent } from "../../utils/events/send.email.js";
import { UserModel } from "../../db/models/user.model.js";
import { hashData } from "../../utils/security/hash.js";
import { compareValues } from "../../utils/security/hash.js";
import { generateToken } from "../../utils/security/token.js";
import { OAuth2Client } from "google-auth-library";
import { successResponse } from "../../utils/success/success.response.js";

export const signUp = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, DOB, learningStyle, role } =
    req.body;

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return next(new Error("User already exists", { cause: 409 }));
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
    role,
    //  OTP:[
    //     {
    //         code: hashData({data:OTP}),
    //         codeType:"confirmEmail",
    //         expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    //     }

    //     ],
    // provider:"system"
  });
  successResponse({ res, message: "done" });
});

// export const confirmEmail = asyncHandler(async (req,res,next) => {
//     const {email, OTP} = req.body;

//     const user  = await UserModel.findOne({email});
//     if(!user){
//         return next(new Error("User not found", {cause:404}));
//     }
//     if(user.isConfirmed){
//         return next(new Error("Email already confirmed", {cause:409}));
//     }
//     const otp = user.OTP;
//     //get last otp has sent
//     const latestOtp = otp[otp.length-1];
//     // console.log(latestOtp);
//     if(latestOtp.expiresAt < Date.now()){
//         return next(new Error("OTP expired", {cause:401}));
//     }
//     if(!latestOtp.codeType == "confirmEmail")  return next(new Error("not allowed", {cause:401}));

//     if(!compareValues({data:OTP, hashedData: latestOtp.code})){
//         return next(new Error("Invalid OTP", {cause:401}));
//       }
//     user.isConfirmed = true;
//     await user.save();
//    successResponse({res, message:"Email confirmed successfully"})

// })

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
    data: { access_token, refresh_token },
  });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.authUser.id);
  if (!user) return next(new Error("User not found", { cause: 404 }));
  successResponse({ res, data: user });
});
// export const signupwithgemail = asyncHandler(async (req,res,next)=>{
//     const {idToken} = req.body;

// const client = new OAuth2Client();
// async function verify() {
//   const ticket = await client.verifyIdToken({
//       idToken,
//       audience: process.env.CLIENT_ID

//   });
//   const payload = ticket.getPayload();
//   const userid = payload['sub'];
//   // If the request specified a Google Workspace domain:
//   // const domain = payload['hd'];
//   return payload
// }
// const payload = await verify();
// if(!payload.email_verified) return  next(new Error("invalid idToken", {cause:400}));
// const user = await UserModel.findOne({email:payload.email});
// // console.log(payload.email);
// if(user) return next(new Error("User already exists", {cause:400}));
// const createdUser = await UserModel.create({
//     firstName:payload.given_name,
//     lastName:payload.family_name,
//     email: payload.email,
//     provider:"google",
//     isConfirmed:true
//     // profilePic: payload.profile

// })

// const access_token = generateToken({
//     payload:{id:createdUser._id},
//      expiresIn:3600})
// const refresh_token = generateToken({
//     payload:{id:createdUser._id},
//     expiresIn:604800
// })

//    successResponse({res, message:"loged in successfully", data:{access_token, refresh_token}})

// })

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
