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

        db('posts')
            .then((posts) => {
                posts.sort(dynamicSort('id'))
                db('users')
                    .where("id", pass.user)
                    .first()
                    .then((user) => {
                        req.session.first_name = user.first_name
                        req.session.last_name = user.last_name
                        res.render('board', {
                            user,
                            posts
                        })
                    })
            })
            
            function dynamicSort(property) {
                var sortOrder = 1;
                if(property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a,b) {
                    var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
                    return result * sortOrder;
                }
            }
       
        
    })

    .get('/isa', (req, res, next) => {
        let pass = req.session.passport
        res.send(req.session)
        /* db('users')
            .where("id", pass.user)
            .first()
            .then((user) => {
                res.send(user)
            }) */
    })  

    .get('/logout', (req, res, next) => {
        req.session.destroy((err) => {
            res.redirect("/")
        })
    })

    .post('/addLike/:id', (req, res, next) => {
        let postId = req.params.id
        console.log(postId)
        db('posts')
        .where('id', postId)
        .first()
        .then((id) => {
            let curLikes = (id.likes + 1)
                db('posts')
                .where('id', postId)
                .first()
                .update({'likes': curLikes})
                .then((id) => {
                    console.log(id)
                })
        })
    })
    .post('/addDislike/:id', (req, res, next) => {
        let postId = req.params.id
        console.log(postId)
        db('posts')
        .where('id', postId)
        .first()
        .then((id) => {
            let curLikes = (id.dislikes + 1)
                db('posts')
                .where('id', postId)
                .first()
                .update({'dislikes': curLikes})
                .then((id) => {
                    console.log(id)
                })
        })
    })

    .post('/addPost', (req, res, next) => {
        let post = {
            text: req.body.text,
            imgs: req.body.img,
            likes: 0,
            dislikes: 0,
            first_name: req.session.first_name,
            last_name: req.session.last_name
        }

        db('posts')
            .insert(post)
            .then((postId) => {
                console.log(postId)
            })
            
    })

    .listen(3000)



