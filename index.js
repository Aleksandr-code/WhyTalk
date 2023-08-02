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
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(http, {
  debug: true,
});

const MONGODB_URI = `MONGODB_URI`
const users = {};

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

app.use("/peerjs", peerServer);
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

                if (users[roomId]) users[roomId].push({ id: userId, name: userName, video: true, audio: true });
                else users[roomId] = [{ id: userId, name: userName, video: true, audio: true }];

                socket.join(roomId)
                socket.to(roomId).emit('user-connected', userId)
                io.to(roomId).emit('participants', users[roomId]);
                socket.on("message", (message) => {
                    io.to(roomId).emit("createMessage", message, userName);
                });
                socket.on("mute-mic", () => {
                    users[roomId].forEach((user) => {
                        if (user.id === userId) return (user.audio = false);
                    });
                    io.in(roomId).emit("participants", users[roomId]);
                });
                socket.on("unmute-mic", () => {
                    users[roomId].forEach((user) => {
                        if (user.id === userId) return (user.audio = true);
                    });
                    io.in(roomId).emit("participants", users[roomId]);
                });
                socket.on("stop-video", () => {
                    users[roomId].forEach((user) => {
                        if (user.id === userId) return (user.video = false);
                    });
                    io.in(roomId).emit("participants", users[roomId]);
                });
                socket.on("play-video", () => {
                    users[roomId].forEach((user) => {
                        if (user.id === userId) return (user.video = true);
                    });
                    io.in(roomId).emit("participants", users[roomId]);
                });
                // Настроить демонстрацию
                socket.on('stop-share', () => {
                    socket.to(roomId).emit('delete-share', userId)
                })
                socket.on('disconnect', () => {
                  socket.to(roomId).emit('user-disconnected', userId);
                  users[roomId] = users[roomId].filter((user) => user.id !== userId);
                  if (users[roomId].length === 0) delete users[roomId];
                  else io.to(roomId).emit("participants", users[roomId]);
                })
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


