const fs = require('fs');

class DirsController {
    getDirs(req, res) {
        if (req.directories) {
            return res.status(200).json({data: req.directories})
        } else
            return res.status(401).json({message: 'Not authorized'});
    }

    updateDir(req, res) {
        if (req.user && req.directories) {
            if (req.query.dir) {
                const dir = req.directories.find(x => x.id === req.query.dir);
                if (req.body.name) {
                    try {
                        fs.renameSync(`${dir.full}/${dir.path}`,
                            `${dir.full}/${dir.id}_${req.body.name}`)
                        return res.status(200).send({message: 'Directory renamed.'});
                    } catch (err) {
                        return res.status(500).send({message: 'Directory not renamed.'});
                    }
                }
            }
        } else
            return res.status(401).json({message: 'Not authorized'});
    }

    createDir(req, res) {
        if (req.user && req.directories) {
            const new_id = req.directories.length !== 0 ? +req.directories[req.directories.length - 1].id + 1 : 0;
            const folder = `assets/files/folder_${req.user.id}_user_${req.user.login}/${new_id}_new_part`;
            try {
                fs.mkdirSync(folder, {recursive: true});
                return res.status(200).json({data: req.directories})
            } catch (e) {
                return res.status(500).json({message: 'Unable create directory.'})
            }
        } else
            return res.status(401).json({message: 'Not authorized'});
    }

    deleteDir(req, res) {
        if (req.query.dir) {
            const dir = req.directories.find(x => x.id === req.query.dir);
            if (!dir)
                return res.status(404).send({message: 'Error while find directory'});

            try {
                const path =`${dir.full}/${dir.path}`;
                const ver = process.version.split('.')[0].split('');
                ver.splice(0, 1);
                const verStr = ver.join('')
                if (+verStr < 12) {
                    if (fs.existsSync(path)) {
                        fs.readdirSync(path).forEach((file, index) => {
                            fs.unlinkSync(`${path}/${file}`);
                        });
                        fs.rmdirSync(path);
                    }
                }
                else fs.rmdirSync(path, { recursive: true });
                return res.status(200).send({message: 'Directory deleted.'});
            } catch (e) {
                return res.status(404).send({message: 'directory not found.'});
            }
        }
        return res.status(400).send({message: 'Bad request.'});
    }
}

module.exports = new DirsController();