const { json } = require("express")

function cartController() {
    return {
        index(req, res) {
            console.log(req.query)
            res.render('customers/cart',{discount: req.query.discount})
        },
        update(req, res) {
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }
            // for the first time creating cart and adding basic object structure
            console.log(req.body)
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0,
                    seller:req.body.seller
                }
            }
            let cart = req.session.cart

            // Check if item does not exist in cart 
            if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            } else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice =  cart.totalPrice + req.body.price
            }
            return res.json({ totalQty: req.session.cart.totalQty, cart: req.session.cart })
        }
    }
}

module.exports = cartController