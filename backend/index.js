const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/users')
const auth = require('./routes/auth')
const register = require('./routes/register')
const addItem = require('./routes/addItem')
const checkItem = require('./routes/checkItem')
const latestBazaar = require('./routes/latestBazaar')
const searchRoute = require('./routes/search')
const markItemRoute = require('./routes/markItem')
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const config = require('config');
const cookieParser = require('cookie-parser')
const axios = require('axios')
const schemas = require('./models/schemas')

console.log(config.get('jwtPrivateKey'))
if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.')
    process.exit(1);
}

const app = express();
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use('/api/users', router)
app.use('/api/auth', auth)
app.use('/api/register', register)
app.use('/api/addItem', addItem)
app.use('/api/checkItem', checkItem)
app.use('/api/search', searchRoute)
app.use('/api/latestBazaar', latestBazaar)
app.use('/api/markItem', markItemRoute)


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/api');
}

async function fetchBazaarData() {

    try {
    await schemas.schemas.Bazaar.deleteMany({});
      const response = await axios.get('https://api.hypixel.net/skyblock/bazaar', {
        params: {
          key: process.env.HYPIXEL_API_KEY
        }
      });
      const products = response.data.products;
      const newProducts = {};
      
      for (const productId in products) {

        if (products.hasOwnProperty(productId)) {
          const { quick_status, product_id } = products[productId];
          newProducts[productId] = { quick_status, product_id };
        }
      }
      
      const bazaar = new schemas.schemas.Bazaar({
        time: Date.now(),
        products: newProducts
      })
      
      await bazaar.save()
    } catch (error) {
      console.error('Error fetching bazaar data:', error);
    }
  }

setInterval(fetchBazaarData, 60000)

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})