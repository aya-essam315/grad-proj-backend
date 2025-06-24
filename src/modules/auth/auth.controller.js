import {Router} from "express";
import * as authServices from "../auth/auth.service.js"
import { isValidate } from "../../middleware/validation/validation.js";
import * as authValidators from "../auth/auth.validation.js"
import { authentication } from "../../middleware/authentication.js";
import { authorization } from "../../middleware/authorization.js";
import { endpoint } from "./endpoint.js";

const router = Router();

router.post("/signup",
    isValidate(authValidators.signUpValidation),
    authServices.signUp)

router.patch("/confirmEmail",
     isValidate(authValidators.confirmEmail),
     authServices.confirmEmail)

router.post("/login",
     isValidate(authValidators.signInValidation),
     authServices.logIn)

// router.post("/signupwirhgoogle",
//       authServices.signupwithgemail)

// router.post("/refresh-token",
//       isValidate(authValidators.refreshTokenValidation),
//       authServices.refreshToken)

router.post("/forgetpassword",
      isValidate(authValidators.forgetPassword),
      authServices.forgetPassword)


router.patch("/resetpassword",
      isValidate(authValidators.resetPasswordValidation),
      authServices.resetPassword)
      
// router.post("/test",  isAuthenticated,authServices.test)

router.get("/getuser",
      authentication,
      authorization(endpoint.profile),
      authServices.getUser)
export default router