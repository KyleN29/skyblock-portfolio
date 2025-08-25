const express = require('express');
const router = express.Router();
const {schemas} = require('../models/schemas')
const bcrypt = require('bcrypt');
const Joi = require('joi');
const auth = require('../middleware/auth')

router.post('/', auth, async (req, res) => {
    console.log(req.body)
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const item = new schemas.Item({
        user: req.user._id,
        item: req.body.item,
        quantity: req.body.quantity,
        buyPrice: req.body.buyPrice
    })

    await item.save()
    res.sendStatus(200);
})

function validate(req) {
    const schema = Joi.object({
        item: Joi.string().required(),
        quantity: Joi.number().required(),
        buyPrice: Joi.number().required(),
    });

    return schema.validate(req);
}


module.exports = router;