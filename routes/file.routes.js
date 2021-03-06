const express = require("express"),
    router = express.Router(),
    FileController = require('../controllers/files.controller'),
    FilesService = require('../services/files.service'),
    ash = require('express-async-handler');

router.use(ash(async (req, res, next) => {
    console.log(req.user)
    if(req.user) {
        if (req.directories) {
            const folder = `assets/files/folder_${req.user.id}_user_${req.user.login}`;
            for (let fol of req.directories) {
                const files = await FilesService.getFiles(`${folder}/${fol.path}`);
                fol.files = [...files.map(x => {
                    const nameArr = x.split('_');
                    nameArr.splice(0, 1);
                    const arr = nameArr.join('_').split('.');
                    if (arr[arr.length - 1] === 'txt') arr.length = arr.length - 1;
                    return {
                        path: x,
                        id: x.split('_')[0],
                        filename: arr.join('.'),
                        content: ''
                    }
                })];
            }

            next();
        }
        else return res.status(500).send({message: 'Error while getting directories'});
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