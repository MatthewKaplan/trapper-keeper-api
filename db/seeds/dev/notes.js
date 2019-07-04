const seedData = require("../../../seedData");

const createNotes = (knex, note) => {
  return knex("notes")
    .insert(
      {
        title: note.title
      },
      "id"
    )
    .then(noteId => {
      let notePromises = [];

      note.listitems.forEach(item => {
        notePromises.push(
          createLists(knex, {
            noteItem: item.noteItem,
            isComplete: item.isComplete,
            note_id: noteId[0]
          })
        );
      });
      return Promise.all(notePromises);
    });
};

const createLists = (knex, listitem) => {
  return knex("listitems").insert(listitem);
};

exports.seed = function(knex) {
  return knex("listitems")
    .del()
    .then(() => knex("notes").del())
    .then(() => {
      let listPromises = [];

      seedData.forEach(note => {
        listPromises.push(createNotes(knex, note));
      });
      return Promise.all(listPromises);
    })
    .catch(error => console.log(`error: ${error}`));
};
