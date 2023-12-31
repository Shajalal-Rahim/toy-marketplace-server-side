const express = require('express');

const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


const app = express();
const corsOptions = {
  origin:'*',
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json());



/** mongoDB start **/


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6wmoia0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
  

    const toysCollection = client.db("toysDB").collection("toys");

    app.get('/toys', async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get("/mytoys/:email", async (req, res) => {
      console.log(req.params.email);
      const cursor =toysCollection.find({ selleremail: req.params.email})
      const result = await cursor.toArray();
      res.send(result)
    });

    app.put('/updatetoy/:id', async(req,res) =>{
      const id = req.params.id;
      console.log(id)
      const {photo, toyname, category, price, rating, sellername, selleremail, quantity, description} = req.body;
      const filter = {_id: new ObjectId(id)};
      const updatetoy = {
        $set:{
          photo:photo,
          toyname:toyname,
          category:category,
          price:price,
          rating:rating,
          sellername: sellername,
          selleremail:selleremail,
          quantity:quantity,
          description:description

        }
      }
      const result = await toysCollection.updateOne(filter, updatetoy)
      
      res.send(result)
    })

    app.get("/toyscategory/:category", async (req, res) => {
      console.log(req.params.category);
      const cursor =toysCollection.find({ category: req.params.category})
      const result = await cursor.toArray();
      res.send(result)
    });



    app.post('/toys', async (req, res) => {
      const newToys = req.body;
      console.log(newToys)
      const result = await toysCollection.insertOne(newToys);
      res.send(result)
    })

    app.delete('/toys/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


/** mongoDB end **/





app.get('/', (req, res) => {
  res.send('SIMPLE CRUD IS RUNNING')
})

app.listen(port, () => {
  console.log(`SIMPLE CRUD is running on port, ${port}`)
})