const order = require("../../../models/order")

const Order = require('../../../models/order')

function orderController() {
    return {
        index(req, res) {
            console.log(req);
           order.find({ status: { $ne: 'completed' }, seller : req.user.email },null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
               if(req.xhr) {
                   return res.json(orders)
               } else {
                return res.render('wholesaler/orders')
               }
           })
        }
    }
}

module.exports = orderController