import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';

const multer = require('multer');

var multerS3 = require('multer-s3');

const fs = require('fs');

dotenv.config();

export const isEmpty = (value: any): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const cleanObj = (input: any, allowedKeys: string[] = []) => {

  return Object.keys(input)
    .filter(key => allowedKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = input[key];
      return obj;
    }, {});
};

export const getFromAws = async (filename: string) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  const getParams = {

    Bucket: process.env.AWS_BUCKET_NAME,
    Expires: 60 * 5,
    Key: filename
  };
  const signedUrl = s3.getSignedUrl('getObject', getParams);
  return signedUrl;
}

export const uploadToAws = async (base64String: string, ext: string, filename: string) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
  const extension = ext;
  const random = Math.random().toString(3).slice(-3);
  const buffer = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const params1 = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename + '_' + random + '.' + extension,
    Body: buffer,
    ContentEncoding: 'base64',
    ACL: 'public-read',
  };
  const response: any = await new Promise((resolve, reject) => {
    s3.upload(params1, (err, data) => (err == null ? resolve(data) : reject(err)));
  });
  return response;
};

export const s3 = new AWS.S3({

  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

export const uploadS3 = multer(
  {
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      // Set public read permissions
      acl: 'public-read',
      // Auto detect contet type
      contentType: multerS3.AUTO_CONTENT_TYPE,
      // Set key/ filename as original uploaded name
      key: function (req, file, cb) {
        cb(null, file.originalname)
      }
    })
    // storage: multerS3({
    //   s3: s3,
    //   acl: 'public-read',
    //   bucket: process.env.AWS_BUCKET_NAME,
    //   metadata: (req, file, callBack) => {
    //     callBack(null, { fieldName: file.fieldname })
    //   },
    //   key: (req, file, callBack) => {
    //     var fullPath = 'products/' + file.originalname;//If you want to save into a folder concat de name of the folder to the path
    //     callBack(null, fullPath)
    //   }
    // }),
    // limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  });

// export const uploadToAws1 = async (file: string) => {
//   //const filestream = fs.createReadStream(file['path']);
//   // const uploadparam = {
//   //   Bucket: process.env.AWS_BUCKET_NAME,
//   //   Body: filestream,
//   //   Key: file['filename']
//   // }
//   //return upload.array()
//   // return s3.upload(uploadparam).promise();
//   // const response: any = await new Promise((resolve, reject) => {
//   //   s3.upload(params1, (err, data) => (err == null ? resolve(data) : reject(err)));
//   // });
//   // return response;

//   uploadS3(req, res, (error) => {
//     console.log('files', req.files);
//     if (error) {
//       console.log('errors', error);
//       res.status(500).json({
//         status: 'fail',
//         error: error
//       });
//     } else {
//       // If File not found
//       if (req.files === undefined) {
//         console.log('uploadProductsImages Error: No File Selected!');
//         res.status(500).json({
//           status: 'fail',
//           message: 'Error: No File Selected'
//         });
//       } else {
//         // If Success
//         let fileArray = req.files,
//           fileLocation;
//         const images = [];
//         for (let i = 0; i < fileArray.length; i++) {
//           fileLocation = fileArray[i].location;
//           console.log('filenm', fileLocation);
//           images.push(fileLocation)
//         }
//         // Save the file name into database
//         return res.status(200).json({
//           status: 'ok',
//           filesArray: fileArray,
//           locationArray: images
//         });
//       }
//     }
//   })
// };

export const getFromAws1 = async (file: string) => {

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  const downlaodparam = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file
  }

  return s3.getObject(downlaodparam).createReadStream();
  // const response: any = await new Promise((resolve, reject) => {
  //   s3.upload(params1, (err, data) => (err == null ? resolve(data) : reject(err)));
  // });
  // return response;
};

export const uploadToAwsDoc = async (base64String: string, ext: string, filename: string, bucketname: string) => {

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
  const extension = ext; //base64String.split(';')[0].split('/')[1];
  const random = Math.random().toString(3).slice(-3);
  //console.log(Math.random().toString(5).slice(-5));
  const buffer = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const params1 = {
    Bucket: bucketname,
    Key: filename + '_' + random + '.' + extension, // uuid()+'_'+
    Body: buffer,
    ContentEncoding: 'base64',
    ACL: 'public-read',
  };
  const response: any = await new Promise((resolve, reject) => {
    s3.upload(params1, (err, data) => (err == null ? resolve(data) : reject(err)));
  });
  return response;
};

export const replceCommaAll = input => {
  return input.replace(/,/g, '');
};

export const sliceStringSpace = input => {
  return input.split(' ');
};

export const getKeys = async (file: string) => {

  // Create a Secrets Manager client
  const secretsManager = new AWS.SecretsManager();

  // Retrieve the secret
  secretsManager.getSecretValue({ SecretId: 'your-secret-name' }, (err, data) => {
    if (err) {
      console.error('Error retrieving secret:', err);
    } else {
      const secretData = JSON.parse(data.SecretString);
      const apiKey = secretData.api_key; // Adjust the property name based on your secret structure
      // Now you can use apiKey in your application
    }
  });
};