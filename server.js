const express = require ("express");
const path = require("path");

const noteData = require ("./db/db.json");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes", (req, res) => 
    res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
    res.json(noteData);
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});


// * `POST /api/notes` should receive a new note to save on the request body, 
//add it to the `db.json` file, and then return the new note to the client. 
//You'll need to find a way to give each note a unique id when it's saved 
//(look into npm packages that could do this for you).



app.listen(PORT, () => 
    console.log("App listening at http://localhost:" + PORT));