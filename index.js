const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const app = express()
const mongoose = require('mongoose')

const MONGODB_URI = `mongodb+srv://Aleksandr:0v9tgCVWtNRkFKdT@cluster0.4qt7w.mongodb.net/WhyTalk`

const hbs = exphbs.create({
    defaultLayout : 'main',
    extname : 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname,'/app')))

app.get('/', (req, res) => {
    res.render('index')
})

const PORT = process.env.PORT || 3000

async function start(){
    try{
        // await mongoose.connect(MONGODB_URI, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     useFindAndModify: false
        // })
        // console.log('Connect DB')
        app.listen(PORT, ()=> {
            console.log(`Server is running on ${PORT} port`)
        })
    }
    catch(e){
        console.log(e)
    }
}

start()


