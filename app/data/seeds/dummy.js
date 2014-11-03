/**
 * Dummy data generator;
 *
 * This is used to generate dummy data that will be
 * used during development process only;
 *
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var knex = require('knex'),
  crypto = require('crypto'),
  bcrypt = require('bcryptjs'),
  casual = require('casual'),
  Promise = require('bluebird'),
  moment = require('moment'),
  hat = require('hat'),
  utils = require('../../utils'),
  knexfile = require('../../../knexfile');

knex = knex(knexfile.development);

var queue = [];
var etest_courses = {
  'Computer Science': [
    {
      question: 'What is a computer?',
      type: 'multiple_choice',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: 2
    },
    {
      question: 'Question Two?',
      type: 'multiple_choice',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: 1
    },
    {
      question: 'What is a computer?',
      type: 'true_or_false',
      options: ['Yes', 'No'],
      answer: 2
    }
  ],
  'Physics': [
    {
      question: 'Do you like physics?',
      type: 'true_or_false',
      options: ['Yes', 'No'],
      answer: 2
    }
  ]
};

var categories = {
  books: [
    'Mathematics',
    'Signals',
    'Computer Science',
    'C++', 'Python',
    'Operating System',
    'Linux'
  ],
  post: [
    'News',
    'Updates',
    'Education'
  ]
};

var shuffle = function (characters, times) {
  var res = [];
  for (var i = 0; i < times; i++) {
    res.push(casual.random_element(characters.split('')));
  }

  return res.join('');
};

var safeString = function (string) {
  string = string.trim();
  // TODO: use unidecode to remove non-ascii characters

  // Remove URL reserved chars: `:/?#[]@!$&'()*+,;=` as well as `\%<>|^~£"`
  string = string.replace(/[:\/\?#\[\]@!$&'()*+,;=\\%<>\|\^~£"]/g, '')
    // Replace dots and spaces with a dash
    .replace(/(\s|\.)/g, '-')
    // Convert 2 or more dashes into a single dash
    .replace(/-+/g, '-')
    // Make the whole thing lowercase
    .toLowerCase();

  return string;
}

var generateMatricNumber = function () {
  return [
    casual.random_element([2008, 2009, 2010, 2011, 2012, 2013]), '/',
    casual.random_element([1, 2]), '/',
    shuffle('1234567890', 5),
    shuffle('ABCDEFGHIJKLMNOPQRST', 2)
  ].join('');
};

return Promise.resolve().then(function () {
  return knex.raw('SET @@global.FOREIGN_KEY_CHECKS=0;')
}).then(function () {
  return Promise.all([
    knex.table('users').truncate(),
    knex.table('etest_courses').truncate(),
    knex.table('etest_questions').truncate(),
    knex.table('etest_sessions').truncate(),
    knex.table('api_sessions').truncate(),
    knex.table('api_clients').truncate(),
    knex.table('books').truncate(),
    knex.table('books_issues').truncate(),
    knex.table('print_documents').truncate(),
    knex.table('print_jobs').truncate(),
    knex.table('categories').truncate(),
    knex.table('posts').truncate(),
    knex.table('likes').truncate(),
    knex.table('views').truncate(),
    knex.table('comments').truncate(),
  ]).then(function () {
    return true;
  });
}).then(function () {
  return knex.raw('SET @@global.FOREIGN_KEY_CHECKS=1;')
})
/**
 * Seed 'users' table
 */
  .then(function () {
    var type, uniqueId;
    console.log('Seeding "users" table');

    // Generate library users
    for (var i = 0; i < 10; i++) {
      type = (i == 0) ? 'student' : casual.random_element(['student', 'staff']);

      if (type == 'student') {
        uniqueId = generateMatricNumber()
      } else if (type == 'staff') {
        uniqueId = hat().substr(0, 12);
      }

      queue.push(knex.table('users').insert({
        unique_id: i == 0 ? '2009/1/323232CT' : uniqueId,
        password: bcrypt.hashSync('123456', 8),
        rfid: hat(),
        email: i == 0 ? 'johndoe@gmail.com' : casual.email.toLowerCase(),
        first_name: i == 0 ? 'John' : casual.first_name,
        last_name: i == 0 ? 'Doe' : casual.last_name,
        address: casual.address,
        gender: i == 0 ? 'M' : casual.random_element(['M', 'F']),
        type: type,
        fund: utils.rand(0, 900),
        debt: utils.rand(0, 5000),
        created_at: new Date(),
        updated_at: new Date()
      }));
    }

    return Promise.all(queue).then(function () {
      console.log('Done.');
      return Promise.resolve();
    });
  })
/**
 * Seed 'categories' table
 */
  .then(function () {
    console.log('Seeding "categories" table');
    queue = [];

    var title;

    Object.keys(categories).forEach(function (object) {
      for (var key in categories[object]) {
        if (categories[object].hasOwnProperty(key)) {
          title = categories[object][key];
          queue.push(knex.table('categories').insert({
            title: title,
            object_type: object,
            created_at: new Date(),
            updated_at: new Date()
          }));
        }
      }
    });

    return Promise.all(queue).then(function (result) {
      console.log('Done.');
    })
  })
/**
 * Seed 'books' table
 */
  .then(function () {
    console.log('Seeding "books" table');

    queue = [];
    // Generate 50 library books
    for (var i = 0; i < 50; i++) {
      queue.push(knex.table('books').insert({
        title: casual.title,
        author: casual.name,
        category_id: categories.books.indexOf(casual.random_element(categories.books)) + 1,
        edition: casual.random_element([1, 2, 3, 4, 5, 6]),
        overview: casual.text,
        has_soft_copy: casual.random_element([true, false]),
        has_hard_copy: casual.random_element([true, false]),
        hard_copies_count: casual.random_element([1, 3, 4, 5, 8]),
        borrow_count: casual.random_element([0, 1, 2, 4, 6, 8, 10]),
        published_at: moment(casual.date('YYYY-MM')).toISOString(),
        created_at: new Date(),
        updated_at: new Date()
      }));
    }

    return Promise.all(queue).tap(function () {
      console.log('Done.');
    });
  })
  .then(function () {
    console.log('Seeding "api_clients" table');
    queue = [];

    return knex.table('api_clients').insert({
      client_id: crypto.createHash('md5').update('dummy_client').digest('hex'),
      client_secret: crypto.createHash('md5').update('dummy_secret').digest('hex'),
      name: 'Sample Client',
      type: 'internal',
      created_at: new Date(),
      updated_at: new Date()
    }).then(function () {
      console.log('Done.');
      return true;
    });
  })
  .then(function () {
    console.log('Seeding "posts" table');
    queue = [];

    var title, content;

    return knex.table('categories')
      .select('*')
      .where('object_type', '=', 'post')
      .then(function (categories) {
        for (var i = 0; i < 20; i++) {
          title = casual.title;
          content = casual.text;

          queue.push(knex.table('posts').insert({
            category_id: casual.random_element(categories)['id'],
            title: title,
            slug: safeString(title),
            author_id: casual.random_element([1, 2]),
            content: content,
            content_html: content,
            created_at: new Date(),
            updated_at: new Date()
          }));
        }

        return Promise.all(queue);
      }).then(function () {
        console.log('Done.');
      });
  })
  .then(function () {
    console.log('Seeding "etest_courses" and "etest_questions" table');
    queue = [];

    Object.keys(etest_courses).forEach(function (course) {
      queue.push(knex.table('etest_courses').insert({
        name: course,
        description: casual.text,
        created_at: new Date(),
        updated_at: new Date()
      }));
    });

    return Promise.all(queue).then(function (results) {
      queue = [];
      results.forEach(function (course) {
        var question = etest_courses[course - 1];

        queue.push(knex.table('etest_questions').insert({
          course_id: course,
          question: question.question,
          type: question.type,
          options: JSON.parse(question.options),
          answer: question.answer,
          created_at: new Date(),
          updated_at: new Date()
        }));
      });

      return Promise.all(queue);
    }).then(function () {
      console.log('Done.');
      return true;
    });
  })
  .then(function () {
    process.exit();
  })
  .catch(function (error) {
    console.log(error);
    process.exit();
  });