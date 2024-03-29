var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// XMLNode = require('./XMLNode');
import { XMLNode } from "./XMLNode.js";

export const XMLCharacterData = (function(superClass) {
  extend(XMLCharacterData, superClass);

  function XMLCharacterData(parent) {
    XMLCharacterData.__super__.constructor.call(this, parent);
    this.value = '';
  }

  Object.defineProperty(XMLCharacterData.prototype, 'data', {
    get: function() {
      return this.value;
    },
    set: function(value) {
      return this.value = value || '';
    }
  });

  Object.defineProperty(XMLCharacterData.prototype, 'length', {
    get: function() {
      return this.value.length;
    }
  });

  Object.defineProperty(XMLCharacterData.prototype, 'textContent', {
    get: function() {
      return this.value;
    },
    set: function(value) {
      return this.value = value || '';
    }
  });

  XMLCharacterData.prototype.clone = function() {
    return Object.create(this);
  };

  XMLCharacterData.prototype.substringData = function(offset, count) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLCharacterData.prototype.appendData = function(arg) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLCharacterData.prototype.insertData = function(offset, arg) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLCharacterData.prototype.deleteData = function(offset, count) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLCharacterData.prototype.replaceData = function(offset, count, arg) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLCharacterData.prototype.isEqualNode = function(node) {
    if (!XMLCharacterData.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
      return false;
    }
    if (node.data !== this.data) {
      return false;
    }
    return true;
  };

  return XMLCharacterData;

})(XMLNode);
