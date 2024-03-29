var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// isObject = require('./Utility').isObject;
import { isObject } from "./Utility.js";

// XMLNode = require('./XMLNode');
import { XMLNode } from "./XMLNode.js";

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

export const XMLDTDEntity = (function(superClass) {
  extend(XMLDTDEntity, superClass);

  function XMLDTDEntity(parent, pe, name, value) {
    XMLDTDEntity.__super__.constructor.call(this, parent);
    if (name == null) {
      throw new Error("Missing DTD entity name. " + this.debugInfo(name));
    }
    if (value == null) {
      throw new Error("Missing DTD entity value. " + this.debugInfo(name));
    }
    this.pe = !!pe;
    this.name = this.stringify.name(name);
    this.type = NodeType.EntityDeclaration;
    if (!isObject(value)) {
      this.value = this.stringify.dtdEntityValue(value);
      this.internal = true;
    } else {
      if (!value.pubID && !value.sysID) {
        throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
      }
      if (value.pubID && !value.sysID) {
        throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
      }
      this.internal = false;
      if (value.pubID != null) {
        this.pubID = this.stringify.dtdPubID(value.pubID);
      }
      if (value.sysID != null) {
        this.sysID = this.stringify.dtdSysID(value.sysID);
      }
      if (value.nData != null) {
        this.nData = this.stringify.dtdNData(value.nData);
      }
      if (this.pe && this.nData) {
        throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
      }
    }
  }

  Object.defineProperty(XMLDTDEntity.prototype, 'publicId', {
    get: function() {
      return this.pubID;
    }
  });

  Object.defineProperty(XMLDTDEntity.prototype, 'systemId', {
    get: function() {
      return this.sysID;
    }
  });

  Object.defineProperty(XMLDTDEntity.prototype, 'notationName', {
    get: function() {
      return this.nData || null;
    }
  });

  Object.defineProperty(XMLDTDEntity.prototype, 'inputEncoding', {
    get: function() {
      return null;
    }
  });

  Object.defineProperty(XMLDTDEntity.prototype, 'xmlEncoding', {
    get: function() {
      return null;
    }
  });

  Object.defineProperty(XMLDTDEntity.prototype, 'xmlVersion', {
    get: function() {
      return null;
    }
  });

  XMLDTDEntity.prototype.toString = function(options) {
    return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options));
  };

  return XMLDTDEntity;

})(XMLNode);
