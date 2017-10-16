const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const passport = require('passport')
const RedisStore = require('connect-redis')(session)
const db = require('./db')
require('./passport')


express()
    .set('view engine', 'hjs')
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: false}))
    .use(express.static(__dirname + '/views'))
    .use(session({ 
        store: new RedisStore(),
        secret: "social tequila network", 
        resave: false, 
        saveUninitialized: false
    }))
    .use(passport.initialize())
    .use(passport.session())
    .get('/', (req, res, next) => {
       res.render('index')
    })

    .get('/login', (req, res, next) => {
        res.render('login')
    })
    .post('/login', passport.authenticate("local", {
        successRedirect: "/board",
        failureRedirect: "/login"
    }))

    

    .get('/signup', (req, res, next) => {
        res.render('signup')
    })
    .post('/signup', passport.authenticate('local-register', {
        successRedirect: "/board",
        failureRedirect: "/signup"
    }))

    .get('/board', (req, res, next) => {
        let pass = req.session.passport
        console.log(pass.user)

        db('posts')
            .then((posts) => {
                console.log(posts)
                let post = posts
                db('users')
                    .where("id", pass.user)
                    .first()
                    .then((user) => {
                        res.render('board', {
                            user,
                            posts
                        })
                    })
            })
            
        
       
        
    })

    .get('/isa', (req, res, next) => {
        let pass = req.session.passport
        console.log(pass.user)
        db('users')
            .where("id", pass.user)
            .first()
            .then((user) => {
                res.send(user)
            })
    })  

    .get('/logout', (req, res, next) => {
        req.session.destroy((err) => {
            res.redirect("/")
        })
    })

    .post('/addLike/:id', (req, res, next) => {
        console.log('got')
        let postId = req.params.id

        db('posts')
            .where('id', postId)
            .first()
            .update('text', 'train')
    })


    .listen(3200)



