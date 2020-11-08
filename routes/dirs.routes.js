const express = require("express"),
    router = express.Router(),
    ash = require('express-async-handler'),
    fileRoutes = require("./file.routes")
    DirsController = require('../controllers/dirs.controller');
const fs = require('fs');

function getDirectories(path) {
    try{
        const exists = fs.existsSync(path);
        console.log('Exists: ', exists);
        return fs.readdirSync(path).filter(function (file) {
            console.log(file)
            return fs.statSync(path+'/'+file).isDirectory();
        });
    }
    catch(e){
        try{
            fs.mkdirSync(path, {recursive: true});
            console.log('Done');
            return fs.readdirSync(path).filter(function (file) {
                return fs.statSync(path+'/'+file).isDirectory();
            });
        }catch(e){
            console.log(e);
        }
    }
}

router.use(ash(async (req, res, next) => {
    console.log(req.user)
    if(req.user) {
        const folder = `assets/files/folder_${req.user.id}_user_${req.user.login}`;
        let folders = getDirectories(folder);
        folders = folders.map(fol => {
            return {
                full: folder,
                path: fol,
                id: fol.split('_')[0],
                name_part: fol.split('_')[1],
                files: []
            }
        });

        if (folders) {
            req.directories = folders;
            next();
        } else
            return res.status(500).send({message: 'Error while getting directories'});
    }
    else
        return res.status(401).json({message: 'Not authorized'});
}));

router.route('/')
    .get(DirsController.getDirs)
    .post(DirsController.createDir)
    .put(DirsController.updateDir)
    .delete(DirsController.deleteDir);

router.use('/files', fileRoutes);

module.exports = router;