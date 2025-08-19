const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const port = process.env.PORT || 5000
require('dotenv').config()
const app = express()

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://arafatmonir091:${process.env.DB_PASSWORD}@cluster0.dli62xc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()

    const database = client.db('coffee-shop')
    const coffeeCollection = database.collection('all-coffee')

    // post route
    app.post('/coffee', async (req, res) => {
      const result = req.body
      console.log(result)
      const postData = await coffeeCollection.insertOne(result)
      res.send(postData)
    })

    // get route
    app.get('/coffee', async (req, res) => {
      const result = coffeeCollection.find()
      const getData = await result.toArray()
      res.send(getData)
    })

    // get single data
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id
      const objectId = new ObjectId(id)
      const result = await coffeeCollection.findOne({ _id: objectId })
      res.send(result)
    })

    // put data
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id
      const data = req.body
      console.log(data)
      const filter = { _id: new ObjectId(id) }
      const doc = {
        $set: {
          name: data.name,
          chef: data.chef,
          supplier: data.supplier,
          taste: data.taste,
          category: data.category,
          details: data.details,
          photo: data.photo,
          price: data.price,
        },
      }
      const result = await coffeeCollection.updateOne(filter, doc, {
        upsert: true,
      })
      res.send(result)
    })

    // delete data
    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id
      const objectId = new ObjectId(id)
      const result = await coffeeCollection.deleteOne({ _id: objectId })
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close()
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('hello .........')
})

app.listen(port, () => {
  console.log(`server is running port ${port}`)
})
