const {Router} = require('express')
const router = Router()

router.get('/', async (req, res) => {
    res.render('room', {
        title: 'Комната конференции |'
    })
})

module.exports = router