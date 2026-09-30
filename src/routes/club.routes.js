const express = require('express')
const authmiddleware = require('../middlewares/auth.middlewares')
const clubcontrollers = require('../controllers/club.controller')

const router = express.Router()

router.post('/create', authmiddleware.userAuth, clubcontrollers.createclub)
router.get('/getAll', authmiddleware.userAuth, clubcontrollers.getAllClubs)
router.get('/getById', authmiddleware.userAuth, clubcontrollers.getClubById)
router.patch('/update', authmiddleware.userAuth, clubcontrollers.updateClub)
router.delete('/delete', authmiddleware.userAuth, clubcontrollers.deleteClub)

module.exports = router

