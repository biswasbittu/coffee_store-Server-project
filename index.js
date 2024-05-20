const express = require('express');
const cors = require('cors');

require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// app.options('*', cors())
// app.use(cors(corsOptions));
app.use(cors(corsOptions))
app.use(express.json())
// app.use(express.json());



const user = (process.env.DB_USER);
const pwd = (process.env.DB_PWD);
const uri = `mongodb+srv://${user}:${pwd}@cluster0.bod8guw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;




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
        await client.connect();

        //   send data from clint side to Database
        // const database = client.db("CoffeeDB")
        // const coffeeCollection=database.collection("coffee");
        const coffeeCollection = client.db("CoffeeDB").collection("coffee");

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })

        app.get("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(quary);
            res.send(result)

        })
        // app.get('/coffee/:id', async (req, res) => {
        //     const id = req.params.id;
        //     // console.log(`Received ID: ${id}`);
        //     // Validate the ID
        //     if (!ObjectId.isValid(id) || id.length !== 24) {
        //         return res.status(400).send({ error: 'Invalid ID format-xx' });
        //     }

        //     try {
        //         const query = { _id: new ObjectId(id) };
        //         const result = await coffeeCollection.findOne(query);

        //         if (!result) {
        //             return res.status(404).send({ error: 'Coffee not found' });
        //         }

        //         res.send(result);
        //     } catch (error) {
        //         console.error('Error fetching coffee:', error);
        //         res.status(500).send({ error: 'Internal Server Error' });
        //     }
        // });

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result)

        })




        // Update to Db
        app.put(`/coffee/:id`, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    quentity: updatedCoffee.quentity,
                    supplier: updatedCoffee.supplier,
                    test: updatedCoffee.test,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo,

                },
            };
            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result)

        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(quary);
            // console.log(result);
            res.send(result);

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








app.get('/', (req, res) => {
    res.send('Coffee Making Server is ready')
})


app.listen(port, () => {
    console.log(`Coffee server is running on port ${port}`);
})