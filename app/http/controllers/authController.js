const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const nodemailer = require('nodemailer');
<<<<<<< HEAD
=======


>>>>>>> 4e47fc42af0064ec70f9afcc9192cdb861526f6b
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
<<<<<<< HEAD
                  pass: 'sudarshan@1234'
=======
                  pass: 'password'
>>>>>>> 4e47fc42af0064ec70f9afcc9192cdb861526f6b
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
<<<<<<< HEAD
        delete req.session.cart
=======
            delete req.session.cart
>>>>>>> 4e47fc42af0064ec70f9afcc9192cdb861526f6b
          req.logout()
          return res.redirect('/login')  
        }
    }
}

module.exports = authController