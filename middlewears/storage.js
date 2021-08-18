const courseServices = require('../services/couses');

module.exports = () => (req, res, next) => {
    req.storage = {
        ...courseServices
    };
    next();
};