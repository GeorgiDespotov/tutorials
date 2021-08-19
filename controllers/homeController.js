const router = require('express').Router();
const userServices = require('../services/user');

router.get('/', async (req, res) => {
    const courses = await req.storage.getAllCourses(req.query);
    if (req.user) {
        const user = await userServices.getUseById(req.user._id);
        const ctx = {
            title: 'tutorials',
            courses,
            search: req.query.search || ''
        } 
        res.render('home/userHome', { courses, user, ctx });
    } else {
        res.render('home/userHome', { courses });
    }
});

module.exports = router;