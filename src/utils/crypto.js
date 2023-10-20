var CryptoJS = require("crypto-js");
import dotenv from 'dotenv';
dotenv.config();


export const encrypt=(input)=>{
   return CryptoJS.AES.encrypt(input, process.env.SECRET_KEY).toString();
}

export const decrypt=(input)=>{
    var bytes  = CryptoJS.AES.decrypt(input, process.env.SECRET_KEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

