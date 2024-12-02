
const mongoose = require('mongoose')

const PostSchem = mongoose.Schema({
    title: {
        type:String, required: true,
    },

    description: {
        type:String, required: true,
    },

    author: {
        type:String, required: true,
    }
})

const PostModel = mongoose.model('post', PostSchem)
module.exports = PostModel