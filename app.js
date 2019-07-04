const express = require("express");
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.get("/api/v1/notes", (req, res) => {
  database("notes")
    .select()
    .then(notes => {
      res.status(200).json(notes);
    })
    .catch(error => res.status(500).json({ error }));
});

app.get("/api/v1/listitems", (req, res) => {
  database("listitems")
    .select()
    .then(listitems => {
      res.status(200).json(listitems);
    })
    .catch(error => res.status(500).json({ error }));
});

app.get("/api/v1/notes/:id", (req, res) => {
  database("notes")
    .where("id", req.params.id)
    .select()
    .then(note => {
      if (note.length) {
        res.status(200).json(note);
      } else {
        res.statusCode(404).json({
          error: `could not find note with id: ${req.params.id}`
        });
      }
    })
    .catch(error => res.status(500).json({ error }));
});

app.get("/api/v1/listitems/:id", (req, res) => {
  database("listitems")
    .where("id", req.params.id)
    .select()
    .then(listitem => {
      if (listitem.length) {
        res.status(200).json(listitem);
      } else {
        res.statusCode(404).json({
          error: `could not find listitem with id: ${req.params.id}`
        });
      }
    })
    .catch(error => res.status(500).json({ error }));
});

app.post("/api/v1/notes", (req, res) => {
  const { title } = req.body;
  const note = req.body;

  if (!title) {
    return res.status(422).json(`please enter a title for your note`);
  } else {
    database("notes")
      .insert(note, "id")
      .then(note => {
        res.status(201).json({ id: note[0] });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  }
});

app.post("/api/v1/listitems", (req, res) => {
  const {
    noteItem,
    isComplete,
    note_id
  } = req.body;
  const listitem = req.body;

  if ((!noteItem, !isComplete, !note_id)) {
    return res.status(422).json();
  } else {
    database("listitems")
      .insert(listitem, "id")
      .then(listitem => {
        res.status(201).json({ id: listitem[0] });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  }
});

app.patch("/api/v1/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) return res.status(422).json("Please provide a title.");

  database("notes")
    .where({ id })
    .update({ title })
    .then(res.status(200).json("Title successfully updated"))
    .catch(error => res.status(500).json({ error }));
});

app.patch("/api/v1/listitems/:id", (req, res) => {
  const { id } = req.params;
  const { noteItem, isComplete,  } = req.body;

  if (!noteItem) return res.status(422).json("Please provide a noteItem.");

  database("listitems")
    .where({ id })
    .update({ noteItem, isComplete })
    .then(res.status(200).json("List Items successfully updated"))
    .catch(error => res.status(500).json({ error }));
});

app.delete("/api/v1/notes/:id", (req, res) => {
  const { id } = req.params;

  database("notes")
    .where("id", id)
    .del()
    .then(result => {
      if (!result) {
        res
          .status(404)
          .json(
            `I'm sorry that id doesn't exist in notes table, maybe this is good news seeing you were trying to delete it anyway.`
          );
      } else {
        res.status(200).json(`id: ${id} deleted`);
      }
    });
});

app.delete("/api/v1/listitems/:id", (req, res) => {
  const { id } = req.params;

  database("listitems")
    .where("id", id)
    .del()
    .then(result => {
      if (!result) {
        res
          .status(404)
          .json(
            `I'm sorry that id doesn't exist in listitems table, maybe this is good news seeing you were trying to delete it anyway.`
          );
      } else {
        res.status(200).json(`id: ${id} deleted`);
      }
    });
});

module.exports = app;
