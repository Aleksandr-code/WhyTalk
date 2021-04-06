const {Router} = require('express')
const router = Router()

router.get('/', async (req, res) => {
    res.render('user', {
        title: 'Личный кабинет |'
    })
})

module.exports = router