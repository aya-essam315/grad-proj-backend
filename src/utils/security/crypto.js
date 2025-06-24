

import CryptoJS from "crypto-js";

export const CryptPhone  = ({data, secretKey=process.env.SECRET_KEY})=>{
    const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
    console.log(encrypted);
    return encrypted;
    
 
}

export const decryptData = ({data, secretKey=process.env.SECRET_KEY})=>{
    return CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
}