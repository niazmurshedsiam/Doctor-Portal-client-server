const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bm8mo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const appointmentsCollection = client
    .db("doctorsPortal")
    .collection("appointments");
  console.log(appointmentsCollection);
  app.post("/addAppointment", (req, res) => {
    const appointments = req.body;
    console.log(appointments);
    appointmentsCollection.insertOne(appointments).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get('/appointments', (req, res) => {
    appointmentsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        });
});

app.post('/appointmentsByDate', (req, res) => {
    const date = req.body;
    console.log(date.date);
    appointmentsCollection.find({ date: date.date })
        .toArray((err, documents) => {
            res.send(documents);
        });
});

  app.get("/", (req, res) => {
    res.send("hello from db it's working working");
  });
});
app.listen(process.env.PORT || port);
