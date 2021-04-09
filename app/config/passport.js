const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
function configurePassport(){
    return{
        init(passport) {
            passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
                // Login
                // check if email exists
                const user = await User.findOne({ email: email })
                if(!user) {
                    return done(null, false, { message: 'No user with this email' })
                }
        
                bcrypt.compare(password, user.password).then(match => {
                    if(match) {
                        return done(null, user, { message: 'Logged in succesfully' })
                    }
                    return done(null, false, { message: 'Wrong username or password' })
                }).catch(err => {
                    return done(null, false, { message: 'Something went wrong' })
                })
            }))
        
            passport.serializeUser((user, done) => {
                done(null, user._id)
            })
        
            passport.deserializeUser((id, done) => {
                User.findById(id, (err, user) => {
                    done(err, user)
                })
            })
        
        },
        gsignin(passport){
            passport.use(new GoogleStrategy({
                clientID: '1024217112089-8cp05ol1jiggeabqdagrm1d9fjqr598i.apps.googleusercontent.com',
                clientSecret: 'aUkUszqMKUTserK8_k3eQRlT',
                callbackURL: 'http://localhost:3300'
              },
              function(accessToken, refreshToken, profile, done) {
                   User.findOrCreate({ googleId: profile.id }, function (err, user) {
                     return done(err, user);
                   });
              }
            ))
        }
    }

}


module.exports = configurePassport