const express = require("express");
const app = express();
const mysql = require("mysql");
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}))


// Parse JSON bodies (as sent by API clients)
app.use(express.json());

const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "tech",
        database: "student_management"
    }
);
con.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + con.threadId);
});

/**
 * used to create new student record
 */
app.post("/student", (req, res) => {
        con.query('INSERT INTO student SET ?', req.body, function (error, results, fields) {
            con.end()
            if (error) return res.json({message: error.message, id: ""})
            return res.json({message: "student record inserted", id: results.insertId})
        })
    }
);

/**
 * used to retreive student records list
 */
app.get("/student", (req, res) => {
    con.query('SELECT * FROM students', function (error, results, fields) {
        con.end()
        if (error) return res.json({message: error.message, id: ""})
        return res.json({message: "student records", id: results})
    })
})

/**
 * used to update student record
 */
app.put("/student", (req, res) => {
    con.query('UPDATE student SET name=${req.body.name} where id = ${req.body.id}', req.body, function (error, results, fields) {
        con.end()
        if (error) return res.json({message: error.message, id: ""})
        return res.json({message: "student record updated", id: results.insertId})
    })
})

/**
 * used to delete student records
 */
app.delete("/student", (req, res) => {
    try {
        con.query(`delete
                   from student
                   where id = ${req.body.id}`, function (error, results, fields) {
            if (error) return res.json({message: error.message, id: ""})
            return res.json({message: "record delete", results})
        })
    } catch (e) {
        return res.json({message: e.message, id: ""})
    }

})

app.listen(3000, () => {
        console.log("server is running");
    }
);