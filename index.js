const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.60qwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        await client.connect();
        console.log('server online')
        const itemsCollection = client.db('electronics').collection('items'); 
        const usersCollection = client.db('electronics').collection('users'); 


        app.post('/item', async (req, res) => {
            const newItem = req.body;
            console.log('new item added', newItem);
            const result= await itemsCollection.insertOne(newItem);
            // res.send({result : 'success'})
            res.send(result)
        });

        //-----get all items
        app.get('/item', async (req, res) => {
            const query ={};
            const cursor = itemsCollection.find(query)
            const items = await cursor.toArray();
            res.send(items);
        })

        //--- get individual
        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemsCollection.findOne(query);
            res.send(result)
        })

        //
        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const updateItem = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc ={
                $set: {
                    quantity:updateItem.quantity
                }
            };
            const result = await itemsCollection.updateOne(filter, updateDoc, options);
            res.send(result)
            console.log(result)
        })

        app.delete('/item/:id', async(req, res) => {
            const id = req.param.id;
            const query = {_id: ObjectId(id)};
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Server Online');
})

app.listen(port, () => {
    console.log('Server on port', port)
})