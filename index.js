const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express()

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@assignment.n8fri.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  await client.connect();
  const productsCollection = client.db('warehouse').collection('products');


  app.get('/products', async (req, res) => {
    const cursor = productsCollection.find({});
    const products = await cursor.toArray();
    res.send(products);
  });

  // Update API
  app.get('/update/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const product = await productsCollection.findOne(query);
    res.send(product);
    // console.log("the id is", id);
  })


}




run().catch(console.dir);

app.get('/', async (req, res) => {
  res.send('App is running');
})

app.listen(port, () => {
  console.log("App is listening", port);
})