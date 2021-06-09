const express = require("express");
const cors = require("cors");
const router = express.Router();
const Person = require("../models/person");
router.use(cors());
router.use(express.json());

// Mongoose setup
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/crm", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to MongoDB
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB...");
});

function createPerson(req) {
  const person = new Person({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: req.body.role,
    organisation: req.body.organisation,
    department: req.body.department,
    email: req.body.email,
    phoneWork: req.body.phoneWork,
    phoneMobile: req.body.phoneMobile,
    location: req.body.location,
  });

  const result = person.save(function (err) {
    if (err) return console.error(err);
  });
}

function getPeople() {
  return Person.find();
}

function getPersonById(personId) {
  return Person.findById(personId);
}

function getPersonByName(firstname, lastname) {
  return Person.findOne({
    firstName: firstname,
    lastName: lastname,
  });
}

router.get("/", async (req, res) => {
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  if (firstname && lastname) {
    const personByName = await getPersonByName(firstname, lastname);
    res.json(personByName);
  } else {
    const people = await getPeople()
      .then((persons) => {
        let returnedPeople = [];

        for (let i = 0; i < persons.length; i++) {
          returnedPeople.push(persons[i].transform());
        }

        res.send(returnedPeople);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
    res.json(people);
  }
});

// get a person by their ID
router.get("/:id", async (req, res) => {
  try {
    const person = await getPersonById(req.params.id);
    res.json(person.transform());
  } catch (err) {
    res.status(404).send("The person with the given ID was not found.");
    //res.json({ message: err });
  }
});

// create a new person profile
router.post("/", async (req, res) => {
  try {
    const newCourse = await createPerson(req);
    res.json(newCourse);
  } catch (err) {
    res.status(400).send("There was a problem creating the new user");
  }
});

// delete a person
router.delete("/:id", async (req, res) => {
  try {
    const removedPerson = await Person.deleteOne({ _id: req.params.id });
    res.json(removedPerson);
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  console.log(req.body);
  try {
    const updatedPerson = await Person.updateOne(
      { _id: req.params.id },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          jobTitle: req.body.jobTitle,
          role: req.body.role,
          organisation: req.body.organisation,
          department: req.body.department,
          email: req.body.email,
          phoneWork: req.body.phoneWork,
          phoneMobile: req.body.phoneMobile,
          location: req.body.location,
        },
      }
    );
    res.json(updatedPerson);
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
