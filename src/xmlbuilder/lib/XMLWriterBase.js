var hasProp = {}.hasOwnProperty;

// assign = require('./Utility').assign;
import { assign } from "./Utility.js";

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

// XMLDeclaration = require('./XMLDeclaration');
import { XMLDeclaration } from "./XMLDeclaration.js";

// XMLDocType = require('./XMLDocType');
import { XMLDocType } from "./XMLDocType.js";

// XMLCData = require('./XMLCData');
import { XMLCData } from "./XMLCData.js";

// XMLComment = require('./XMLComment');
import { XMLComment } from "./XMLComment.js";

// XMLElement = require('./XMLElement');
import { XMLElement } from "./XMLElement.js";

// XMLRaw = require('./XMLRaw');
import { XMLRaw } from "./XMLRaw.js";

// XMLText = require('./XMLText');
import { XMLText } from "./XMLText.js";

// XMLProcessingInstruction = require('./XMLProcessingInstruction');
import { XMLProcessingInstruction } from "./XMLProcessingInstruction.js";

// XMLDummy = require('./XMLDummy');
import { XMLDummy } from "./XMLDummy.js";

// XMLDTDAttList = require('./XMLDTDAttList');
import { XMLDTDAttList } from "./XMLDTDAttList.js";

// XMLDTDElement = require('./XMLDTDElement');
import { XMLDTDElement } from "./XMLDTDElement.js";

// XMLDTDEntity = require('./XMLDTDEntity');
import { XMLDTDEntity } from "./XMLDTDEntity.js";

// XMLDTDNotation = require('./XMLDTDNotation');
import { XMLDTDNotation } from "./XMLDTDNotation.js";

// WriterState = require('./WriterState');
import { WriterState } from "./WriterState.js";

export const XMLWriterBase = (function() {
  function XMLWriterBase(options) {
    var key, ref, value;
    options || (options = {});
    this.options = options;
    ref = options.writer || {};
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      value = ref[key];
      this["_" + key] = this[key];
      this[key] = value;
    }
  }

  XMLWriterBase.prototype.filterOptions = function(options) {
    var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6;
    options || (options = {});
    options = assign({}, this.options, options);
    filteredOptions = {
      writer: this
    };
    filteredOptions.pretty = options.pretty || false;
    filteredOptions.allowEmpty = options.allowEmpty || false;
    filteredOptions.indent = (ref = options.indent) != null ? ref : '  ';
    filteredOptions.newline = (ref1 = options.newline) != null ? ref1 : '\n';
    filteredOptions.offset = (ref2 = options.offset) != null ? ref2 : 0;
    filteredOptions.dontPrettyTextNodes = (ref3 = (ref4 = options.dontPrettyTextNodes) != null ? ref4 : options.dontprettytextnodes) != null ? ref3 : 0;
    filteredOptions.spaceBeforeSlash = (ref5 = (ref6 = options.spaceBeforeSlash) != null ? ref6 : options.spacebeforeslash) != null ? ref5 : '';
    if (filteredOptions.spaceBeforeSlash === true) {
      filteredOptions.spaceBeforeSlash = ' ';
    }
    filteredOptions.suppressPrettyCount = 0;
    filteredOptions.user = {};
    filteredOptions.state = WriterState.None;
    return filteredOptions;
  };

  XMLWriterBase.prototype.indent = function(node, options, level) {
    var indentLevel;
    if (!options.pretty || options.suppressPrettyCount) {
      return '';
    } else if (options.pretty) {
      indentLevel = (level || 0) + options.offset + 1;
      if (indentLevel > 0) {
        return new Array(indentLevel).join(options.indent);
      }
    }
    return '';
  };

  XMLWriterBase.prototype.endline = function(node, options, level) {
    if (!options.pretty || options.suppressPrettyCount) {
      return '';
    } else {
      return options.newline;
    }
  };

  XMLWriterBase.prototype.attribute = function(att, options, level) {
    var r;
    this.openAttribute(att, options, level);
    r = ' ' + att.name + '="' + att.value + '"';
    this.closeAttribute(att, options, level);
    return r;
  };

  XMLWriterBase.prototype.cdata = function(node, options, level) {
    var r;
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    r = this.indent(node, options, level) + '<![CDATA[';
    options.state = WriterState.InsideTag;
    r += node.value;
    options.state = WriterState.CloseTag;
    r += ']]>' + this.endline(node, options, level);
    options.state = WriterState.None;
    this.closeNode(node, options, level);
    return r;
  };

  XMLWriterBase.prototype.comment = function(node, options, level) {
    var r;
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    r = this.indent(node, options, level) + '<!-- ';
    options.state = WriterState.InsideTag;
    r += node.value;
    options.state = WriterState.CloseTag;
    r += ' -->' + this.endline(node, options, level);
    options.state = WriterState.None;
    this.closeNode(node, options, level);
    return r;
  };

  XMLWriterBase.prototype.declaration = function(node, options, level) {
    var r;
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    r = this.indent(node, options, level) + '<?xml';
    options.state = WriterState.InsideTag;
    r += ' version="' + node.version + '"';
    if (node.encoding != null) {
      r += ' encoding="' + node.encoding + '"';
    }
    if (node.standalone != null) {
      r += ' standalone="' + node.standalone + '"';
    }
    options.state = WriterState.CloseTag;
    r += options.spaceBeforeSlash + '?>';
    r += this.endline(node, options, level);
    options.state = WriterState.None;
    this.closeNode(node, options, level);
    return r;
  };

  XMLWriterBase.prototype.docType = function(node, options, level) {
    var child, i, len, r, ref;
    level || (level = 0);
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    r = this.indent(node, options, level);
    r += '<!DOCTYPE ' + node.root().name;
    if (node.pubID && node.sysID) {
      r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
    } else if (node.sysID) {
      r += ' SYSTEM "' + node.sysID + '"';
    }
    if (node.children.length > 0) {
      r += ' [';
      r += this.endline(node, options, level);
      options.state = WriterState.InsideTag;
      ref = node.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        r += this.writeChildNode(child, options, level + 1);
      }
      options.state = WriterState.CloseTag;
      r += ']';
    }
    options.state = WriterState.CloseTag;
    r += options.spaceBeforeSlash + '>';
    r += this.endline(node, options, level);
    options.state = WriterState.None;
    this.closeNode(node, options, level);
    return r;
  };

  XMLWriterBase.prototype.element = function(node, options, level) {
    var att, child, childNodeCount, firstChildNode, i, j, len, len1, name, prettySuppressed, r, ref, ref1, ref2;
    level || (level = 0);
    prettySuppressed = false;
    r = '';
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    r += this.indent(node, options, level) + '<' + node.name;
    ref = node.attribs;
    for (name in ref) {
      if (!hasProp.call(ref, name)) continue;
      att = ref[name];
      r += this.attribute(att, options, level);
    }
    childNodeCount = node.children.length;
    firstChildNode = childNodeCount === 0 ? null : node.children[0];
    if (childNodeCount === 0 || node.children.every(function(e) {
      return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === '';
    })) {
      if (options.allowEmpty) {
        r += '>';
        options.state = WriterState.CloseTag;
        r += '</' + node.name + '>' + this.endline(node, options, level);
      } else {
        options.state = WriterState.CloseTag;
        r += options.spaceBeforeSlash + '/>' + this.endline(node, options, level);
      }
    } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && (firstChildNode.value != null)) {
      r += '>';
      options.state = WriterState.InsideTag;
      options.suppressPrettyCount++;
      prettySuppressed = true;
      r += this.writeChildNode(firstChildNode, options, level + 1);
      options.suppressPrettyCount--;
      prettySuppressed = false;
      options.state = WriterState.CloseTag;
      r += '</' + node.name + '>' + this.endline(node, options, level);
    } else {
      if (options.dontPrettyTextNodes) {
        ref1 = node.children;
        for (i = 0, len = ref1.length; i < len; i++) {
          child = ref1[i];
          if ((child.type === NodeType.Text || child.type === NodeType.Raw) && (child.value != null)) {
            options.suppressPrettyCount++;
            prettySuppressed = true;
            break;
          }
        }
      }
      r += '>' + this.endline(node, options, level);
      options.state = WriterState.InsideTag;
      ref2 = node.children;
      for (j = 0, len1 = ref2.length; j < len1; j++) {
        child = ref2[j];
        r += this.writeChildNode(child, options, level + 1);
      }
      options.state = WriterState.CloseTag;
      r += this.indent(node, options, level) + '</' + node.name + '>';
      if (prettySuppressed) {
        options.suppressPrettyCount--;
      }
      r += this.endline(node, options, level);
      options.state = WriterState.None;
    }
    this.closeNode(node, options, level);
    return r;
  };

  XMLWriterBase.prototype.writeChildNode = function(node, options, level) {
    switch (node.type) {
      case NodeType.CData:
        return this.cdata(node, options, level);
      case NodeType.Comment:
        return this.comment(node, options, level);
      case NodeType.Element:
        return this.element(node, options, level);
      case NodeType.Raw:
        return this.raw(node, options, level);
      case NodeType.Text:
        return this.text(node, options, level);
      case NodeType.ProcessingInstruction:
        return this.processingInstruction(node, options, level);
      case NodeType.Dummy:
        return '';
      case NodeType.Declaration:
        return this.declaration(node, options, level);
      case NodeType.DocType:
        return this.docType(node, options, level);
      case NodeType.AttributeDeclaration:
        return this.dtdAttList(node, options, level);
      case NodeType.ElementDeclaration:
        return this.dtdElement(node, options, level);
      case NodeType.EntityDeclaration:
        return this.dtdEntity(node, options, level);
      case NodeType.NotationDeclaration:
        return this.dtdNotation(node, options, level);
      default:
        throw new Error("Unknown XML node type: " + node.constructor.name);
    }
  };

  XMLWriterBase.prototype.processingInstruction = function(node, options, level) {
    var r;
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    r = this.indent(node, options, level) + '<?';
    options.state = WriterState.InsideTag;
    r += node.target;
    if (node.value) {
      r += ' ' + node.value;
    }
    options.state = WriterState.CloseTag;
    r += options.spaceBeforeSlash + '?>';
    r += this.endline(node, options, level);
    options.state = WriterState.None;
    this.closeNode(node, options, level);
    return r;
  };

  XMLWriterBase.prototype.raw = function(node, options, level) {
    var r;
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    r = this.indent(node, options, level);
    options.state = WriterState.InsideTag;
    r += node.value;
    options.state = WriterState.CloseTag;
    r += this.endline(node, options, level);
    options.state = WriterState.None;
    this.closeNode(node, options, level);
    return r;
  };

  XMLWriterBase.prototype.text = function(node, options, level) {
    var r;
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    r = this.indent(node, options, level);
    options.state = WriterState.InsideTag;
    r += node.value;
    options.state = WriterState.CloseTag;
    r += this.endline(node, options, level);
    options.state = WriterState.None;
    this.closeNode(node, options, level);
    return r;
  };

  XMLWriterBase.prototype.dtdAttList = function(node, options, level) {
    var r;
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    r = this.indent(node, options, level) + '<!ATTLIST';
    options.state = WriterState.InsideTag;
    r += ' ' + node.elementName + ' ' + node.attributeName + ' ' + node.attributeType;
    if (node.defaultValueType !== '#DEFAULT') {
      r += ' ' + node.defaultValueType;
    }
    if (node.defaultValue) {
      r += ' "' + node.defaultValue + '"';
    }
    options.state = WriterState.CloseTag;
    r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
    options.state = WriterState.None;
    this.closeNode(node, options, level);
    return r;
  };

  XMLWriterBase.prototype.dtdElement = function(node, options, level) {
    var r;
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    r = this.indent(node, options, level) + '<!ELEMENT';
    options.state = WriterState.InsideTag;
    r += ' ' + node.name + ' ' + node.value;
    options.state = WriterState.CloseTag;
    r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
    options.state = WriterState.None;
    this.closeNode(node, options, level);
    return r;
  };

  XMLWriterBase.prototype.dtdEntity = function(node, options, level) {
    var r;
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    r = this.indent(node, options, level) + '<!ENTITY';
    options.state = WriterState.InsideTag;
    if (node.pe) {
      r += ' %';
    }
    r += ' ' + node.name;
    if (node.value) {
      r += ' "' + node.value + '"';
    } else {
      if (node.pubID && node.sysID) {
        r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
      } else if (node.sysID) {
        r += ' SYSTEM "' + node.sysID + '"';
      }
      if (node.nData) {
        r += ' NDATA ' + node.nData;
      }
    }
    options.state = WriterState.CloseTag;
    r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
    options.state = WriterState.None;
    this.closeNode(node, options, level);
    return r;
  };

  XMLWriterBase.prototype.dtdNotation = function(node, options, level) {
    var r;
    this.openNode(node, options, level);
    options.state = WriterState.OpenTag;
    r = this.indent(node, options, level) + '<!NOTATION';
    options.state = WriterState.InsideTag;
    r += ' ' + node.name;
    if (node.pubID && node.sysID) {
      r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
    } else if (node.pubID) {
      r += ' PUBLIC "' + node.pubID + '"';
    } else if (node.sysID) {
      r += ' SYSTEM "' + node.sysID + '"';
    }
    options.state = WriterState.CloseTag;
    r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
    options.state = WriterState.None;
    this.closeNode(node, options, level);
    return r;
  };

  XMLWriterBase.prototype.openNode = function(node, options, level) {};

  XMLWriterBase.prototype.closeNode = function(node, options, level) {};

  XMLWriterBase.prototype.openAttribute = function(att, options, level) {};

  XMLWriterBase.prototype.closeAttribute = function(att, options, level) {};

  return XMLWriterBase;

})();
