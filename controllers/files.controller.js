const FilesService = require('../services/files.service');

class FilesController {
    getFiles(req, res){
        if(req.query.dir_id) {
            const dir = req.directories.find(x => x.id === req.query.dir_id);
            if (req.query.id) {
                const file = dir.files.find(x => x.id === req.query.id);
                if (file) {
                    const content = FilesService.readFile(`${dir.full}/${dir.path}/${file.path}`);
                    return res.status(200).send({content: content});
                } else
                    return res.status(404).send({message: 'File not found.'});
            } else {
                if (!dir)
                    return res.status(404).send({message: 'Directory not found.'});

                return res.status(200).send({data: dir.files});
            }
        }
        return res.status(404).send({message: 'Directory not found.'});
    }

    async createFile(req, res){
        if(req.query.dir){
            const dir = req.directories.find(x => x.id === req.query.dir);
            if(!dir)
                return res.status(404).send({message: 'Error while find directory'});

            const new_id = dir.files.length !== 0 ? +dir.files[dir.files.length - 1].id + 1: 0;
            let result = await FilesService.createFile(dir, new_id);

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
        if(req.query.dir) {
            const dir = req.directories.find(x => x.id === req.query.dir);
            if(!dir)
                return res.status(404).send({message: 'Error while find directory'});

            if (req.query.id) {
                const file = dir.files.find(x => x.id === req.query.id);
                if (file) {
                    let result = await FilesService.deleteFile(dir, file);

                    if (result)
                        return res.status(200).send(result);
                    else
                        return res.status(500).send({message: 'Unable delete file.'});
                } else
                    return res.status(404).send({message: 'file not found.'});
            }
        }
        return res.status(400).send({message: 'Bad request.'});
    }
}

module.exports = new FilesController();