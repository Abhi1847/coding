const mongoose = require('mongoose')

const conversationschema = new mongoose.Schema({
    members:{
        type:Array,
        require:true
    }
})

module.exports = mongoose.model('Conversation',conversationschema)