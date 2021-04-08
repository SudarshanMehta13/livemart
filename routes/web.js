const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const menuController=require('../app/http/controllers/menuController')
// Middlewares 
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')
const { session } = require('passport')

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
    app.get('/menu/veggies',menuController().vegies)
    // Customer routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)
    app.get('/customer/orders/:id', auth, orderController().show)
    app.post('/set-location',(req,res)=>{
        try{
        req.session.cord=JSON.parse(req.body);
        return new Promise((resolve,reject)=>console.log(req.session.cord))
        }catch(e){
        req.session.cord=req.body;
        }
        console.log(res)
    })
    // Admin routes
    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)
}

module.exports = initRoutes

