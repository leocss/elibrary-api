/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  bookshelf = require('../bootstrap/database').bookshelf;

var BaseModel = bookshelf.Model.extend({
  /**
   * Sets valid attributes of this domain. Unknown attributes
   * will be filtered out on-create and on-update
   */
  permitted: [],

  initialize: function() {
    this.on('creating', this.creating, this);
    this.on('updating', this.updating, this);
    this.on('saving', this.saving, this);
  },

  /**
   * Called before a new record is inserted
   *
   * @param model
   * @param attributes
   * @param options
   */
  creating: function(model, attributes, options) {
  },

  /**
   * Called when updating a record
   *
   * @param model
   * @param attributes
   * @param options
   */
  updating: function(model, attributes, options) {
  },

  saving: function(model, attributes, options) {
    this.attributes = this.pick(this.permitted);
  },

  update: function(attributes, options) {
    return this.save(attributes, _.merge({patch: true}, options));
  }
}, {

  findOne: function(credentials, options, query) {
    query = query || {};
    options = _.extend({require: true}, options);
    return this.forge(credentials).query(query).fetch(options);
  },

  all: function(options) {
    options = _.extend({require: true}, options);
    return this.forge({}).fetchAll(options)
  },

  findMany: function(query, options) {
    options = _.extend({require: true}, options);
    return this.forge({}).query(query).fetchAll(options);
  },

  findById: function(id, options, query) {
    return this.findOne.call(this, {id: id}, options, query);
  },

  create: function(attributes, options) {
    return this.forge(attributes).save(null, options);
  },

  update: function(id, attributes, options) {
    return this.findOne({id: id}, options).then(function(model) {
      return model.save(attributes, options);
    });
  },

  /**
   * @param attributes
   * @param where
   * @param options
   * @returns {*}
   */
  destroy: function(where, options) {
    options = options || {};
    return this.forge({}).where(where).destroy(options);
  }
});

var BaseCollection = bookshelf.Collection.extend({});

module.exports = {
  Model: BaseModel,
  Collection: BaseCollection
};
