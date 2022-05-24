var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

// XMLCharacterData = require('./XMLCharacterData');
import { XMLCharacterData } from "./XMLCharacterData.js";

export const XMLProcessingInstruction = (function(superClass) {
  extend(XMLProcessingInstruction, superClass);

  function XMLProcessingInstruction(parent, target, value) {
    XMLProcessingInstruction.__super__.constructor.call(this, parent);
    if (target == null) {
      throw new Error("Missing instruction target. " + this.debugInfo());
    }
    this.type = NodeType.ProcessingInstruction;
    this.target = this.stringify.insTarget(target);
    this.name = this.target;
    if (value) {
      this.value = this.stringify.insValue(value);
    }
  }

  XMLProcessingInstruction.prototype.clone = function() {
    return Object.create(this);
  };

  XMLProcessingInstruction.prototype.toString = function(options) {
    return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options));
  };

  XMLProcessingInstruction.prototype.isEqualNode = function(node) {
    if (!XMLProcessingInstruction.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
      return false;
    }
    if (node.target !== this.target) {
      return false;
    }
    return true;
  };

  return XMLProcessingInstruction;

})(XMLCharacterData);
