var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// XMLNode = require('./XMLNode');
import { XMLNode } from "./XMLNode.js";

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

export const XMLDTDElement = (function(superClass) {
  extend(XMLDTDElement, superClass);

  function XMLDTDElement(parent, name, value) {
    XMLDTDElement.__super__.constructor.call(this, parent);
    if (name == null) {
      throw new Error("Missing DTD element name. " + this.debugInfo());
    }
    if (!value) {
      value = '(#PCDATA)';
    }
    if (Array.isArray(value)) {
      value = '(' + value.join(',') + ')';
    }
    this.name = this.stringify.name(name);
    this.type = NodeType.ElementDeclaration;
    this.value = this.stringify.dtdElementValue(value);
  }

  XMLDTDElement.prototype.toString = function(options) {
    return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options));
  };

  return XMLDTDElement;

})(XMLNode);
