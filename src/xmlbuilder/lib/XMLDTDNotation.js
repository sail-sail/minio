var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// XMLNode = require('./XMLNode');
import { XMLNode } from "./XMLNode.js";

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

export const XMLDTDNotation = (function(superClass) {
  extend(XMLDTDNotation, superClass);

  function XMLDTDNotation(parent, name, value) {
    XMLDTDNotation.__super__.constructor.call(this, parent);
    if (name == null) {
      throw new Error("Missing DTD notation name. " + this.debugInfo(name));
    }
    if (!value.pubID && !value.sysID) {
      throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
    }
    this.name = this.stringify.name(name);
    this.type = NodeType.NotationDeclaration;
    if (value.pubID != null) {
      this.pubID = this.stringify.dtdPubID(value.pubID);
    }
    if (value.sysID != null) {
      this.sysID = this.stringify.dtdSysID(value.sysID);
    }
  }

  Object.defineProperty(XMLDTDNotation.prototype, 'publicId', {
    get: function() {
      return this.pubID;
    }
  });

  Object.defineProperty(XMLDTDNotation.prototype, 'systemId', {
    get: function() {
      return this.sysID;
    }
  });

  XMLDTDNotation.prototype.toString = function(options) {
    return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options));
  };

  return XMLDTDNotation;

})(XMLNode);
