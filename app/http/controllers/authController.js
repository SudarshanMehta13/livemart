const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const nodemailer = require('nodemailer');
const app=require('express')()
const bodyParser=require('body-parser')
const nunjucks = require('nunjucks')
const Nexmo = require('nexmo')
const Vonage = require('@vonage/server-sdk');

function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    
    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res, next) {
            const { email, password }   = req.body
           // Validate request 
            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }

  

            app.use(bodyParser.json())
            app.use(bodyParser.urlencoded({extended:false}))
            nunjucks.configure('views',{express:app})

            const nexmo=new Nexmo({
                apiKey: '6f31b0fe',
                apiSecret: 'YguhK1iOxUFD1XAT'
            })

            app.get('/',(req,res)=>{
                res.render('index.html',{message:'Hello'})
            })

            app.post('/verify', (req, res) => {
                nexmo.verify.request({
                number: req.body.number,
                brand: 'ACME Corp'
                }, (err, result) => {
                if(result.status!=0) {
                    return res.redirect('/login')
                } else {
                    const verifyRequestID=result.request_id
                    res.render('check.html', { requestId: verifyRequestID })
                }
                })
            })

            app.post('/check', (req, res) => {
                nexmo.verify.check({
                request_id: req.body.requestId,
                code: req.body.code
                }, (error, result) => {
                if(result.status != 0) {
                    return res.redirect('/login')
                } else {
                    return res.redirect(_getRedirectUrl(req))
                }
                })
            })

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister(req, res) {
         const { name, email, password }   = req.body
         // Validate request 
         if(!name || !email || !password ) {
             req.flash('error', 'All fields are required')
             req.flash('name', name)
             req.flash('email', email)
            return res.redirect('/register')
         }
         // Check if email exists 
         User.exists({ email: email }, (err, result) => {
             if(result) {
                req.flash('error', 'Email already taken')
                req.flash('name', name)
                req.flash('email', email) 
                return res.redirect('/register')
             }
         })

         // Hash password 
         const hashedPassword = await bcrypt.hash(password, 10)
         // Create a user 
         const user = new User({
             name,
             email,
             password: hashedPassword
         })

         user.save().then((user) => {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'livemart.oop@gmail.com',
                  pass: 'sudarshan@1234'
                }
              });
              
              const mailOptions = {
                from: 'livemart.oop@gmail.com',
                to: user.email,
                subject: 'Registration Confirmed',
                text: `Welcome to LiveMart: the Online Grocery Store where we serve the best products at the best price`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            // Login
            return res.redirect('/')
         }).catch(err => {
            req.flash('error', 'Something went wrong')
                return res.redirect('/register')
         })
        },
        logout(req, res) {
            delete req.session.cart
          req.logout()
          return res.redirect('/login')  
        }
    }
}

module.exports = authController