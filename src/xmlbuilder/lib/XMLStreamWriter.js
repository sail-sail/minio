var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

// NodeType = require('./NodeType');
import { NodeType } from './NodeType.js';

// XMLWriterBase = require('./XMLWriterBase');
import { XMLWriterBase } from './XMLWriterBase.js';

// WriterState = require('./WriterState');
import { WriterState } from './WriterState.js';

export const XMLStreamWriter = (function(superClass) {
  extend(XMLStreamWriter, superClass);

  function XMLStreamWriter(stream, options) {
    this.stream = stream;
    XMLStreamWriter.__super__.constructor.call(this, options);
  }

  XMLStreamWriter.prototype.endline = function(node, options, level) {
    if (node.isLastRootNode && options.state === WriterState.CloseTag) {
      return '';
    } else {
      return XMLStreamWriter.__super__.endline.call(this, node, options, level);
    }
  };

  XMLStreamWriter.prototype.document = function(doc, options) {
    var child, i, j, k, len, len1, ref, ref1, results;
    ref = doc.children;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      child = ref[i];
      child.isLastRootNode = i === doc.children.length - 1;
    }
    options = this.filterOptions(options);
    ref1 = doc.children;
    results = [];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      child = ref1[k];
      results.push(this.writeChildNode(child, options, 0));
    }
    return results;
  };

  XMLStreamWriter.prototype.attribute = function(att, options, level) {
    return this.stream.write(XMLStreamWriter.__super__.attribute.call(this, att, options, level));
  };

  XMLStreamWriter.prototype.cdata = function(node, options, level) {
    return this.stream.write(XMLStreamWriter.__super__.cdata.call(this, node, options, level));
  };

  XMLStreamWriter.prototype.comment = function(node, options, level) {
    return this.stream.write(XMLStreamWriter.__super__.comment.call(this, node, options, level));
  };

  XMLStreamWriter.prototype.declaration = function(node, options, level) {
    return this.stream.write(XMLStreamWriter.__super__.declaration.call(this, node, options, level));
  };

  XMLStreamWriter.prototype.docType = function(node, options, level) {
    var child, j, len, ref;
    level || (level = 0);
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    this.stream.write(this.indent(node, options, level));
    this.stream.write('<!DOCTYPE ' + node.root().name);
    if (node.pubID && node.sysID) {
      this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
    } else if (node.sysID) {
      this.stream.write(' SYSTEM "' + node.sysID + '"');
    }
    if (node.children.length > 0) {
      this.stream.write(' [');
      this.stream.write(this.endline(node, options, level));
      options.state = WriterState.InsideTag;
      ref = node.children;
      for (j = 0, len = ref.length; j < len; j++) {
        child = ref[j];
        this.writeChildNode(child, options, level + 1);
      }
      options.state = WriterState.CloseTag;
      this.stream.write(']');
    }
    options.state = WriterState.CloseTag;
    this.stream.write(options.spaceBeforeSlash + '>');
    this.stream.write(this.endline(node, options, level));
    options.state = WriterState.None;
    return this.closeNode(node, options, level);
  };

  XMLStreamWriter.prototype.element = function(node, options, level) {
    var att, child, childNodeCount, firstChildNode, j, len, name, prettySuppressed, ref, ref1;
    level || (level = 0);
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    this.stream.write(this.indent(node, options, level) + '<' + node.name);
    ref = node.attribs;
    for (name in ref) {
      if (!hasProp.call(ref, name)) continue;
      att = ref[name];
      this.attribute(att, options, level);
    }
    childNodeCount = node.children.length;
    firstChildNode = childNodeCount === 0 ? null : node.children[0];
    if (childNodeCount === 0 || node.children.every(function(e) {
      return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === '';
    })) {
      if (options.allowEmpty) {
        this.stream.write('>');
        options.state = WriterState.CloseTag;
        this.stream.write('</' + node.name + '>');
      } else {
        options.state = WriterState.CloseTag;
        this.stream.write(options.spaceBeforeSlash + '/>');
      }
    } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && (firstChildNode.value != null)) {
      this.stream.write('>');
      options.state = WriterState.InsideTag;
      options.suppressPrettyCount++;
      prettySuppressed = true;
      this.writeChildNode(firstChildNode, options, level + 1);
      options.suppressPrettyCount--;
      prettySuppressed = false;
      options.state = WriterState.CloseTag;
      this.stream.write('</' + node.name + '>');
    } else {
      this.stream.write('>' + this.endline(node, options, level));
      options.state = WriterState.InsideTag;
      ref1 = node.children;
      for (j = 0, len = ref1.length; j < len; j++) {
        child = ref1[j];
        this.writeChildNode(child, options, level + 1);
      }
      options.state = WriterState.CloseTag;
      this.stream.write(this.indent(node, options, level) + '</' + node.name + '>');
    }
    this.stream.write(this.endline(node, options, level));
    options.state = WriterState.None;
    return this.closeNode(node, options, level);
  };

  XMLStreamWriter.prototype.processingInstruction = function(node, options, level) {
    return this.stream.write(XMLStreamWriter.__super__.processingInstruction.call(this, node, options, level));
  };

  XMLStreamWriter.prototype.raw = function(node, options, level) {
    return this.stream.write(XMLStreamWriter.__super__.raw.call(this, node, options, level));
  };

  XMLStreamWriter.prototype.text = function(node, options, level) {
    return this.stream.write(XMLStreamWriter.__super__.text.call(this, node, options, level));
  };

  XMLStreamWriter.prototype.dtdAttList = function(node, options, level) {
    return this.stream.write(XMLStreamWriter.__super__.dtdAttList.call(this, node, options, level));
  };

  XMLStreamWriter.prototype.dtdElement = function(node, options, level) {
    return this.stream.write(XMLStreamWriter.__super__.dtdElement.call(this, node, options, level));
  };

  XMLStreamWriter.prototype.dtdEntity = function(node, options, level) {
    return this.stream.write(XMLStreamWriter.__super__.dtdEntity.call(this, node, options, level));
  };

  XMLStreamWriter.prototype.dtdNotation = function(node, options, level) {
    return this.stream.write(XMLStreamWriter.__super__.dtdNotation.call(this, node, options, level));
  };

  return XMLStreamWriter;

})(XMLWriterBase);
