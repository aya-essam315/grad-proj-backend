

import {EventEmitter} from "events";
import { sendEmail } from "../email/sendEmail.js";


export const emailEvent = new EventEmitter();

// export const OTPEmail=({eventname, email,OTP})=>{
// emailEvent.emit(eventname, (email, OTP))
// }



emailEvent.on("sendEmail", async({email, OTP, subject})=>{
  
    sendEmail(
        {
            to:email,
            subject,
            html:`<h3>Your OTP is ${OTP}</h3>`
        }
    )

})