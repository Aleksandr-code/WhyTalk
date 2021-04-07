const {Router} = require('express')
const notAuth = require('../middleware/notAuth')
const router = Router()

router.get('/', notAuth, async (req, res) => {
    res.render('user', {
        title: 'Личный кабинет |'
    })
})

module.exports = router