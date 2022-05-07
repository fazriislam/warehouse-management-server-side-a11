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
  const productCollection = client.db('warehouse').collection('product')
  const myItemCollection = client.db('warehouse').collection('myItem')

  // Receive all products by GET method
  app.get('/product', async (req, res) => {
    const cursor = productCollection.find({});
    const products = await cursor.toArray()
    res.send(products);
  })



  // My items APT

  app.post('/myItem', async (req, res) => {
    const product = req.body;
    const myItem = await myItemCollection.insertOne(product);
    res.send(myItem);
  })

  app.get('/myItem', async(req,res)=> {
    const cursor = myItemCollection.find({});
    const myItem = await cursor.toArray();
    res.send(myItem);
  })

}




run().catch(console.dir);

app.get('/', async (req, res) => {
  res.send('App is running');
})

app.listen(port, () => {
  console.log("App is listening", port);
})