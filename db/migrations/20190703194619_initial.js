exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable("notes", function(table) {
      table.increments("id").primary();
      table.string("title");

      table.timestamps(true, true);
    }),

    knex.schema.createTable("listitems", function(table) {
      table.increments("id").primary();
      table.string("noteItem");
      table.boolean("isComplete");

      table.integer("note_id").unsigned();
      table.foreign("note_id").references("notes.id");

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable("notes"),
    knex.schema.dropTable("listitems")
  ]);
};
