const express = require("express"),
    router = express.Router(),
    FileController = require('../controllers/files.controller'),
    FilesService = require('../services/files.service'),
    ash = require('express-async-handler');

router.use(ash(async (req, res, next) => {
    console.log(req.user)
    if(req.user) {
        let data = await FilesService.getFiles();

        if (data) {
            req.files = data;
            next();
        } else
            return res.status(500).send({message: 'Error while getting users'});
    }
    else
        return res.status(401).json({message: 'Not authorized'});
}));

router.route('/')
    .get(FileController.getFiles)
    .post(FileController.createFile)
    .put(FileController.updateFile)
    .delete(FileController.deleteFile);

module.exports = router;