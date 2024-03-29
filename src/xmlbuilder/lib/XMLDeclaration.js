
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// isObject = require('./Utility').isObject;
import { isObject } from "./Utility.js";

// XMLNode = require('./XMLNode');
import { XMLNode } from "./XMLNode.js";

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

export const XMLDeclaration = (function(superClass) {
  extend(XMLDeclaration, superClass);

  function XMLDeclaration(parent, version, encoding, standalone) {
    var ref;
    XMLDeclaration.__super__.constructor.call(this, parent);
    if (isObject(version)) {
      ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
    }
    if (!version) {
      version = '1.0';
    }
    this.type = NodeType.Declaration;
    this.version = this.stringify.xmlVersion(version);
    if (encoding != null) {
      this.encoding = this.stringify.xmlEncoding(encoding);
    }
    if (standalone != null) {
      this.standalone = this.stringify.xmlStandalone(standalone);
    }
  }

  XMLDeclaration.prototype.toString = function(options) {
    return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
  };

  return XMLDeclaration;

})(XMLNode);
