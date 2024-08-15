const config = require('../config/config');
const jwt = require('jsonwebtoken');
const oldSecretjwt = config.secret_jwt;

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];
    console.log(token);

    if (!token) {
        return res.status(401).send("Unauthorized access. A token is required for authentication");
    } else {
        try {
            let decoded;
            try {
                // First, try to verify with the current secret
                decoded = jwt.verify(token, config.secret_jwt);
            } catch (error) {
                // If it fails, try with the old secret
                decoded = jwt.verify(token, oldSecretjwt);
            }
            req.user = decoded;
        } catch (error) {
            return res.status(403).send("Invalid token");
        }
        return next();
    }
};

module.exports = verifyToken;
