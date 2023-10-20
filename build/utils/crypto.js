"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
var CryptoJS = require("crypto-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const encrypt = (input) => {
    return CryptoJS.AES.encrypt(input, process.env.SECRET_KEY).toString();
};
exports.encrypt = encrypt;
const decrypt = (input) => {
    var bytes = CryptoJS.AES.decrypt(input, process.env.SECRET_KEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};
exports.decrypt = decrypt;
//# sourceMappingURL=crypto.js.map