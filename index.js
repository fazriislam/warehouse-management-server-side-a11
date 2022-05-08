const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
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
  const ratingCollection = client.db('warehouse').collection('rating')

  // receive all products by GET method
  app.get('/product', async (req, res) => {
    const cursor = productCollection.find({});
    const products = await cursor.toArray()
    res.send(products);
  })

  // receive ratings
  app.get('/rating', async (req,res)=>{
    const cursor = ratingCollection.find({});
    const rating = await cursor.toArray()
    res.send(rating);
  })

  // add product
  app.post('/product', async(req,res)=>{
    const newProduct = req.body;
    const result = await productCollection.insertOne(newProduct);
    res.send(result);
  })

  // add review
  app.post('/rating', async (req,res)=>{
    const newReview = req.body;
    const result = await ratingCollection.insertOne(newReview);
    res.send(result)
  })

  // my items APT
  app.post('/myItem', async (req, res) => {
    const product = req.body;
    const myItem = await myItemCollection.insertOne(product);
    res.send(myItem);
  })

  app.get('/myItem', async (req, res) => {
    const cursor = myItemCollection.find({});
    const myItem = await cursor.toArray();
    res.send(myItem);
  })
 

  // delete from my item route
  app.delete('/myItem/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await myItemCollection.deleteOne(query);
    res.send(result);
  })

  // get single product
  app.get('/product/:id',async(req,res)=>{
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await productCollection.findOne(query);
    res.send(result);
  })

  // update product
  app.put('/product/:id', async(req,res)=>{
    const id = req.params.id;
    const UpdatedProduct = req.body;
    const query = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
      $set:{
        name: UpdatedProduct.name,
        company: UpdatedProduct.company,
        price: UpdatedProduct.price,
        quantity: UpdatedProduct.quantity,
        description: UpdatedProduct.description,
        supplierName: UpdatedProduct.supplierName,
        supplierEmail: UpdatedProduct.supplierEmail,
        img: UpdatedProduct.img,
      }
    };
    const result = await productCollection.updateOne(query,updatedDoc,options);
    res.send(result);
  })

  
}




run().catch(console.dir);

app.get('/', async (req, res) => {
  res.send('App is running');
})

app.listen(port, () => {
  console.log("App is listening", port);
})