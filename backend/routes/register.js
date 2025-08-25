const express = require('express');
const router = express.Router();
const {schemas, validateUser} = require('../models/schemas')
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');


router.post('/', async (req, res) => {
    console.log(req.body)
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await schemas.User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.')
    

    user = new schemas.User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({
        name: user.name,
        email: user.email,
        _id: user._id
    });
})

module.exports = router;