const multer = require("multer");
const fs = require("fs");
const path = require('path');

const eventImage = "public/event";
const profileImage = "public/profile";
const carImage = "public/car";
const postImage = "public/post";
const documentImage = "public/doc";
const image = "public/image";
const profileBackgroundimg = "public/profileBackgroundimg";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "eventImage") {
      if (fs.existsSync(eventImage)) {
        cb(null, eventImage);
      } else {
        fs.mkdir(eventImage, { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          cb(null, eventImage);
        });
      }
    }
    if (file.fieldname === "profileImage") {
      if (fs.existsSync(profileImage)) {
        cb(null, profileImage);
      } else {
        fs.mkdir(profileImage, { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          cb(null, profileImage);
        });
      }
    }
    if (file.fieldname === "profileBackgroundimg") {
      if (fs.existsSync(profileBackgroundimg)) {
        cb(null, profileBackgroundimg);
      } else {
        fs.mkdir(profileBackgroundimg, { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          cb(null, profileBackgroundimg);
        });
      }
    }
    if (file.fieldname === "carImage") {
      if (fs.existsSync(carImage)) {
        cb(null, carImage);
      } else {
        fs.mkdir(carImage, { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          cb(null, carImage);
        });
      }
    }
    if (file.fieldname === "postImage") {
      if (fs.existsSync(postImage)) {
        cb(null, postImage);
      } else {
        fs.mkdir(postImage, { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          cb(null, postImage);
        });
      }
    }
    if (file.fieldname === "documentImage") {
      if (fs.existsSync(documentImage)) {
        cb(null, documentImage);
      } else {
        fs.mkdir(documentImage, { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          cb(null, documentImage);
        });
      }
    }
    if (file.fieldname === "image") {
      if (fs.existsSync(image)) {
        cb(null, image);
      } else {
        fs.mkdir(image, { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          cb(null, image);
        });
      }
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
