
import dotenv from 'dotenv';
import HttpException from '../exceptions/HttpException';
dotenv.config();
const sgMail = require('@sendgrid/mail');

class MailService {

  public sendEmail = async (toemail: string, htmldata: string, subject: string) => {

    try {
      
      sgMail.setApiKey(process.env.SENGRID_API_KEY);
      const msg = {
        to: toemail,
        from: 'confirmation@wekeza.com',
        subject: subject,
        html: htmldata,
      };
      if (sgMail.send(msg)) {
        return sgMail;
      } else {
        throw new HttpException(409, `Mail Sending Failed`);;
      }

    } catch (error) {
      return error;
    }
  };

}

export default MailService