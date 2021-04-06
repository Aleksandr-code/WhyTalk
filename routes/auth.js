const {Router} = require('express')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация |'
    })
})

router.get('/register', async (req, res) => {
    res.render('auth/register', {
        title: 'Регистрация |'
    })
})


module.exports = router
