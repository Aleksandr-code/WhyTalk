const {Router} = require('express')
const notAuth = require('../middleware/notAuth')
const User = require('../models/user')
const Conference = require('../models/conference')
const router = Router()

router.get('/', notAuth, async (req, res) => {
    try{
        const conferences = await Conference.find({'userId': req.session.user._id})
        .populate('userId', 'email')

        res.render('conferences-list', {
            layout: 'user-layout',
            title: 'Личный кабинет |',
            conferences
        })
    } catch (err) {
        console.log(err)
    }
})

router.get('/conference/add', notAuth, async (req, res) => {
    res.render('conferences-add', {
        layout: 'user-layout',
        title: 'Личный кабинет |'
    })
})

router.post('/conference/add', notAuth, async (req, res) => {
    const conference = new Conference({
        title : req.body.title,
        dateTime: req.body.dateTime,
        userId: req.session.user
    })
    try {
        await conference.save()
        res.redirect('/user')
    } catch (err) {
        console.log(err)
    }
})

router.get('/conference/edit/:id', notAuth, async (req, res) => {
    try{
        const conference = await Conference.findById(req.params.id)
        //Отредактировать дату
        //console.log(conference.dateTime.toLocaleString())
        //console.log(conference.dateTime)
        // moment.js
        const month = (conference.dateTime.getMonth()+1<10) ? '0'+(conference.dateTime.getMonth()+1) : conference.dateTime.getMonth()+1 
        const showDateTime = conference.dateTime.getFullYear()+"-"+month+"-"+conference.dateTime.getDate()+"T"+conference.dateTime.toLocaleTimeString()
        res.render('conferences-edit', {
            layout: 'user-layout',
            title: 'Личный кабинет |',
            conference,
            showDateTime
        })
    } catch (e){
        console.log(e)
    }
})

router.post('/conference/edit', notAuth, async (req, res) => {
    try{
        const {id} = req.body
        delete req.body.id
        const conference = await Conference.findById(id)
        if(!(conference.userId.toString() === req.session.user._id.toString())){
            return res.redirect('/user')
        }
        Object.assign(conference, req.body)
        await conference.save()
        res.redirect('/user')
    } catch (e) {
        console.log(e)
    }
})

router.post('/conference/remove', notAuth, async (req, res) => {
    try{
        await Conference.deleteOne({
            _id: req.body.id,
            userId: req.session.user._id  
        })
        res.redirect('/user')
    } catch (e) {
        console.log(e)
    }
})

router.get('/information', notAuth, async (req, res) => {
    res.render('user-info', {
        layout: 'user-layout',
        title: 'Личный кабинет |',
        user: req.session.user,
    })
})

router.post('/information', notAuth, async (req, res) => {
    try{
        const user = await User.findById(req.session.user._id)

        const toChange = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            aboutMyselfInformation: req.body.aboutMyselfInformation,
            //Добавить аватар и обо мне
        }

        Object.assign(user, toChange)
        await user.save()
        req.session.user = user
        res.redirect('/user/information')
    } catch (e) {
        console.log(e)
    }
})

router.get('/setting', notAuth, async (req, res) => {
    res.render('user-setting', {
        layout: 'user-layout',
        title: 'Личный кабинет |'
    })
})

module.exports = router