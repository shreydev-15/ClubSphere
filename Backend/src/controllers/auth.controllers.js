const userModel = require('../models/auth.models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function register(req,res){
    const {email, fullname: {firstname, lastname}, password} = req.body
    const isRegistered = await userModel.findOne({email})
    if(isRegistered){
        return res.status(200).json({
            message: "User Already Registered"
        })
    }
    const hashpass = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password : hashpass
    })

    const token = jwt.sign({id: user._id} ,process.env.JWT_TOKEN)
    res.cookie("token", token)
    res.status(201).json({
        message: "User registered Succussfully",
        token,
        user: {
            email: user.email,
            _id : user._id,
            fullname: user.fullname
        }
    })
}

async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: "User not found"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Incorrect Password"
        });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);

    res.cookie("token", token);

    return res.status(200).json({
        message: "User Logged in successfully",
        token,
        user: {
            fullname: user.fullname,
            email: user.email,
            id: user._id
        }
    });
}

//Getting the credentials

async function getme(req, res) {
    const token = req.cookies?.token

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized access'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN)
        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        return res.status(200).json({
            user: {
                fullname: user.fullname,
                email: user.email,
                id: user._id
            }
        })
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        })
    }
}

//logout

async function logout(req, res) {
    res.clearCookie('token')
    return res.status(200).json({
        message: 'User logged out succussfully'
    })
}

module.exports = {
    register,
    login,
    getme,
    logout
}
