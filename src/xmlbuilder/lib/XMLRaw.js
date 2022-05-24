var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

// XMLNode = require('./XMLNode');
import { XMLNode } from "./XMLNode.js";

export const XMLRaw = (function(superClass) {
  extend(XMLRaw, superClass);

  function XMLRaw(parent, text) {
    XMLRaw.__super__.constructor.call(this, parent);
    if (text == null) {
      throw new Error("Missing raw text. " + this.debugInfo());
    }
    this.type = NodeType.Raw;
    this.value = this.stringify.raw(text);
  }

  XMLRaw.prototype.clone = function() {
    return Object.create(this);
  };

  XMLRaw.prototype.toString = function(options) {
    return this.options.writer.raw(this, this.options.writer.filterOptions(options));
  };

  return XMLRaw;

})(XMLNode);
