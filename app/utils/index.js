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
  }
};
