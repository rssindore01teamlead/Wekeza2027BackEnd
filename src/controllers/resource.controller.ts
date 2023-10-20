
import { NextFunction, Request, Response } from 'express';
import userService from '../services/users.service';
import { getFromAws1 } from '../utils/util';


class ResourceController {

  public userService = new userService();

  public images = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      const imagepath = req['files'];
      res.status(201).json({ imagepath: imagepath, message: 'success' });
    } catch (error) {
      next(error);
    }
  }

  public getImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      const key = req.params.key;
      const readStream = await getFromAws1(key);
      readStream.pipe(res);
    } catch (error) {
      next(error);
    }
  };
}

export default ResourceController