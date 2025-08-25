const jwt = require('jsonwebtoken');
const config = require('config')

function auth(req, res, next) {
    try {
        console.log('token: ', req.cookies)
        let token = req.cookies['x-auth-token'];

        if (!token) {
            res.status(401).send('Access denied. No token provided.')
        }
        else {
            try {
                const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
                console.log(decoded);
                req.user = decoded;
                next();
            }
            catch (err) {
                res.status(400).send('Invalid token.');
            }
        }
    } catch (error) {
        res.status(401).send('Access denied. No token provided.')
    }


}

module.exports = auth;