const express = require("express");
const app = express();

const validation = require("./validation");

app.use(express.json());

let reqCount = 0;

// Logs # of each request and HTTP method
app.use((req, res, next) => {
    reqCount ++;
    console.log(`Request #${reqCount}: ${req.method}`);
    next();
});

let students = [];

// FOR TESTING -----------------------
students = [
    {id: 1, name: "Name 1", section: "Science", gpa: 3.2, nationality: "Canadian"},
    {id: 2, name: "Name 2", section: "Mathematics", gpa: 2.0, nationality: "Australian"},
    {id: 3, name: "Name 3", section: "Engineering", gpa: 1.4, nationality: "Dutch"},
    {id: 4, name: "Name 4", section: "Social Science", gpa: 4.0, nationality: "Canadian"},
    {id: 5, name: "Name 5", section: "Science", gpa: 3.9, nationality: "American"},
    {id: 6, name: "Name 6", section: "Arts", gpa: 3.1, nationality: "Indian"},
    {id: 7, name: "Name 7", section: "Social Science", gpa: 2.7, nationality: "American"},
    {id: 8, name: "Name 8", section: "Arts", gpa: 2.2, nationality: "Canadian"},
    {id: 9, name: "Name 9", section: "Science", gpa: 3.5, nationality: "American"},
    {id: 10, name: "Name 10", section: "Engineering", gpa: 1.6, nationality: "Australian"}
];
// -----------------------------------

// Add a student
app.post("/", (req, res) => {
    let body = req.body;

    if (!validation.isValidStudent(body)) {
        return res.status(400).send("Incomplete request body");
    }

    if (!Number.isInteger(body.id)) {
        return res.status(400).send("id must be an integer");
    }

    if (validation.doesIdExist(students, body.id)) {
        return res.status(400).send("id already exists for another student");
    }

    let newStudent = req.body;
    students.push(newStudent);
    res.status(200).send(newStudent);
});

// Get all students
app.get("/", (req, res) => {
    res.status(200).send(students);
});

// Get student with id or section
app.get("/search", (req, res) => {
    if (req.query.id) {
        let id = parseInt(req.query.id);
        
        if (!Number.isInteger(id)) {
            return res.status(400).send("id must be an integer");
        }

        let student = students.find(s => {
            return s.id === id;
        });

        if (!student) {
            return res.status(200).send(`No student with id ${id} found`);
        }

        return res.status(200).send(student);
    
    } else if (req.query.section) {
        let studentList = students.filter(s => {
            return s.section === req.query.section;
        });

        return res.status(200).send(studentList);
    }

    res.status(200).send(students);
});

// Update a student
app.put("/id/:id", (req, res) => {
    let body = req.body;
    let id = parseInt(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).send("id must be an integer");
    }

    if (!validation.isValidStudent(body)) {
        return res.status(400).send("Incomplete request body");
    }

    let index = students.findIndex(s => {
        return s.id === id;
    });

    if (index < 0) {
        return res.status(200).send(`No student with id ${id} found`);
    }

    if (id !== body.id) {
        return res.status(400).send("id cannot be updated");
    }

    students[index] = req.body;
    res.status(200).send(students[index]);
});

// Delete a student
app.delete("/id/:id", (req, res) => {
    let id = parseInt(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).send("id must be an integer");
    }

    let index = students.findIndex(s => {
        return s.id === id;
    });
    
    if (index < 0) {
        return res.status(200).send(`No student with id ${id} found`);
    }

    let deletedStudent = students[index];
    students.splice(index, 1);
    res.status(200).send(deletedStudent);
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
});
