const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const app = express()
const mongoose = require('mongoose')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const homeRoutes = require('./routes/home')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')
const roomsRoutes = require('./routes/rooms')
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
app.use(csrf())
app.use(flash())
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
        io.on('connection', socket => {
            socket.on('join-room', (roomId, userId, userName) => {
                socket.join(roomId)
                // socket.to(roomId).broadcast.emit('user-connected', userId)
                socket.on("message", (message) => {
                    io.to(roomId).emit("createMessage", message, userName);
                });
                // socket.on('disconnect', () => {
                //   socket.to(roomId).broadcast.emit('user-disconnected', userId)
                // })
            })
        })
        http.listen(PORT, ()=> {
            console.log(`Server is running on ${PORT} port`)
        })
    }
    catch(e){
        console.log(e)
    }
}

start()


