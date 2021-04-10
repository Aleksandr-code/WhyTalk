const {Router} = require('express')
const authenticated = require('../middleware/authenticated')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const router = Router()

router.get('/login', authenticated, async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация |',
        error: req.flash('error')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
       res.redirect('/auth/login') 
    })
})

router.post('/login', authenticated, async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if(candidate){
            const areSame = await bcrypt.compare(password, candidate.password)
            if(areSame){
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if(err){
                        throw err
                    }
                    res.redirect('/user')
                })
            } else {
                req.flash('error', 'Неверный пароль')
                res.redirect('/auth/login')
            }
        } else {
            req.flash('error', 'Такого пользователя не существует')
            res.redirect('/auth/login')
        }

    } catch (err){
        console.log(err)
    }

})

router.get('/register', authenticated, async (req, res) => {
    res.render('auth/register', {
        title: 'Регистрация |',
        error: req.flash('error')
    })
})

router.post('/register', authenticated, async (req, res) => {
    try {
        const {email, password, confirm, firstName, lastName} = req.body
        const candidate = await User.findOne({email})

        if(candidate){
            req.flash('error', 'Пользователь с таким email уже существует')
            res.redirect('/auth/register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, password: hashPassword, firstName, lastName, conference: []
            })
            await user.save()
            res.redirect('/auth/login')
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
