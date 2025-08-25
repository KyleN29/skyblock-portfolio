const express = require('express');
const router = express.Router();
const {schemas} = require('../models/schemas')
const bcrypt = require('bcrypt');
const Joi = require('joi');
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    res.sendStatus(200); 
})


router.post('/', async (req, res) => {
    // console.log(req.body)
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await schemas.User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid email or password')
    

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid email or password')

    let options = {
        path:"/",
        sameSite:true,
        maxAge: 1000 * 60 * 60 * 168,
        httpOnly: false,
    }
    const token = user.generateAuthToken();
    console.log('Set Token: ', token)
    res.cookie('x-auth-token', token, options)

    res.send('login success')
})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(req);
}


module.exports = router;