const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const menuController=require('../app/http/controllers/menuController')
const nodemailer = require('nodemailer')
// Middlewares 
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')
const user = require('../app/models/user')
const Menu = require('../app/models/menu')

function initRoutes(app) {
    app.get('/', homeController().index)
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)
    app.get('/menu',menuController().index)
    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)
    app.get('/items',menuController().vegies)
    // Customer routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)
    app.get('/customer/orders/:id', auth, orderController().show)
    app.post('/set-location',(req,res)=>{
        req.session.cord=req.body
        res.json({
            status: 'Success',
            lat: req.body.lat,
            lon: req.body.lon
        })
    })
    // Admin routes
    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)
    app.get('/sell',admin,(req,res)=>{
        res.render('admin/sellform')
    })
    app.post('/sell',(req,res)=>{
        console.log(req)
        const menu=new Menu({
            name: req.body.itemname,
            category: req.body.category,
            cord: {lat: req.session.cord.lat,
                    lon: req.session.cord.lon },
            price: req.body.price,
            quantity: req.body.quantity
        }).save().then(res.render('admin/sellform'))
    })
    app.get('/offlinecustomer',(req,res)=>{
        res.render('customers/offlinecustomer')
    }
    )
    app.post('/offlinecustomer',(req,res)=>{
        res.redirect('/')
    }
    )
    app.post('/mailservice',(req,res)=>{
        console.log(req)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'livemart.oop@gmail.com',
              pass: 'sudarshan@1234'
            }
          });
          
          const mailOptions = {
            from: 'livemart.oop@gmail.com',
            to: `${req.body.shops}@gmail.com`,
            subject: 'A Slot Booked',
            text: `${req.user.name} booked a visiting slot of ${req.body.visittime}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              console.log(req)
            }
          });
          res.redirect('/')
    })
    // Admin routes
    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)
}

module.exports = initRoutes


