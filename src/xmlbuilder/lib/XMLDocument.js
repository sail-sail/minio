var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// isPlainObject = require('./Utility').isPlainObject;
import { isPlainObject } from "./Utility.js";

// XMLDOMImplementation = require('./XMLDOMImplementation');
import { XMLDOMImplementation } from "./XMLDOMImplementation.js";

// XMLDOMConfiguration = require('./XMLDOMConfiguration');
import { XMLDOMConfiguration } from "./XMLDOMConfiguration.js";

// XMLNode = require('./XMLNode');
import { XMLNode } from "./XMLNode.js";

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

// XMLStringifier = require('./XMLStringifier');
import { XMLStringifier } from "./XMLStringifier.js";

// XMLStringWriter = require('./XMLStringWriter');
import { XMLStringWriter } from "./XMLStringWriter.js";

export const XMLDocument = (function(superClass) {
  extend(XMLDocument, superClass);

  function XMLDocument(options) {
    XMLDocument.__super__.constructor.call(this, null);
    this.name = "#document";
    this.type = NodeType.Document;
    this.documentURI = null;
    this.domConfig = new XMLDOMConfiguration();
    options || (options = {});
    if (!options.writer) {
      options.writer = new XMLStringWriter();
    }
    this.options = options;
    this.stringify = new XMLStringifier(options);
  }

  Object.defineProperty(XMLDocument.prototype, 'implementation', {
    value: new XMLDOMImplementation()
  });

  Object.defineProperty(XMLDocument.prototype, 'doctype', {
    get: function() {
      var child, i, len, ref;
      ref = this.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        if (child.type === NodeType.DocType) {
          return child;
        }
      }
      return null;
    }
  });

  Object.defineProperty(XMLDocument.prototype, 'documentElement', {
    get: function() {
      return this.rootObject || null;
    }
  });

  Object.defineProperty(XMLDocument.prototype, 'inputEncoding', {
    get: function() {
      return null;
    }
  });

  Object.defineProperty(XMLDocument.prototype, 'strictErrorChecking', {
    get: function() {
      return false;
    }
  });

  Object.defineProperty(XMLDocument.prototype, 'xmlEncoding', {
    get: function() {
      if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
        return this.children[0].encoding;
      } else {
        return null;
      }
    }
  });

  Object.defineProperty(XMLDocument.prototype, 'xmlStandalone', {
    get: function() {
      if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
        return this.children[0].standalone === 'yes';
      } else {
        return false;
      }
    }
  });

  Object.defineProperty(XMLDocument.prototype, 'xmlVersion', {
    get: function() {
      if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
        return this.children[0].version;
      } else {
        return "1.0";
      }
    }
  });

  Object.defineProperty(XMLDocument.prototype, 'URL', {
    get: function() {
      return this.documentURI;
    }
  });

  Object.defineProperty(XMLDocument.prototype, 'origin', {
    get: function() {
      return null;
    }
  });

  Object.defineProperty(XMLDocument.prototype, 'compatMode', {
    get: function() {
      return null;
    }
  });

  Object.defineProperty(XMLDocument.prototype, 'characterSet', {
    get: function() {
      return null;
    }
  });

  Object.defineProperty(XMLDocument.prototype, 'contentType', {
    get: function() {
      return null;
    }
  });

  XMLDocument.prototype.end = function(writer) {
    var writerOptions;
    writerOptions = {};
    if (!writer) {
      writer = this.options.writer;
    } else if (isPlainObject(writer)) {
      writerOptions = writer;
      writer = this.options.writer;
    }
    return writer.document(this, writer.filterOptions(writerOptions));
  };

  XMLDocument.prototype.toString = function(options) {
    return this.options.writer.document(this, this.options.writer.filterOptions(options));
  };

  XMLDocument.prototype.createElement = function(tagName) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createDocumentFragment = function() {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createTextNode = function(data) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createComment = function(data) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createCDATASection = function(data) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createProcessingInstruction = function(target, data) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createAttribute = function(name) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createEntityReference = function(name) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.getElementsByTagName = function(tagname) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.importNode = function(importedNode, deep) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createElementNS = function(namespaceURI, qualifiedName) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createAttributeNS = function(namespaceURI, qualifiedName) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.getElementById = function(elementId) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.adoptNode = function(source) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.normalizeDocument = function() {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.renameNode = function(node, namespaceURI, qualifiedName) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.getElementsByClassName = function(classNames) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createEvent = function(eventInterface) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createRange = function() {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createNodeIterator = function(root, whatToShow, filter) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLDocument.prototype.createTreeWalker = function(root, whatToShow, filter) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  return XMLDocument;

})(XMLNode);
