const path = require('path')
const express = require('express')
const morgan = require('morgan')
var methodOverride = require('method-override')
const handlebars = require('express-handlebars')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const flash = require('connect-flash')

const SortMiddleware = require('./app/middlewares/sortMiddleware')

const User = require('./app/models/User');
const route = require('./routes') // tự nạp file index
const db = require('./config/db')

const app = express()

// Connect to DB
db.connect()
    .then(result => {
        const port = 3000
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    })
    .catch()

const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/duan',
    collection: 'sessions'
})

app.use(express.static(path.join(__dirname, 'public')))


app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))


app.use(flash())

app.use((req, res, next) => {
    if (!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next()
        })
        .catch()
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.isAuthenticatedAdmin = req.session.role - 2
    res.locals.user = req.session.user
    next()
})

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(methodOverride('_method'))

//Custom middlewares
app.use(SortMiddleware)

// HTTP logger
app.use(morgan('combined'))

// Template engine
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: require('./helpers/handlebars')
}))

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'))

// Rotes init
route(app);