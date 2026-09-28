const jwt = require('jsonwebtoken')
const userModel = require('../models/user.models')

async function userAuth(req, res, next) {
    try {
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized access'
            })
        }

        const tokenVerify = jwt.verify(token, process.env.JWT_TOKEN)
        const user = await userModel.findById(tokenVerify.id)

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized access'
            })
        }

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({
            message: 'Unauthorized access'
        })
    }
}

module.exports = { userAuth }