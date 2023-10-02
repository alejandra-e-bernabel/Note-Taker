const express = require("express");
const path = require("path");
const fs = require('fs');


//unique ID generator
const { v4: uuidv4 } = require('uuid');
// call using uuidv4();

const noteData = require("./db/db.json");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes", (req, res) =>
    res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) throw err;
 
        const noteData = JSON.parse(data);
        res.json(noteData);
      });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});

app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) throw err;

        const deleteID = req.params.id;
        let currentNotes = JSON.parse(data);

        for (let i=0; i<currentNotes.length; i++) {
            if (deleteID === currentNotes[i].id) {
                currentNotes.splice(i, 1);
            }
        };

        currentNotes = JSON.stringify(currentNotes);

        res.send("Note has been deleted");

        fs.writeFile(`./db/db.json`, currentNotes, (err) =>
            err
                ? console.error(err)
                : console.log(
                    "object deleted"
                )
        );
    })
})


// * `POST /api/notes` should receive a new note to save on the request body, 
//add it to the `db.json` file, and then return the new note to the client. 
//You'll need to find a way to give each note a unique id when it's saved 
//(look into npm packages that could do this for you).
app.post("/api/notes", (req, res) => {
    let response;
    //making sure note has title and text
    if (req.body.title && req.body.text) {
        response = {
            title: req.body.title,
            text: req.body.text,
            id: uuidv4()  //give item ID, ***********************check if this is needed 
        };

        res.json("Note with title " + response.title + " has been added")

        // let noteString = JSON.stringify(response);

        fs.readFile("./db/db.json", "utf-8", (err, data) => {
            if (err) throw err;

            const originalNotes = JSON.parse(data);

            originalNotes.push(response);

            const noteString = JSON.stringify(originalNotes);

            fs.writeFile(`./db/db.json`, noteString, (err) =>
                err
                    ? console.error(err)
                    : console.log(
                        "Note with title " + response.title + " has been added"
                    )
            );
        })
    }

    else {
        res.json("Request body must contain a title and text");
    }
})



app.listen(PORT, () =>
    console.log("App listening at http://localhost:" + PORT));