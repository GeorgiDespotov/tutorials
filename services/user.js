const User = require('../modews/User');


async function createUser(username, hashedPassword) {
    const user = new User({
        username,
        hashedPassword
    });

    user.save();
    return user;
}

async function getUserByUsername(username) {
    const pattern = new RegExp(`^${username}$`, 'i');
    const user = await User.findOne({username: {$regex: pattern}});
    return user;
} 

async function getUseById(id) {
    const user = await User.findById(id).lean();

    return user;
}
 
module.exports = {
    createUser,
    getUserByUsername,
    getUseById
}