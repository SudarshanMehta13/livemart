const Order = require('../../../models/order')
const Menu = require('../../../models/menu')
const moment = require('moment')
const { query } = require('express')
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
function orderController () {
    return {
        store(req, res) {
            // Validate request
            console.log(req);
            const { phone, address, stripeToken, paymentType } = req.body
            if(!phone || !address) {
                return res.status(422).json({ message : 'All fields are required' });
            }
            console.log(req.body)
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address,
                seller: req.session.cart.seller
            })
            let pp=req.session.cart.items;
            async  function changeValue(value) {
                console.log(value);
                return await Menu.findOneAndUpdate(
                       { _id : value.item._id },
                         { $inc: { quantity : -value.qty }},
                        {upsert: true}
                );
            };
            async function fun() {
                for (var [key, value] of Object.entries(pp)){
                    console.log(value);
                   let v=await changeValue(value);
                 }
              }
            let a=fun();
             
            
               
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    // req.flash('success', 'Order placed successfully')

                    // Stripe payment
                    if(paymentType === 'card') {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice  * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `Pizza order: ${placedOrder._id}`
                        }).then(() => {
                            placedOrder.paymentStatus = true
                            placedOrder.paymentType = paymentType
                            placedOrder.save().then((ord) => {
                                // Emit
                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', ord)
                                delete req.session.cart
                                return res.json({ message : 'Payment successful, Order placed successfully' });
                            }).catch((err) => {
                                console.log(err)
                            })

                        }).catch((err) => {
                            delete req.session.cart
                            return res.json({ message : 'OrderPlaced but payment failed, You can pay at delivery time' });
                        })
                    } else {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                              user: 'livemart.oop@gmail.com',
                              pass: 'sudarshan@1234'
                            }
                          });
                          
                          const mailOptions = {
                            from: 'livemart.oop@gmail.com',
                            to: req.user.email,
                            subject: 'Order Confirmed',
                            text: `Dear ${req.user.name}, your order will be delivered in 2 days by Mr. Mehta.  `
                          };
                          
                          transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              console.log(error);
                            } else {
                              console.log('Email sent: ' + info.response);
                            }
                          });
                        delete req.session.cart
                        return res.json({ message : 'Order placed succesfully' });
                    }
                })
            }).catch(err => {
                return res.status(500).json({ message : 'Something went wrong' });
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } } )
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return  res.redirect('/')
        }
    }
}

module.exports = orderController