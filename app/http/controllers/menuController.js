const Menu= require('../../models/menu')
function menuController(){
    return{
        async index(req,res){
            const products=await Menu.find()
            return res.render('customers/menu',{pizzas: products})
        },
        async vegies(req,res){
            const data=await Menu.find({category: vegetables});
            return res.render('customers/menu',{vegetable:data})
        }
    }
}
module.exports = menuController