const express = require('express')
const authmiddleware = require('../middlewares/auth.middlewares')
const clubcontrollers = require('../controllers/club.controller')
const adminMiddleware = require('../middlewares/admin.middleware')

const router = express.Router()

router.post('/create', authmiddleware.userAuth, adminMiddleware.adminAuth, clubcontrollers.createclub)
router.get('/getAll', authmiddleware.userAuth, clubcontrollers.getAllClubs)
router.get('/getById/:clubId', authmiddleware.userAuth, clubcontrollers.getClubById)
router.patch('/update/:clubId', authmiddleware.userAuth, clubcontrollers.updateClub)
router.delete('/delete/:clubId', authmiddleware.userAuth, clubcontrollers.deleteClub)

module.exports = router

