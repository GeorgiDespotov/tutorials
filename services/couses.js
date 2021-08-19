const { options } = require('../controllers/courseController');
const Course = require('../modews/Course');
const User = require('../modews/User');

async function getAllCourses(query) {
    const options = {};

    if (query.search) {
        options.title = { $regex: query.search, $options: 'i' };
        const courses = Course.find(options).lean();

        return courses
    }


    return Course.find().lean();
}

async function createCourse(courseData) {
    const pattern = new RegExp(`^${courseData.title}$`, 'i');
    const existing = await Course.findOne({ title: { $regex: pattern } });

    if (existing) {
        throw new Error('Course with this title already exists!');
    }

    const course = new Course(courseData);

    await course.save();

    return course;
}

async function getOneCourse(id) {
    const course = await Course.findById(id).lean();

    return course;
}

async function joinCourse(userId, courseId) {
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    course.users.push(userId);
    user.courses.push(courseId);

    await user.save()
    await course.save();

    return course;
}

async function editCourse(courseId, courseData) {
    const course = await Course.findById(courseId);

    course.title = courseData.title;
    course.description = courseData.description;
    course.imageUrl = courseData.imageUrl;
    course.duration = courseData.duration;

    await course.save();

    return course;
}

async function deleteCourse(id) {
    return Course.findByIdAndDelete(id);
}

module.exports = {
    getAllCourses,
    createCourse,
    getOneCourse,
    joinCourse,
    editCourse,
    deleteCourse
}