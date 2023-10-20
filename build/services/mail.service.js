"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
dotenv_1.default.config();
const sgMail = require('@sendgrid/mail');
class MailService {
    constructor() {
        this.sendEmail = async (toemail, htmldata, subject) => {
            try {
                console.log(' in mail sending' + process.env.SENGRID_API_KEY);
                sgMail.setApiKey(process.env.SENGRID_API_KEY);
                const msg = {
                    to: toemail,
                    from: 'confirmation@wekeza.com',
                    subject: subject,
                    html: htmldata,
                };
                if (sgMail.send(msg)) {
                    return sgMail;
                }
                else {
                    throw new HttpException_1.default(409, `Mail Sending Failed`);
                    ;
                }
            }
            catch (error) {
                console.log(error);
                return error;
            }
        };
    }
}
exports.default = MailService;
//# sourceMappingURL=mail.service.js.map