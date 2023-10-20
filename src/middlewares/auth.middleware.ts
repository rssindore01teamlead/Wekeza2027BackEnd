
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import DB, { T } from '../database/index.schema';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {

  try {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const secret = process.env.JWT_SECRET;
      const verificationResponse = (await jwt.verify(bearerToken, secret)) as DataStoredInToken;
      const userId = verificationResponse.user_id;
      const findUser: User = await DB(T.ER_SIGNUP).where('user_id', Number(userId)).first();
      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
