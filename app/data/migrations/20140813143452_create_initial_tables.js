'use strict';

exports.up = function (knex, Promise) {
  return knex.schema
  /**
   * Create 'users' table
   */
    .createTable('users', function (table) {
      table.increments('id');
      // The number on the card given to user after registering
      table.string('rfid');
      // Whatever that is used to uniquely identify the user type...
      // For student type, its matric_number, for staffs, its staff_id
      table.string('unique_id');
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('password');
      table.string('address');
      table.string('fund');
      table.string('dept');
      table.enum('gender', ['M', 'F']);
      table.string('type'); // type of user.. this can be 'staff' or 'student' (more can be specified)
      table.timestamps();
    })
  /**
   * Create 'users_favourites' table
   */
    .createTable('users_favourites', function (table) {
      table.increments('id');
      table.integer('user_id').unsigned().index();
      table.string('object').index();
      table.integer('object_id').unsigned().index();
      table.dateTime('created_at');
    })
  /**
   * Create 'print_jobs' table
   */
    .createTable('print_jobs', function (table) {
      table.string('id').primary();
      table.integer('user_id').unsigned()
        .references('id').inTable('users').onDelete('CASCADE');
      table.string('name');
    })
  /**
   * Create 'print_jobs_documents' table
   */
    .createTable('print_documents', function (table) {
      table.increments('id');
      table.string('job_id')
        .references('id').inTable('print_jobs').onDelete('CASCADE');
      table.string('file_name');
      table.string('file_path');
      table.string('file_size');
      table.string('file_type');
    })
  /**
   * Create 'api_clients' table
   */
    .createTable('api_clients', function (table) {
      table.increments('id');
      table.string('client_id').index();
      table.string('client_secret').index();
      table.string('name');
      table.string('type');
      table.timestamps();
    })
  /**
   * Create 'api_sessions' table
   */
    .createTable('api_sessions', function (table) {
      table.increments('id');
      table.integer('client_id').unsigned()
        .references('id').inTable('api_clients').onDelete('CASCADE');
      table.integer('user_id').unsigned().defaultTo(0);
      table.string('token').index();
      table.string('owner');
      table.string('life_time');
      table.timestamps();
    })
  /**
   * Create 'books' table
   */
    .createTable('books', function (table) {
      table.increments('id');
      table.integer('category_id').unsigned().index();
      table.string('title');
      table.string('author');
      table.string('edition');
      table.text('overview');
      table.string('file_name', 100);
      table.string('preview_image');
      table.boolean('has_soft_copy').defaultTo(0);
      table.boolean('has_hard_copy').defaultTo(0);
      // Total number of hard copies available
      table.integer('hard_copies_count').defaultTo(0);
      // Total number of times book has been borrowed
      table.integer('borrow_count').defaultTo(0);
      // Holds the time the book was published (Month & Year)
      table.dateTime('published_at');
      table.timestamps();
    })
  /**
   * Create 'books_issues' table
   */
    .createTable('books_issues', function (table) {
      table.integer('book_id').unsigned()
        .references('id').inTable('books').onDelete('CASCADE');
      table.integer('user_id').unsigned()
        .references('id').inTable('users').onDelete('CASCADE');
      table.dateTime('borrowed_at');
      table.dateTime('return_due_at');
      table.dateTime('returned_at');
    })
  /**
   * Create 'posts' table
   */
    .createTable('posts', function (table) {
      table.increments('id');
      table.integer('category_id').unsigned().index();
      table.string('title', 150);
      table.string('slug', 150);
      table.integer('author_id').unsigned(); // user id
      table.text('content', 16777215);
      table.text('content_html', 16777215);
      table.text('image', 2000); // featured image
      table.string('format', 20).defaultTo('html'); // markdown, html
      table.boolean('is_featured').defaultTo(0);
      table.integer('updated_by').defaultTo(0);
      table.timestamps();
    })
  /**
   * Create 'categories' table.
   */
    .createTable('categories', function (table) {
      table.increments('id');
      table.string('object', 30);
      table.string('title');
      table.string('description');
      table.timestamps();
    })
  /**
   * Create 'comments' table
   */
    .createTable('comments', function (table) {
      table.increments('id');
      table.integer('user_id').unsigned();
      table.string('object', 30);
      table.integer('object_id').unsigned();
      table.integer('likes_count').defaultTo(0);
      table.text('content');
      table.timestamps();
    })
  /**
   * Create 'likes' table
   */
    .createTable('likes', function (table) {
      table.increments('id');
      table.integer('user_id').unsigned();
      table.string('object', 30);
      table.integer('object_id').unsigned();
      table.dateTime('created_at');
    })
  /**
   * Create 'transactions' table
   */
    .createTable('transactions', function (table) {
      table.integer('id').unsigned();
      table.text('decription');
      table.integer('amount');
      table.enum('type', ['fund', 'cashout']);
      table.dateTime('created_at');
    })
  /**
   * Create 'views' table
   */
    .createTable('views', function (table) {
      table.increments('id');
      table.integer('user_id').unsigned();
      table.string('object', 30);
      table.integer('object_id').unsigned();
      table.dateTime('created_at');
    });
};

exports.down = function (knex, Promise) {
  return knex.raw('SET FOREIGN_KEY_CHECKS=0;')
    .then(function () {
      return knex.schema
        .dropTable('transactions')
        .dropTable('views')
        .dropTable('likes')
        .dropTable('comments')
        .dropTable('categories')
        .dropTable('posts_categories')
        .dropTable('posts')
        .dropTable('api_sessions')
        .dropTable('api_clients')
        .dropTable('books_issues')
        .dropTable('books')
        .dropTable('print_documents')
        .dropTable('print_jobs')
        .dropTable('users_favourites')
        .dropTable('users');
    }).then(function () {
      return knex.raw('SET FOREIGN_KEY_CHECKS=0;');
    });
};
