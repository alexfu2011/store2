"use strict";

const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "-" + file.originalname);
    }
});
const fileFilter = (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const extensions = [".png", ".jpg", ".jpeg"];
    if (!extensions.includes(ext)) {
        return callback(new Error(`"${ext}" 扩展名不支持`));
    }
    callback(null, true);
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
