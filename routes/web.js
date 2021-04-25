const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const wholesalerOrderController = require('../app/http/controllers/wholesaler/orderController')
const wstatusController = require('../app/http/controllers/wholesaler/statusController')
const menuController=require('../app/http/controllers/menuController')
const nodemailer = require('nodemailer')
// Middlewares 
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')
const wholesaler = require('../app/http/middlewares/wholesaler')
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
    app.post('/shops',menuController().vegies1)
    app.get('/update',menuController().update)
    app.get('/feedback',(req,res)=>{
      res.render('feedback');
    }
      )
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
    app.get('/offers',(req,res)=>{
      res.render('scratchcard')
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
            lat: req.session.cord.lat,
            lon: req.session.cord.lon,
            price: req.body.price,
            quantity: req.body.quantity,
            seller: req.user.email,
            type: req.user.role,
            image: req.body.image
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
    app.get('/buy',admin,(req,res)=>{
      res.render('admin/sellform')
  })
    app.get('/updateform',(req,res)=>{
      res.render('updateform',{item:req.data})
    })
    app.post('/updateform',async (req,res)=>{
      console.log(req.body)
       await Menu.findOneAndUpdate(
          { _id : req.body.id },
          { $set: { quantity : req.body.quantity ,price: req.body.price}},
         {upsert: true}
        );
        res.redirect('/update')
    })
    app.post('/delete',async (req,res)=>{
      console.log(req.body)
       await Menu.deleteOne(
          { _id : req.body.id }
        );
        res.redirect('/update')
    })
    //wholsealer routes
    app.get('/wholesaler/orders', wholesaler, wholesalerOrderController().index)
    app.post('/wholesaler/order/status', wholesaler, wstatusController().update)
    app.get('/wsell',wholesaler,(req,res)=>{
      res.render('wholesaler/wsellform')
  })
  app.post('/wsell',(req,res)=>{
      console.log(req)
      const menu=new Menu({
        name: req.body.itemname,
        category: req.body.category,
        lat: req.session.cord.lat,
        lon: req.session.cord.lon,
        price: req.body.price,
        quantity: req.body.quantity,
        seller: req.user.email,
        type: req.user.role,
        image: req.body.image
      }).save().then(res.render('wholesaler/wsellform'))
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
   //wholsealer routes
   app.get('/wholesaler/orders', wholesaler, wholesalerOrderController().index)
   app.post('/wholesaler/order/status', wholesaler, wstatusController().update)
}

module.exports = initRoutes