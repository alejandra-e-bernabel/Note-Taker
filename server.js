const express = require("express");
const path = require("path");
const fs = require('fs');

//unique ID generator
const { v4: uuidv4 } = require('uuid');
// call using uuidv4();

//listening on port 3001
const PORT = 3001;

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware to use public folder.
app.use(express.static("public"));

// localhost:3001/notes will take us to /public/notes.html
app.get("/notes", (req, res) =>
    res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// localhost:3001/api/notes will display saved notes JSON

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) throw err;
        const noteData = JSON.parse(data);
        res.json(noteData);
      });
});

//backup path. Any other get request not listed above will take user to /public/index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});

//says what happens when user provides a delete request.
app.delete("/api/notes/:id", (req, res) => {
    //read current notes
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) throw err;
        //save request parameter as deleteID
        const deleteID = req.params.id;
        //parse currentNotes string ---> JSON objest
        let currentNotes = JSON.parse(data);

        //iterate through currentNotes. Any with the same ID as requested will be spliced from the JSON file.
        for (let i=0; i<currentNotes.length; i++) {
            if (deleteID === currentNotes[i].id) {
                currentNotes.splice(i, 1);
            }
        };

        //stringify current notes JSON ---> string
        currentNotes = JSON.stringify(currentNotes);

        //provide request response to user
        res.send("Note has been deleted");

        //update current notes to db.json file
        fs.writeFile(`./db/db.json`, currentNotes, (err) =>
            err
                ? console.error(err)
                : console.log(
                    "Object deleted!"
                )
        );
    })
})


//says what happens when user provides a POST request
app.post("/api/notes", (req, res) => {
    let response;
    //making sure note has title and text
    if (req.body.title && req.body.text) {
        response = {
            title: req.body.title,
            text: req.body.text,
            id: uuidv4()  //give item ID, this will help with displaying and deleting saved notes.
        };

        res.json("Note with title " + response.title + " has been added")

        //check current db.json
        fs.readFile("./db/db.json", "utf-8", (err, data) => {
            if (err) throw err;

            //parse current notes JSON, string ---> JSON objest
            const originalNotes = JSON.parse(data);
            //add new note to originalNotes JSON object
            originalNotes.push(response);
            //stringify noteString to pass it back to db.json, JSON ---> string
            const noteString = JSON.stringify(originalNotes);

            //write new noteString to db.json
            fs.writeFile(`./db/db.json`, noteString, (err) =>
                err
                    ? console.error(err)
                    : console.log(
                        "Note with title " + response.title + " has been added"
                    )
            );
        })
    }
    //in case user enters a get request that does not contain title and text
    else {
        res.json("Request body must contain a title and text");
    }
})

//app launches on port 3001
app.listen(PORT, () =>
    console.log("App listening at http://localhost:" + PORT));