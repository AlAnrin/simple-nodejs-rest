const express = require("express"),
    router = express.Router(),
    FileController = require('../controllers/files.controller'),
    FilesService = require('../services/files.service'),
    ash = require('express-async-handler');

router.use(ash(async (req, res, next) => {
    console.log(req.user)
    if(req.user) {
        let data = [];
        const folder = `assets/files/folder_${req.user.id}_user_${req.user.login}`;
        let folders = await FilesService.getDirectories(folder);
        for (let fol of folders) {
            const files = await FilesService.getFiles(`${folder}/${fol}`);
            const res = {
                id: fol.split('_')[0],
                name_part: fol.split('_')[1],
                files: [...files.map(x => {
                    return {
                        id: x.split('_')[0],
                        filename: x.split('_')[1]
                    }
                })]
            }
            data.push(res);
        }
        // let data = await FilesService.getFiles();

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