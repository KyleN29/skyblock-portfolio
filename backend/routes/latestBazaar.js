const express = require('express');
const router = express.Router();
const {schemas, validateUser} = require('../models/schemas')
const auth = require('../middleware/auth');


router.get('/', async (req, res) => {
    const latestBazaar = await schemas.Bazaar.findOne({}, {}, { sort: { time: -1 }, limit: 1 }).exec();
    res.send({latestBazaar: latestBazaar});
});


module.exports = router;