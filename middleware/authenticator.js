
const fs = require('fs')
const jwt = require('jsonwebtoken')

const authenticator = (req, res, next) => {

    const token = req.headers.authorization;

    try {
        const blacklist = JSON.parse(fs.readFileSync('./blacklist.json', 'utf-8'))

        if (blacklist.includes(token)) {
            return res.send({ msg: 'user login again you have logout..' })
        }
        if (token) {
            const decoded = jwt.verify(token, 'normal');

            if (decoded) {
                let userrole = decoded.role;
                req.body.userrole = userrole;
                console.log(userrole);
                next();
            } else {
                res.send({ msg: 'error in authentication middleware after token.....', })
            }
        }
    } catch (error) {
        res.send({ msg: 'error in authentication..' })
        console.log(error, 'errror in authecticator middleware..');
    }

} 

module.exports = {
    authenticator
}