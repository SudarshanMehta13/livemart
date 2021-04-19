const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name: { type: String, required: true },
<<<<<<< HEAD
    image: { type: String},
    price: { type: Number},
    category: { type: String, required: true },
    lat:{ type:String},
    lon:{type:String},
    quantity:{type: Number,required:true}
=======
    image: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true }
>>>>>>> 4e47fc42af0064ec70f9afcc9192cdb861526f6b
})

module.exports = mongoose.model('Menu', menuSchema)