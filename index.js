const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const app = express()
const mongoose = require('mongoose')
const homeRoutes = require('./routes/home')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')
const roomsRoutes = require('./routes/rooms')
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')

const MONGODB_URI = `mongodb+srv://Aleksandr:0v9tgCVWtNRkFKdT@cluster0.4qt7w.mongodb.net/WhyTalk`

const hbs = exphbs.create({
    defaultLayout : 'main',
    extname : 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname,'/app')))
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:'any secret value',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/user', usersRoutes)
app.use('/room', roomsRoutes)

const PORT = process.env.PORT || 3000

async function start(){
    try{
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        app.listen(PORT, ()=> {
            console.log(`Server is running on ${PORT} port`)
        })
    }
    catch(e){
        console.log(e)
    }
}

start()


