const artikelController = require("../controllers/artikel.controller");
const uploadController = require("../controllers/upload");
const upload = require("../middlewares/upload");

const express = require("express");
const router = express.Router();

router.post("/addartikel", artikelController.add);
//router.post("/upload", upload.single("image"), uploadController.uploadFiles);
router.post("/upload", upload.single("image"),
    (req, res) => {
        if (req.file === "undefined" || req.file == null){
            return res.status(422).send("image cannot be empty, please choose");
        }
        let file = req.file;
        return res.status(200).send({name: file.filename});
    });
//router.post("/upload", upload.single("image"), uploadController.uploadFiles);
//router.post("/searchartikel", artikelController.search);

module.exports = router;
