const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String},
    price: { type: Number},
    category: { type: String, required: true },
    lat:{ type:String},
    lon:{type:String},
    quantity:{type: Number,required:true},
    price: { type: Number, required: true },
    size: { type: String}
})

module.exports = mongoose.model('Menu', menuSchema)