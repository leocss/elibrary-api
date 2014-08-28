/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

module.exports = {
  /**
   *
   * @param baseCls
   * @param superCls
   * @returns {*}
   */
  extendObject: function(baseCls, superCls) {
    baseCls.prototype = Object.create(superCls.prototype);
    baseCls.prototype.constructor = baseCls;

    return baseCls;
  },

  take: function(object, properties) {
    Object(properties).forEach(function(property) {
      if (!object.hasOwnProperty(property)) {
        object[property] = null;
      }
    });

    return _.pick(object, properties);
  }
};
