/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var crypto = require('crypto');
var _ = require('lodash');
var casual = require('casual');

module.exports = {
  /**
   *
   * @param baseCls
   * @param superCls
   * @returns {*}
   */
  extendObject: function (baseCls, superCls) {
    baseCls.prototype = Object.create(superCls.prototype);
    baseCls.prototype.constructor = baseCls;
    baseCls.methods = baseCls.prototype;

    return baseCls;
  },

  createObject: function (cls) {
    cls.methods = cls.prototype;
    return cls;
  },

  rand: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  take: function (object, properties) {
    Object(properties).forEach(function (property) {
      if (!object.hasOwnProperty(property)) {
        object[property] = null;
      }
    });

    return _.pick(object, properties);
  },

  safeString: function (string) {
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
  },

  shuffle: function (characters, times) {
    var res = [];
    for (var i = 0; i < times; i++) {
      res.push(casual.random_element(characters.split('')));
    }

    return res.join('');
  },

  md5: function (str) {
    return crypto.createHash('md5').update(str).digest('hex');
  }
};
