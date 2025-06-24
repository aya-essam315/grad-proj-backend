
import nodemailer from "nodemailer";

export const sendEmail = ({
    to=" ",
    subject=" ",
    text=" ",
    html=" "})=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });
      console.log(process.env.EMAIL);
      console.log(process.env.APP_PASSWORD);
      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: `E-Learning System App ${process.env.EMAIL}`, // sender address
          to,
          subject,
          text,
          html,
        });
      
        console.log("Message sent: %s", info.messageId);

      }
      
      main().catch(console.error);
}
