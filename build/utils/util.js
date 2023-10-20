"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliceStringSpace = exports.replceCommaAll = exports.uploadToAwsDoc = exports.getFromAws1 = exports.uploadS3 = exports.s3 = exports.uploadToAws = exports.getFromAws = exports.cleanObj = exports.isEmpty = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer = require('multer');
var multerS3 = require('multer-s3');
const fs = require('fs');
dotenv_1.default.config();
const isEmpty = (value) => {
    if (value === null) {
        return true;
    }
    else if (typeof value !== 'number' && value === '') {
        return true;
    }
    else if (value === 'undefined' || value === undefined) {
        return true;
    }
    else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
        return true;
    }
    else {
        return false;
    }
};
exports.isEmpty = isEmpty;
const cleanObj = (input, allowedKeys = []) => {
    return Object.keys(input)
        .filter(key => allowedKeys.includes(key))
        .reduce((obj, key) => {
        obj[key] = input[key];
        return obj;
    }, {});
};
exports.cleanObj = cleanObj;
const getFromAws = async (filename) => {
    const s3 = new aws_sdk_1.default.S3({
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
};
exports.getFromAws = getFromAws;
const uploadToAws = async (base64String, ext, filename) => {
    const s3 = new aws_sdk_1.default.S3({
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
    const response = await new Promise((resolve, reject) => {
        s3.upload(params1, (err, data) => (err == null ? resolve(data) : reject(err)));
    });
    return response;
};
exports.uploadToAws = uploadToAws;
exports.s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});
exports.uploadS3 = multer({
    storage: multerS3({
        s3: exports.s3,
        bucket: process.env.AWS_BUCKET_NAME,
        // Set public read permissions
        acl: 'public-read',
        // Auto detect contet type
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // Set key/ filename as original uploaded name
        key: function (req, file, cb) {
            console.log('tetsts' + file.originalname);
            cb(null, file.originalname);
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
const getFromAws1 = async (file) => {
    const s3 = new aws_sdk_1.default.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    const downlaodparam = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file
    };
    return s3.getObject(downlaodparam).createReadStream();
    // const response: any = await new Promise((resolve, reject) => {
    //   s3.upload(params1, (err, data) => (err == null ? resolve(data) : reject(err)));
    // });
    // return response;
};
exports.getFromAws1 = getFromAws1;
const uploadToAwsDoc = async (base64String, ext, filename, bucketname) => {
    const s3 = new aws_sdk_1.default.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    const extension = ext; //base64String.split(';')[0].split('/')[1];
    const random = Math.random().toString(3).slice(-3);
    //console.log(Math.random().toString(5).slice(-5));
    const buffer = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const params1 = {
        Bucket: bucketname,
        Key: filename + '_' + random + '.' + extension,
        Body: buffer,
        ContentEncoding: 'base64',
        ACL: 'public-read',
    };
    const response = await new Promise((resolve, reject) => {
        s3.upload(params1, (err, data) => (err == null ? resolve(data) : reject(err)));
    });
    return response;
};
exports.uploadToAwsDoc = uploadToAwsDoc;
const replceCommaAll = input => {
    return input.replace(/,/g, '');
};
exports.replceCommaAll = replceCommaAll;
const sliceStringSpace = input => {
    return input.split(' ');
};
exports.sliceStringSpace = sliceStringSpace;
//# sourceMappingURL=util.js.map