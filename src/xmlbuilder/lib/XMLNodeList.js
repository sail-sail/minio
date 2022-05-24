export const XMLNodeList = (function() {
  function XMLNodeList(nodes) {
    this.nodes = nodes;
  }

  Object.defineProperty(XMLNodeList.prototype, 'length', {
    get: function() {
      return this.nodes.length || 0;
    }
  });

  XMLNodeList.prototype.clone = function() {
    return this.nodes = null;
  };

  XMLNodeList.prototype.item = function(index) {
    return this.nodes[index] || null;
  };

  return XMLNodeList;

})();
