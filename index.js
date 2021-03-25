const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')

app.use(express.static(path.join(__dirname,'/app')))

app.get('/', (req, res) => {
    res.send('<h2>Test new</h2>')
})

const PORT = process.env.PORT || 3000

/*try{
    mongoose.connect('mongodb+srv://Aleksandr:0v9tgCVWtNRkFKdT@cluster0.4qt7w.mongodb.net/WhyTalk', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    console.log('Connect DB')
}
catch(e){
    console.log(e)
}*/

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT} port`)
})