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

    createFile(data){
        return new Promise((res, rej) => {
            fs.writeFile('assets/files/data.json', JSON.stringify(data), (err, response) => {
                if(err)
                    return res(false);

                return res({message: 'File created.'});
            });
        });
    }

    updateFile(data){
        return new Promise((res, rej) => {
            fs.writeFile('assets/files/data.json', JSON.stringify(data), (err, response) => {
                if(err)
                    return res(false);

                return res({message: 'User updated.'});
            });
        });
    }

    deleteFile(data){
        return new Promise((res, rej) => {
            fs.writeFile('assets/files/data.json', JSON.stringify(data), (err, response) => {
                if(err)
                    return res(false);

                return res({message: 'File deleted.'});
            });
        });
    }
}

module.exports = new FilesService();