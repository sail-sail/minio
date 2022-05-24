var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// XMLNode = require('./XMLNode');
import { XMLNode } from "./XMLNode.js";

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

export const XMLDummy = (function(superClass) {
  extend(XMLDummy, superClass);

  function XMLDummy(parent) {
    XMLDummy.__super__.constructor.call(this, parent);
    this.type = NodeType.Dummy;
  }

  XMLDummy.prototype.clone = function() {
    return Object.create(this);
  };

  XMLDummy.prototype.toString = function(options) {
    return '';
  };

  return XMLDummy;

})(XMLNode);
