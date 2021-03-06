const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number},
    category: { type: String, required: true },
    lat:{ type:String},
    lon:{type:String},
    quantity:{type: Number,required:true},
    price: { type: Number, required: true },
    dis: { type: Number},
    size: { type: String},
    seller: {type: String,required: true },
    type: {type: String,required: true }
})

module.exports = mongoose.model('Menu', menuSchema)