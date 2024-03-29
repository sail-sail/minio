
export const XMLNamedNodeMap = (function() {
  function XMLNamedNodeMap(nodes) {
    this.nodes = nodes;
  }

  Object.defineProperty(XMLNamedNodeMap.prototype, 'length', {
    get: function() {
      return Object.keys(this.nodes).length || 0;
    }
  });

  XMLNamedNodeMap.prototype.clone = function() {
    return this.nodes = null;
  };

  XMLNamedNodeMap.prototype.getNamedItem = function(name) {
    return this.nodes[name];
  };

  XMLNamedNodeMap.prototype.setNamedItem = function(node) {
    var oldNode;
    oldNode = this.nodes[node.nodeName];
    this.nodes[node.nodeName] = node;
    return oldNode || null;
  };

  XMLNamedNodeMap.prototype.removeNamedItem = function(name) {
    var oldNode;
    oldNode = this.nodes[name];
    delete this.nodes[name];
    return oldNode || null;
  };

  XMLNamedNodeMap.prototype.item = function(index) {
    return this.nodes[Object.keys(this.nodes)[index]] || null;
  };

  XMLNamedNodeMap.prototype.getNamedItemNS = function(namespaceURI, localName) {
    throw new Error("This DOM method is not implemented.");
  };

  XMLNamedNodeMap.prototype.setNamedItemNS = function(node) {
    throw new Error("This DOM method is not implemented.");
  };

  XMLNamedNodeMap.prototype.removeNamedItemNS = function(namespaceURI, localName) {
    throw new Error("This DOM method is not implemented.");
  };

  return XMLNamedNodeMap;

})();
