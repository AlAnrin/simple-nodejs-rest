const FilesService = require('../services/files.service');

class FilesController {
    getFiles(req, res){
        if(req.query.id){
            if(req.files.hasOwnProperty(req.query.id))
                return res.status(200).send({data: req.files[req.query.id]});
            else
                return res.status(404).send({message: 'File not found.'});
        }else if(!req.files)
            return res.status(404).send({message: 'Files not found.'});

        return res.status(200).send({data: req.files});
    }

    async createFile(req, res){
        if(req.body.file && req.body.file.id){
            if(req.files.hasOwnProperty(req.body.file.id))
                return res.status(409).send({message: 'File already exists.'});

            req.files[req.body.file.id] = req.body.file;

            let result = await FilesService.createFile(req.files);

            if(result)
                return res.status(200).send(result);
            else
                return res.status(500).send({message: 'Unable create file.'});
        }else
            return res.status(400).send({message: 'Bad request.'});
    }

    async updateFile(req, res){
        if(req.body.file && req.body.file.id){
            if(!req.files.hasOwnProperty(req.body.file.id))
                return res.status(404).send({message: 'file not found.'});

            req.files[req.body.file.id] = req.body.file;

            let result = await FilesService.updateFile(req.files);

            if(result)
                return res.status(200).send(result);
            else
                return res.status(500).send({message: 'Unable update file.'});
        }else
            return res.status(400).send({message: 'Bad request.'});
    }

    async deleteFile(req, res){
        if(req.query.id){
            if(req.files.hasOwnProperty(req.query.id)){
                delete req.files[req.query.id];

                let result = await FilesService.deleteFile(req.file);

                if(result)
                    return res.status(200).send(result);
                else
                    return res.status(500).send({message: 'Unable delete file.'});
            } else
                return res.status(404).send({message: 'file not found.'});
        }else
            return res.status(400).send({message: 'Bad request.'});
    }
}

module.exports = new FilesController();