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
  }
};
