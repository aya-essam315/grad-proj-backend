import joi from "joi";
import { generlaFielsValidation } from "../../middleware/validation/validation.js";
import { roles, systemRoles } from "../../utils/global/enums.js";

export const signUpValidation = joi
  .object({
    firstName: generlaFielsValidation.firstName.required(),
    lastName: generlaFielsValidation.lastName.required(),
    email: generlaFielsValidation.email.required(),
    password: generlaFielsValidation.password.required(),
    confirmPassword: generlaFielsValidation.confirmPassword,
    gender: generlaFielsValidation.gender,
    DOB: generlaFielsValidation.DOB,
    systemRole: joi.string().valid(...Object.values(systemRoles)),
    role: joi.string().valid(...Object.values(roles)),
    learningStyle: joi.array().items(joi.string()).when("role", {
      is: "student",
      then: joi.required(),
      otherwise: joi.optional(),
    }),
  })
  .required();

export const confirmEmail = joi
  .object({
    email: generlaFielsValidation.email.required(),
    OTP: generlaFielsValidation.OTP.required(),
  })
  .required();

export const signInValidation = joi
  .object({
    email: generlaFielsValidation.email.required(),
    password: generlaFielsValidation.password.required(),
  })
  .required();

export const refreshTokenValidation = joi
  .object({
    refreshToken: joi.string().required(),
  })
  .required();

export const forgetPassword = joi
  .object({
    email: generlaFielsValidation.email.required(),
  })
  .required();

export const resetPasswordValidation = joi
  .object({
    email: generlaFielsValidation.email.required(),
    newPassword: generlaFielsValidation.password.required(),
    OTP: generlaFielsValidation.OTP,
  })
  .required();

export const updatePassword = joi
  .object({
    oldPassword: generlaFielsValidation.password.required(),
    newPassowrd: generlaFielsValidation.password
      .not(joi.ref("oldPassword"))
      .required()
      .messages({ message: "new password is the same as old password" }),
    cNewPassword: joi.string().valid(joi.ref("newPassowrd")).required(),
  })
  .required();
