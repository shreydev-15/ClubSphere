const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controllers')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', authController.getme)
router.post('/logout', authController.logout)

module.exports = router