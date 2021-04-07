const {Router} = require('express')
const authenticated = require('../middleware/authenticated')
const User = require('../models/user')
const router = Router()

router.get('/login', authenticated, async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация |'
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
            const areSame = password === candidate.password
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
                res.redirect('/auth/login')
            }
        } else {
            res.redirect('/auth/login')
        }

    } catch (err){
        console.log(err)
    }

})

router.get('/register', authenticated, async (req, res) => {
    res.render('auth/register', {
        title: 'Регистрация |'
    })
})

router.post('/register', authenticated, async (req, res) => {
    try {
        const {email, password, confirm, firstName, lastName} = req.body
        const candidate = await User.findOne({email})

        if(candidate){
            res.redirect('/auth/login')
        } else {
            const user = new User({
                email, password, firstName, lastName
            })
            await user.save()
            res.redirect('/auth/login')
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
