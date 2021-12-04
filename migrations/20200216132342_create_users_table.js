/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.string('id', 255).primary().notNullable().unique();
    table.integer('philoart_id');
    table.string('username', 255).unique();
    table.text('password');
    table.text('profile_image');
    table.text('first_name');
    table.text('last_name');
    table.text('email');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index('username', 'email');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
