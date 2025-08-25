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

    const markedItem = new schemas.MarkedItem({
        user: req.user._id,
        item: req.body.item,
        markedPrice: req.body.markedPrice,
        note: req.body.note
    })
    console.log(req.body.markedPrice)
    await markedItem.save()
    res.sendStatus(200);
})

function validate(req) {
    const schema = Joi.object({
        item: Joi.string().required(),
        markedPrice: Joi.number().required(),
        note: Joi.string().max(250).required(),
    });
    return schema.validate(req);
}

router.put('/', auth, async (req, res) => {
    try {

        const { _id, newDescription } = req.body;


        if (!_id || !newDescription) {
            return res.status(400).send('Missing _id or newDescription in request body.');
        }


        const document = await schemas.MarkedItem.findOne({ _id: _id });
        if (!document) {
            return res.status(404).send('Document not found.');
        }


        document.note = newDescription;


        const updatedDocument = await document.save();
        

        res.status(200).send(updatedDocument);
    } catch (error) {

        console.error(error);


        res.status(500).send('An error occurred while updating the document.');
    }
});
module.exports = router;