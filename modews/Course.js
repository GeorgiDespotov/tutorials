const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    duration: { type: String },
    createdAt: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    users: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }]
});

module.exports = model('Course', schema);