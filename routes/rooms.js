const {Router} = require('express')
const router = Router()

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    res.render('room', {
        title: 'Комната конференции |',
        isRoomScript: true,
        roomID: id,
    })
})

module.exports = router