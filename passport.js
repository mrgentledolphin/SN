const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const knex = require('knex')
const db = require('./db')

passport.use(new LocalStrategy(authenticate))
passport.use("local-register", new LocalStrategy({passReqToCallback: true},register))

function authenticate (email, password, done) {
    db('users')
        .where("email", email)
        .first()
        .then((user) => {
            if(!user) {
                return done(null, false, {message: "User not found"})
            }
            if (user.password !== password) {
                return done(null, false, {message: "Wrong password"})
            }
            done(null, user)
        }, done)
}

function register (req, email, password, done) {
    db("users")
        .where("email", email)
        .first()
        .then((user) => {
            if(user){
                return done(null, false, {message: "invalid email"})
            }
            if(password !== req.body.password2){
                return done (null, false, {message: "password no match"})
            }

            const newUser = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: email,
                password: password,
                profile_pic: req.body.profile_pic
            }
            db('users')
                .insert(newUser)
                .then((ids) => {
                    newUser.id = ids[0]
                    done(null, newUser)
                })
        })
}


passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    db("users")
        .where("id", id)
        .first()
        .then((user) => {
            done(null, user)
        }, done)
})