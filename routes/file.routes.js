const express = require("express"),
    router = express.Router(),
    FileController = require('../controllers/files.controller'),
    FilesService = require('../services/files.service');

router.use(async (req, res, next) => {
    console.log(req.headers.user)
    if(req.headers.user) {
        let data = await FilesService.getFiles();

        if (data) {
            req.users = data;
            next();
        } else
            return res.status(500).send({message: 'Error while getting users'});
    }
    else
        return res.status(401).json({message: 'Not authorized'});
});

router.route('/')
    .get(FileController.getFiles)
    .post(FileController.createFile)
    .put(FileController.updateFile)
    .delete(FileController.deleteFile);

module.exports = router;