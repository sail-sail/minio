// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

// XMLNode = require('./XMLNode');
import { XMLNode } from "./XMLNode.js";

export const XMLAttribute = (function() {
  function XMLAttribute(parent, name, value) {
    this.parent = parent;
    if (this.parent) {
      this.options = this.parent.options;
      this.stringify = this.parent.stringify;
    }
    if (name == null) {
      throw new Error("Missing attribute name. " + this.debugInfo(name));
    }
    this.name = this.stringify.name(name);
    this.value = this.stringify.attValue(value);
    this.type = NodeType.Attribute;
    this.isId = false;
    this.schemaTypeInfo = null;
  }

  Object.defineProperty(XMLAttribute.prototype, 'nodeType', {
    get: function() {
      return this.type;
    }
  });

  Object.defineProperty(XMLAttribute.prototype, 'ownerElement', {
    get: function() {
      return this.parent;
    }
  });

  Object.defineProperty(XMLAttribute.prototype, 'textContent', {
    get: function() {
      return this.value;
    },
    set: function(value) {
      return this.value = value || '';
    }
  });

  Object.defineProperty(XMLAttribute.prototype, 'namespaceURI', {
    get: function() {
      return '';
    }
  });

  Object.defineProperty(XMLAttribute.prototype, 'prefix', {
    get: function() {
      return '';
    }
  });

  Object.defineProperty(XMLAttribute.prototype, 'localName', {
    get: function() {
      return this.name;
    }
  });

  Object.defineProperty(XMLAttribute.prototype, 'specified', {
    get: function() {
      return true;
    }
  });

  XMLAttribute.prototype.clone = function() {
    return Object.create(this);
  };

  XMLAttribute.prototype.toString = function(options) {
    return this.options.writer.attribute(this, this.options.writer.filterOptions(options));
  };

  XMLAttribute.prototype.debugInfo = function(name) {
    name = name || this.name;
    if (name == null) {
      return "parent: <" + this.parent.name + ">";
    } else {
      return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
    }
  };

  XMLAttribute.prototype.isEqualNode = function(node) {
    if (node.namespaceURI !== this.namespaceURI) {
      return false;
    }
    if (node.prefix !== this.prefix) {
      return false;
    }
    if (node.localName !== this.localName) {
      return false;
    }
    if (node.value !== this.value) {
      return false;
    }
    return true;
  };

  return XMLAttribute;

})();

