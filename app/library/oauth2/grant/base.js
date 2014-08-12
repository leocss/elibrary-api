/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var Grant = function() {
  this.identifier = null;
  this.client = null;
};

Grant.prototype.getIdentifier = function() {
  return this.identifier;
};

module.exports = Grant;