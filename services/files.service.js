const fs = require('fs');

class FilesService{
    getDirectories(path) {
        try{
            const exists = fs.existsSync(path);
            console.log('Exists: ', exists);
            return fs.readdirSync(path).filter(function (file) {
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

    getFiles(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file).isFile();
        });
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