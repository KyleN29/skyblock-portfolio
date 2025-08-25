const express = require('express');
const router = express.Router();
const {schemas, validateUser} = require('../models/schemas')
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');


async function findDocumentCloseTo24HoursAgo() {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // Calculate the time 24 hours ago
  
      // Find the closest time greater than or equal to 24 hours ago
      const closestDocumentAfter = await schemas.Bazaar.findOne({ time: { $gte: twentyFourHoursAgo } })
        .sort({ time: 1 })
        .exec();
  
      // Find the closest time less than 24 hours ago
      const closestDocumentBefore = await schemas.Bazaar.findOne({ time: { $lt: twentyFourHoursAgo } })
        .sort({ time: -1 })
        .exec();
  
      // Determine which document is closer to 24 hours ago
      let closestDocument;
      if (closestDocumentAfter && closestDocumentBefore) {
        const diffAfter = closestDocumentAfter.time - twentyFourHoursAgo;
        const diffBefore = twentyFourHoursAgo - closestDocumentBefore.time;
        closestDocument = diffAfter < diffBefore ? closestDocumentAfter : closestDocumentBefore;
      } else {
        closestDocument = closestDocumentAfter || closestDocumentBefore;
      }
      return closestDocument
    } catch (error) {
      console.error('Error finding the document:', error);
    }
  }


router.get('/', auth, async (req, res) => {

    const items = await getUserItems(req.user._id);
    const watchlistItems = await getUserWatchlist(req.user._id);
    const latestBazaar = await schemas.Bazaar.findOne({}, {}, { sort: { time: -1 }, limit: 1 }).exec();
    const dayBazaar = await findDocumentCloseTo24HoursAgo()

    console.log('USER: ', req.user)
    res.send({userItems: items, latestBazaar: latestBazaar, dayBazaar: dayBazaar, watchlistItems: watchlistItems});
});

router.post('/', async (req, res) => {

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

router.put('/sellItem', auth, async (req, res) => {
    try {
        const document = await schemas.Item.findOne({_id: req.body._id})
        console.log(document)
        document.quantity -= req.body.sellQuantity
        const updatedDocument = await document.save();

        console.log(updatedDocument)
        res.send(updatedDocument)
    } catch (error) {
        
    }
})

async function getUserItems(user) {
    const item = await schemas.Item.find({user: user}).exec();
    return item;
}

async function getUserWatchlist(user) {
    const item = await schemas.MarkedItem.find({user: user}).exec();
    return item;
}

module.exports = router;