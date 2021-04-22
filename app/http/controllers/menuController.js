const { request } = require('express')
const Menu= require('../../models/menu')
function menuController(){
    return{
        async index(req,res){
            const products=await Menu.find()
            return res.render('customers/menu',{pizzas: products})
        },
        async vegies(req,res){
                
                var data=await Menu.find({category: req.query.category ,type:req.user.role=="customer"?"admin":"wholesaler"}
                    ,{  name:1,
                        price:1,
                        image:1,
                        lat:1,
                        lon:1,
                        dis:1,
                        seller:1
                });
                for (var i in data) {
                    data[i].dis=data[i].lat-data[i].lon;
                    console.log( data[i].dis)
                  }
                  data.sort((a, b) => (a.dis > b.dis) ? 1 : -1)
                //console.log(data)

                return res.render('customers/vegies',{items:data})
        },
        async vegies1(req,res){
            console.log(req.body);
            var data=await Menu.find({name: req.body.name,type:req.user.role=="customer"?"admin":"wholesaler"} );
            for (var i in data) {
                data[i].dis=data[i].lat-data[i].lon;
                //console.log( data[i].dis)
              }
              data.sort((a, b) => (a.dis > b.dis) ? 1 : -1)
            console.log(data)
            return res.render('customers/vegies',{items:data})
    }
    }
}
module.exports = menuController