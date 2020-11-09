const fs = require('fs');

class FilesService{
    getFiles(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file).isFile();
        });
    }

    readFile(path) {
        try {
            const content = fs.readFileSync(path, 'utf8');
            console.log(content);
            return content;
        } catch (e) {
            return false;
        }
    }

    createFile(dir, new_id){
        return new Promise((res, rej) => {
            fs.writeFile(`${dir.full}/${dir.path}/${new_id}_new_file.txt`, new Uint8Array(0),
                (err, response) => {
                if(err)
                    return res(false);

                return res({message: 'File created.'});
            });
        });
    }

    updateFile(dir, file, content) {
        return new Promise((res, rej) => {
            fs.writeFile(`${dir.full}/${dir.path}/${file.path}`, content, 'utf8', err => {
                if (err)
                    return res(false);

                return res({message: 'File rewrite.'});
            });
        });
    }

    renameFile(dir, file, name){
        return new Promise((res, rej) => {
                fs.rename(`${dir.full}/${dir.path}/${file.path}`,
                    `${dir.full}/${dir.path}/${file.id}_${name}.txt`, (err, response) => {
                    if(err)
                        return res(false);

                    return res({message: 'File renamed.'});
                });
        });
    }

    deleteFile(dir, file){
        return new Promise((res, rej) => {
            fs.unlink(`${dir.full}/${dir.path}/${file.path}`, err => {
                if (err)
                    return res(false);

                return res({message: 'File deleted.'});
            })
        });
    }
}

module.exports = new FilesService();