const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require("dotenv").config()

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function connect () {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("db-nhaxinh").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    // try {
    //     await mongoose.connect(process.env.MONGODB_URL);
    //     console.log("success connect db");
    // } catch (error) {
    //     console.log("fail connect db");
    // }
}

module.exports = { connect };