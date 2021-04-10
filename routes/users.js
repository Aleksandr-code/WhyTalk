const {Router} = require('express')
const notAuth = require('../middleware/notAuth')
const Conference = require('../models/conference')
const router = Router()

router.get('/', notAuth, async (req, res) => {
    try{
        const conferences = await Conference.find({'userId': req.session.user._id})
        .populate('userId', 'email')

        res.render('user', {
            title: 'Личный кабинет |',
            conferences
        })
    } catch (err) {
        console.log(err)
    }
})

router.post('/conference/add', async (req, res) => {
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

module.exports = router