
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// isObject = require('./Utility').isObject;
import { isObject } from "./Utility.js";

// XMLNode = require('./XMLNode');
import { XMLNode } from "./XMLNode.js";

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

// XMLDTDAttList = require('./XMLDTDAttList');
import { XMLDTDAttList } from "./XMLDTDAttList.js";

// XMLDTDEntity = require('./XMLDTDEntity');
import { XMLDTDEntity } from "./XMLDTDEntity.js";

// XMLDTDElement = require('./XMLDTDElement');
import { XMLDTDElement } from "./XMLDTDElement.js";

// XMLDTDNotation = require('./XMLDTDNotation');
import { XMLDTDNotation } from "./XMLDTDNotation.js";

// XMLNamedNodeMap = require('./XMLNamedNodeMap');
import { XMLNamedNodeMap } from "./XMLNamedNodeMap.js";

export const XMLDocType = (function(superClass) {
  extend(XMLDocType, superClass);

  function XMLDocType(parent, pubID, sysID) {
    var child, i, len, ref, ref1, ref2;
    XMLDocType.__super__.constructor.call(this, parent);
    this.type = NodeType.DocType;
    if (parent.children) {
      ref = parent.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        if (child.type === NodeType.Element) {
          this.name = child.name;
          break;
        }
      }
    }
    this.documentObject = parent;
    if (isObject(pubID)) {
      ref1 = pubID, pubID = ref1.pubID, sysID = ref1.sysID;
    }
    if (sysID == null) {
      ref2 = [pubID, sysID], sysID = ref2[0], pubID = ref2[1];
    }
    if (pubID != null) {
      this.pubID = this.stringify.dtdPubID(pubID);
    }
    if (sysID != null) {
      this.sysID = this.stringify.dtdSysID(sysID);
    }
  }

  Object.defineProperty(XMLDocType.prototype, 'entities', {
    get: function() {
      var child, i, len, nodes, ref;
      nodes = {};
      ref = this.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        if ((child.type === NodeType.EntityDeclaration) && !child.pe) {
          nodes[child.name] = child;
        }
      }
      return new XMLNamedNodeMap(nodes);
    }
  });

  Object.defineProperty(XMLDocType.prototype, 'notations', {
    get: function() {
      var child, i, len, nodes, ref;
      nodes = {};
      ref = this.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        if (child.type === NodeType.NotationDeclaration) {
          nodes[child.name] = child;
        }
      }
      return new XMLNamedNodeMap(nodes);
    }
  });

  Object.defineProperty(XMLDocType.prototype, 'publicId', {
    get: function() {
      return this.pubID;
    }
  });

  Object.defineProperty(XMLDocType.prototype, 'systemId', {
    get: function() {
      return this.sysID;
    }
  });

  Object.defineProperty(XMLDocType.prototype, 'internalSubset', {
    get: function() {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    }
  });

  XMLDocType.prototype.element = function(name, value) {
    var child;
    child = new XMLDTDElement(this, name, value);
    this.children.push(child);
    return this;
  };

  XMLDocType.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
    var child;
    child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
    this.children.push(child);
    return this;
  };

  XMLDocType.prototype.entity = function(name, value) {
    var child;
    child = new XMLDTDEntity(this, false, name, value);
    this.children.push(child);
    return this;
  };

  XMLDocType.prototype.pEntity = function(name, value) {
    var child;
    child = new XMLDTDEntity(this, true, name, value);
    this.children.push(child);
    return this;
  };

  XMLDocType.prototype.notation = function(name, value) {
    var child;
    child = new XMLDTDNotation(this, name, value);
    this.children.push(child);
    return this;
  };

  XMLDocType.prototype.toString = function(options) {
    return this.options.writer.docType(this, this.options.writer.filterOptions(options));
  };

  XMLDocType.prototype.ele = function(name, value) {
    return this.element(name, value);
  };

  XMLDocType.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
    return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
  };

  XMLDocType.prototype.ent = function(name, value) {
    return this.entity(name, value);
  };

  XMLDocType.prototype.pent = function(name, value) {
    return this.pEntity(name, value);
  };

  XMLDocType.prototype.not = function(name, value) {
    return this.notation(name, value);
  };

  XMLDocType.prototype.up = function() {
    return this.root() || this.documentObject;
  };

  XMLDocType.prototype.isEqualNode = function(node) {
    if (!XMLDocType.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
      return false;
    }
    if (node.name !== this.name) {
      return false;
    }
    if (node.publicId !== this.publicId) {
      return false;
    }
    if (node.systemId !== this.systemId) {
      return false;
    }
    return true;
  };

  return XMLDocType;

})(XMLNode);
