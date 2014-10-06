/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash');

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

  createObject: function(cls) {
    cls.methods = cls.prototype;
    return cls;
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
    }
};
