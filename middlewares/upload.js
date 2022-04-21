const multer = require("multer");
const path = require("path");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Bitte nur Bilder hochladen.", false);
  }
};

/*var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});*/


//start upload image
var storage = multer.diskStorage(
    {
      destination: function (req, file, cb){
        cb(null, __dirname + "/uploads/images/");
      },
      filename: function (req, file, cb) {
        cb(null, Date.now()+path.extname(file.originalname));
      },
    }
);

const upload = multer({storage: storage});
var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;

//end upload image
