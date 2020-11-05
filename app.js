const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    crypto = require('crypto'),
    users = require('./assets/files/users');

const host = '127.0.0.1';
const port = 7000;

const tokenKey = '1a2b-3c4d-5e6f-7g8h';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    if(req.headers.authorization){
        let tokenParts = req.headers.authorization.split('.');
        let signature = crypto.createHmac('SHA256', tokenKey).update(`${tokenParts[0]}.${tokenParts[1]}`).digest('base64');

        if(signature === tokenParts[2])
            req.user = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'));

        next();
    }

    next();
});

app.post('/api/auth', (req, res) => {
    for(let user of users){
        if(req.body.login === user.login && req.body.password === user.password){
            let head = Buffer.from(JSON.stringify({alg: 'HS256', typ: 'jwt'})).toString('base64');
            let body = Buffer.from(JSON.stringify(user)).toString('base64');
            let signature = crypto.createHmac('SHA256', tokenKey).update(`${head}.${body}`).digest('base64');

            return res.status(200).json({
                id: user.id,
                login: user.login,
                token: `${head}.${body}.${signature}`
            });
        }
    }

    return res.status(404).json({message: 'User not found'});
});

app.use('/api', routes);

app.listen(port, host, () => console.log(`Server listens http://${host}:${port}`));



//
// const express = require('express');
// const cors = require('cors')
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const app = express();
// app.use(bodyParser.json());
// const router = express.Router();
// const EventEmitter = require('events');
// const emitter = new EventEmitter();
//
// const corsOptions = {
//     origin: '*',
//     optionsSuccessStatus: 200
// };
//
// emitter.on('message', message => console.log('Message: ', message));
// emitter.on('error', error => console.log('Error: ', error));
//
// app.use('/api', router);
//
// const host = '127.0.0.1';
// const port = 7000;
//
// console.log('Processor architecture: ', process.arch); // arm | ia32 | x62
// console.log('Platform: ', process.platform);
//
// app.use('/photos', express.static(`${__dirname}/assets`));
// app.use('/files', express.static(`${__dirname}/assets/files`));
//
// app.get('/', (req, res) => {
//     return res.set('Access-Control-Allow-Origin', '*').redirect(301, '/home');
// });
//
// process.on('uncaughtException', (err, origin) => {
//     console.log('Error: ', err);
//     console.log('Origin: ', origin);
// });
//
// app.get('/home', cors(corsOptions), (req, res) => {
//     try{
//         const content = fs.readFileSync('assets/files/data.json', 'utf8');
//         // console.log(content);
//         res.status(200).type('application/json').send(content);
//     }
//     catch(e){
//         res.status(404).type('application/json');
//         emitter.emit('error', e)
//     }
// });
//
// function isExist(fileName) {
//     try{
//         const exists = fs.existsSync(`assets/files/${fileName}`);
//         console.log('Exists: ', exists);
//     }catch(e){
//         console.log(e);
//     }
// }
//
// app.options('*', cors(corsOptions))
// app.post('/rewrite', cors(corsOptions), (req, res) => {
//     try{
//         const data = req.body;
//         console.log(data);
//         fs.writeFileSync('assets/files/writeData.txt', JSON.stringify(data), 'utf8');
//         console.log('Done');
//         res.status(200).type('application/json');
//         res.send(JSON.stringify(data));
//     }catch(e){
//         console.log(e);
//     }
// });
//
// // fs.mkdir('files/dir/subdir', {recursive: true}, err => {
// //     if(err)
// //         throw err;
// //
// //     console.log('Created');
// // });
//
// app.put('/write', (req, res) => {
//     try{
//         const data = req.body;
//         console.log(data);
//         fs.appendFileSync('assets/files/writeData.txt', JSON.stringify(data), 'utf8');
//         console.log('Done');
//         res.status(200).set('Access-Control-Allow-Origin', '*').type('application/json');
//         res.send(JSON.stringify(data));
//     }catch(e){
//         console.log(e);
//     }
// });
//
// app.post('/user', (req, res) => {
//     res.status(200).type('text/plain');
//     res.send('Create user request');
// });
//
// app.use((req, res, next) => {
//     res.status(404).type('text/plain');
//     res.send('Not found');
// });
//
// app.listen(port, host, function () {
//     console.log(`Server listens http://${host}:${port}`);
// });