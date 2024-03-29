
export const XMLDOMImplementation = (function() {
  function XMLDOMImplementation() {}

  XMLDOMImplementation.prototype.hasFeature = function(feature, version) {
    return true;
  };

  XMLDOMImplementation.prototype.createDocumentType = function(qualifiedName, publicId, systemId) {
    throw new Error("This DOM method is not implemented.");
  };

  XMLDOMImplementation.prototype.createDocument = function(namespaceURI, qualifiedName, doctype) {
    throw new Error("This DOM method is not implemented.");
  };

  XMLDOMImplementation.prototype.createHTMLDocument = function(title) {
    throw new Error("This DOM method is not implemented.");
  };

  XMLDOMImplementation.prototype.getFeature = function(feature, version) {
    throw new Error("This DOM method is not implemented.");
  };

  return XMLDOMImplementation;

})();