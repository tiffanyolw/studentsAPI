const express = require("express");
const app = express();
const config = require("./configurations/config");
const Student = require("./models/student");
const validation = require("./validation");

app.use(express.json());

let reqCount = 0;

// Logs # of each request and HTTP method
app.use((req, res, next) => {
    reqCount ++;
    console.log(`Request #${reqCount}: ${req.method}`);
    next();
});

// Authenticate DB
config.authenticate().then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log(err);
});

config.sync({force:false}).then((result) => {
    console.log("Sync successful");
}).catch((err) => {
    console.log(err);
});

// Add a student
app.post("/", (req, res) => {
    if (!validation.isValidStudent(req.body)) {
        return res.status(400).send("Incomplete request body");
    }

    let newStudent = {
        name: req.body.name,
        section: req.body.section,
        gpa: req.body.gpa,
        nationality: req.body.nationality
    }

    Student.create(newStudent).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.status(400).send(err);
    })
});

// Get all students
app.get("/", (req, res) => {
    Student.findAll().then((result) => {
        res.send(result);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

// Get student with id or section
app.get("/search", (req, res) => {
    if (req.query.id) {
        Student.findByPk(req.query.id).then((result) => {
            if (result) {
                res.send(result);
            } else {
                res.send(`No student with id ${req.query.id} found`);
            }
        }).catch((err) => {
            res.status(400).send(err);
        });
    } else if (req.query.section) {
        Student.findAll({
            where: {
                section: req.query.section
            }
        }).then((result) => {
            res.send(result);
        }).catch((err) => {
            res.status(400).send(err);
        });
    } else {
        res.redirect("/");
    }
});

// Update a student
app.put("/id/:id", (req, res) => {
    if (!validation.isValidStudent(req.body)) {
        return res.status(400).send("Incomplete request body");
    }

    Student.findByPk(req.params.id).then((result) => {
        if (result) {
            result.name = req.body.name,
            result.section = req.body.section,
            result.gpa = req.body.gpa,
            result.nationality = req.body.nationality

            result.save().then(() => {
                res.send(result);
            }).catch((err) => {
                res.status(400).send(err);
            });
        } else {
            res.status(400).send(`No student with id ${req.params.id} found`);
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});

// Delete a student
app.delete("/id/:id", (req, res) => {
    Student.findByPk(req.params.id).then((result) => {
        if (result) {
            result.destroy().then(() => {
                res.send(result);
            }).catch((err) => {
                res.status(400).send(err);
            });

        } else {
            res.status(400).send(`No student with id ${req.params.id} found`);
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
});
