const fs = require('fs');

class FilesService{
    getFiles(){
        return new Promise((res, rej) => {
            fs.readFile('assets/files/data.json', (err, data) => {
                if(err) {
                    return res(false);
                }
                return res(JSON.parse(data));
            });
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