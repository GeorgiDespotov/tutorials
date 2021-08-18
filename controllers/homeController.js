const router = require('express').Router();
const userServices = require('../services/user');

router.get('/', async (req, res) => {
    const courses = await req.storage.getAllCourses();
    if (req.user) {
        const user = await userServices.getUseById(req.user._id);

        res.render('home/userHome', { courses, user });
    } else {
        res.render('home/userHome', { courses });
    }

});

module.exports = router;