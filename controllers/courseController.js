const router = require('express').Router();
const { isUser } = require('../middlewears/guards');
const { body, validationResult } = require('express-validator');

router.get('/create', isUser(), (req, res) => {
    res.render('course/create');
});

router.post('/create', isUser(),
    body('title')
        .notEmpty().withMessage('Title is required!').bail()
        .isLength({ min: 4 }).withMessage('The title should be at least 4 characters!').bail(),
    body('description')
        .notEmpty().withMessage('Description is required!').bail()
        .isLength({ min: 10 }).withMessage('The description should be at least 20 characters long!').bail(),
    body('imageUrl')
        .notEmpty().withMessage('Image URL is required!').bail()
        .matches('^https?').withMessage('The URL must be valid one!').bail(),
    body('duration')
        .notEmpty().withMessage('Duration is required!').bail(),

    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            req.body.author = req.user._id;

            if (errors.length > 0) {
                throw new Error(errors.map(err => err.msg).join('\n'));
            }

            await req.storage.createCourse(req.body);
            res.redirect('/');
        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: err.message.split('\n'),
                course: {
                    title: req.body.title,
                    description: req.body.description,
                    iamgeUrl: req.body.iamgeUrl,
                    duration: req.body.duration
                }
            }
            res.render('course/create', ctx);
        }
    });

    router.get('/details/:id', async (req, res) => {
        try {
            const course = await req.storage.getOneCourse(req.params.id);

            if (req.user) {
                course.isAuthor = req.user._id == course.author;
                course.hasJoined = course.users.find(u => u._id == req.user._id);
                course.haveLogedUser = req.user._id;
            }

            res.render('course/details', { course });
        } catch (err) {
            console.log(err.message);
            res.redirect('/404');
        }
    });

    router.get('/join/:id', isUser(), async (req, res) => {
        try {
            const course = await req.storage.getOneCourse(req.params.id);

            const alreadyJoined = course.users.find(u => u._id == req.user._id);

            if (alreadyJoined) {
                throw new Error('You have already joined this course!');
            }
            await req.storage.joinCourse(req.user._id, req.params.id);
            res.redirect(`/course/details/${req.params.id}`);
        } catch (err) {
            console.log(err.message);
            res.redirect('/404');
        }
    });

module.exports = router;