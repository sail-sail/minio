var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

// XMLCharacterData = require('./XMLCharacterData');
import { XMLCharacterData } from "./XMLCharacterData.js";

export const XMLComment = (function(superClass) {
  extend(XMLComment, superClass);

  function XMLComment(parent, text) {
    XMLComment.__super__.constructor.call(this, parent);
    if (text == null) {
      throw new Error("Missing comment text. " + this.debugInfo());
    }
    this.name = "#comment";
    this.type = NodeType.Comment;
    this.value = this.stringify.comment(text);
  }

  XMLComment.prototype.clone = function() {
    return Object.create(this);
  };

  XMLComment.prototype.toString = function(options) {
    return this.options.writer.comment(this, this.options.writer.filterOptions(options));
  };

  return XMLComment;

})(XMLCharacterData);

