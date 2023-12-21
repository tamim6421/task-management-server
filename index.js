const express = require('express')
const app = express()
const cors = require ('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

const { MongoClient } = require('mongodb');

// middleware 
app.use(cors())
app.use( express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iimwc2a.mongodb.net/?retryWrites=true&w=majority`;

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db("task-management").collection('users')
    const taskCollection = client.db("task-management").collection('task')



    // post user to the database 
    app.post('/users', async(req, res) =>{
        try {
         const user = req.body 
       
         // insert email if user do not exists 
         const query = {email: user.email}
         const existingUser = await usersCollection.findOne(query)
         if(existingUser){
           return res.send({message: 'user already exist', insertedId: null})
         }
         const result = await usersCollection.insertOne(user)
         res.send(result)
         
        } catch (error) {
         console.log(error)
        }
       })

    //    get all user 
       app.get('/getUser', async(req, res) =>{
        try {
            const result = await usersCollection.find().toArray()
            res.send(result)
        } catch (error) {
            console.log(error)
        }
       })


    //  post task to db 
    app.post('/task', async(req, res) =>{
        try {
            const task = req.body
            const result = await taskCollection.insertOne(task)
            res.send(result)
            
        } catch (error) {
            console.log(error)
        }
    }) 

// get task by email 
app.get('/getTask/:email', async(req, res) =>{
    try {
        const query = {email: req.params.email}
        const result = await taskCollection.find(query).toArray()
        res.send(result)
    } catch (error) {
        console.log(error)
    }
})

// app.get('/allusers/:email',  async(req, res) =>{
//     const query = {email: req.params.email}
//     const result = await usersCollection.find(query).toArray()
//     res.send(result)
//   })
  



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('Task Management Server')
})

app.listen( port, () =>{
    console.log(`Server is running port ${port}`)
})