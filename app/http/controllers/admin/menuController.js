const { update } = require('../../../models/menu');
const Menu= require('../../models/menu')
function menuController(){
    return{
        async index(req,res){
            const products=await Menu.find()
            return res.render('customers/menu',{pizzas: products})
        },
        async vegies(req,res){
            const data=await Menu.find({category: req.query.category});
            return res.render('customers/vegies',{items:data})
        }
    }
}
module.exports = menuController