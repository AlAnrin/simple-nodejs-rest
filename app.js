const express = require('express'),
    cors = require('cors'),
    app = express(),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    crypto = require('crypto'),
    users = require('./assets/files/users');

const host = '127.0.0.1';
const port = 7000;

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

const tokenKey = '1a2b-3c4d-5e6f-7g8h';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.options('*', cors(corsOptions))

app.use((req, res, next) => {
    if(req.headers.authorization){
        let tokenParts = req.headers.authorization.split('.');
        let signature = crypto.createHmac('SHA256', tokenKey).update(`${tokenParts[0]}.${tokenParts[1]}`).digest('base64');

        if(signature === tokenParts[2])
            req.user = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'));
    }

    res.set('Access-Control-Allow-Origin', '*')

    next();
});

app.post('/api/auth', (req, res) => {
    for(let user of users){
        if(req.query.login === user.login && req.query.password === user.password){
            let head = Buffer.from(JSON.stringify({alg: 'HS256', typ: 'jwt'})).toString('base64');
            let body = Buffer.from(JSON.stringify(user)).toString('base64');
            let signature = crypto.createHmac('SHA256', tokenKey).update(`${head}.${body}`).digest('base64');

            return res.status(200).json({
                id: user.id,
                login: user.login,
                fio: user.fio,
                token: `${head}.${body}.${signature}`
            });
        }
    }

    return res.status(404).json({message: 'User not found'});
});

app.use('/api', routes);

const server = app.listen(port, host, () => console.log(`Server listens http://${host}:${port}`));

server.keepAliveTimeout = 30000;