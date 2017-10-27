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
        if(req.isAuthenticated()){
            res.redirect('/board')
        } else {
            res.render('index')
        }
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
                        let userId = user.id
                        req.session.first_name = user.first_name
                        req.session.last_name = user.last_name
                        res.render('board', {
                            user,
                            posts,
                            profileLinkId: userId
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
        if (req.isAuthenticated()) {
            res.send(req.session)
        } else {
            res.send('not auth')
        }

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
    .post('/updatePass', (req, res, next) => {
        let old = req.body.old
        let password = req.body.password
        let password2 = req.body.password2
        let passport = req.session.passport
        let accountId = passport.user
        console.log(password, password2, accountId)
        db('users')
            .where('id', accountId)
            .first()
            .then((user) => {
                if ( user.password === old && password === password2) {
                    db('users')
                    .where('id', accountId)
                    .first()
                    .update({'password': password})
                    .then((id) => {
                        console.log(id)
                        res.render('success')
                    })
                } else {
                    res.render('failure')
                }
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
        let passport = req.session.passport
        let post = {
            text: req.body.text,
            imgs: req.body.img,
            likes: 0,
            dislikes: 0,
            first_name: req.session.first_name,
            last_name: req.session.last_name,
            userId: passport.user
        }

        db('posts')
            .insert(post)
            .then((postId) => {
                console.log(postId)
                res.redirect('/board')
            })
            
    })
    .get('/profile', (req, res, next) => {
        let passport = req.session.passport
        let profileId = passport.user

        db('users')
            .where('id', profileId)
            .first()
            .then((user) => {
                db('posts')
                    .where('last_name', user.last_name)
                    .then((post) => {
                        res.render('profile', {
                            user,
                            post
                        })
                    })
            })
    })
    .get('/profile/:id', (req, res, next) => {
        let profileId = req.params.id
        db('users')
            .where('id', profileId)
            .first()
            .then((user) => {
                db('posts')
                    .where('last_name', user.last_name)
                    .then((post) => {
                        res.render('profile', {
                            user,
                            post
                        })
                    })
            })
    })
    // 404 error
    .use(function(req, res, next){
        res.status(404)
        if (req.accepts('html')) {
            res.render('404', {url: req. url})
            return
        }
        if (req.accepts('json')) {
            res.send({ error: 'Not Found! 404!'})
        }
        res.type('txt').send('Not Found!')
    })
    .listen(3000)



