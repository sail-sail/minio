var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

// XMLCharacterData = require('./XMLCharacterData');
import { XMLCharacterData } from "./XMLCharacterData.js";

export const XMLText = (function(superClass) {
  extend(XMLText, superClass);

  function XMLText(parent, text) {
    XMLText.__super__.constructor.call(this, parent);
    if (text == null) {
      throw new Error("Missing element text. " + this.debugInfo());
    }
    this.name = "#text";
    this.type = NodeType.Text;
    this.value = this.stringify.text(text);
  }

  Object.defineProperty(XMLText.prototype, 'isElementContentWhitespace', {
    get: function() {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    }
  });

  Object.defineProperty(XMLText.prototype, 'wholeText', {
    get: function() {
      var next, prev, str;
      str = '';
      prev = this.previousSibling;
      while (prev) {
        str = prev.data + str;
        prev = prev.previousSibling;
      }
      str += this.data;
      next = this.nextSibling;
      while (next) {
        str = str + next.data;
        next = next.nextSibling;
      }
      return str;
    }
  });

  XMLText.prototype.clone = function() {
    return Object.create(this);
  };

  XMLText.prototype.toString = function(options) {
    return this.options.writer.text(this, this.options.writer.filterOptions(options));
  };

  XMLText.prototype.splitText = function(offset) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  XMLText.prototype.replaceWholeText = function(content) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  };

  return XMLText;

})(XMLCharacterData);
