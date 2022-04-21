const fs = require("fs");

const db = require("../models/sequelize.model");
const Image = db.images;

const uploadFiles = async (req, res) => {
  try {
    console.log(req.file);

    if (req.file === "undefined" || req.file == null){
      return res.status(422).send("Bild kann nicht leer sein, bitte wählen Sie eines aus.");
    }

    Image.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      data: fs.readFileSync(
        __basedir + "/uploads/images/" + req.file.filename
      ),
    }).then((image) => {
      fs.writeFileSync(
        __basedir + "/uploads/tmp/" + image.name,
        image.data
      );

      let file = req.file;
      return res.status(200).send({name: file.filename});
      //return res.send(`File has been uploaded.`);
    });
  } catch (error) {
    console.log(error);
    return res.send(`Beim Bild hochladen ist ein Fehler aufgetreten: ${error}`);
  }
};

module.exports = {
  uploadFiles,
};
