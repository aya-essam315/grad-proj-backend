import joi from "joi";
import { gender, systemRoles } from "../../utils/global/enums.js";
import { Types } from "mongoose";
export const generlaFielsValidation = {
  firstName: joi.string().min(2).max(50),
  lastName: joi.string().min(2).max(50),
  email: joi.string().email(),
  password: joi
    .string()
    .pattern(new RegExp(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)),
  
  confirmPassword: joi.ref("password"),
  gender: joi.string().valid(...Object.values(gender)),
  // DOB: joi.date().min("1900-01-01").max("2025-03-02"),
  DOB: joi.string().pattern(new RegExp(/^\d{4}-\d{2}-\d{2}$/)),
  systemRole: joi.string().valid(...Object.values(systemRoles)),
  OTP: joi.string().length(6),
  id: joi.custom(isValidId),

  attachment: joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().required(),
  }),
};
export const isValidate = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };

    if (req.file || req.files) data.attachment = req.file || req.files;
    // console.log(data);

    const result = schema.validate(data, { abortEarly: false });

    if (result.error) {
      let messages = result.error.details.map((ele) => ele.message);
      return next(new Error(messages, { cause: 400 }));
    }

    return next();
  };
};

export function isValidId(data, helpers) {
  if (!Types.ObjectId.isValid(data)) {
    return helpers.error("Invalid ID");
  }
  return true;
}
