const multer = require('multer');
const multerS3 = require('multer-s3');// phien ban phai phu hop voi aws ( multer-s3 ver2.xx => aws ver 2.xx)
const aws = require('aws-sdk'); 
require('dotenv/config');
const FILE_EXTENSION = {
    'image/jpeg': '.jpeg',
    'image/jpg': '.jpg',
    'image/png': '.png',
}

//Config AWS
aws.config.update({
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    accessKeyId: process.env.S3_KEY_ID,
    region: 'ap-southeast-1',
});

const s3 = new aws.S3();

// Config Disk in multer
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         let err = new Error('Type file is not valid');
//         const isValidFileName = FILE_EXTENSION[file.mimetype];
//         if(isValidFileName){
//             err = null;
//         }
//         cb(err, 'public/uploads')
//     },
//     filename: function (req, file, cb) {
//         const extension = FILE_EXTENSION[file.mimetype];
//         const filename = file.originalname.replace(' ', '-');
//         cb(null, `${filename}-${Date.now()}${extension}`)
//     }
// })

// Config Disk aws3 in multer
const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'image-ecommerce-bucket',
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
        //thông tin thêm, cho trường hợp muốn lưu thông tin user post
      },
      key: function (req, file, cb) {
        const extension = FILE_EXTENSION[file.mimetype];
        const filename = file.originalname.replace(' ', '-');
        cb(null, `${filename}-${Date.now()}${extension}`);
      }
    })
  });

module.exports  = upload;
