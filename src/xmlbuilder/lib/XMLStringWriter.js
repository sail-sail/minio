var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// XMLWriterBase = require('./XMLWriterBase');
import { XMLWriterBase } from "./XMLWriterBase.js";

export const XMLStringWriter = (function(superClass) {
  extend(XMLStringWriter, superClass);

  function XMLStringWriter(options) {
    XMLStringWriter.__super__.constructor.call(this, options);
  }

  XMLStringWriter.prototype.document = function(doc, options) {
    var child, i, len, r, ref;
    options = this.filterOptions(options);
    r = '';
    ref = doc.children;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      r += this.writeChildNode(child, options, 0);
    }
    if (options.pretty && r.slice(-options.newline.length) === options.newline) {
      r = r.slice(0, -options.newline.length);
    }
    return r;
  };

  return XMLStringWriter;

})(XMLWriterBase);
