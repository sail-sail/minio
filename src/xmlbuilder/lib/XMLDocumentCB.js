import { isObject, isPlainObject, getValue, isFunction } from "./Utility.js";
import { NodeType } from "./NodeType.js";
import { XMLDocument } from "./XMLDocument.js";
import { XMLElement } from "./XMLElement.js";
import { XMLCData } from "./XMLCData.js";
import { XMLComment } from "./XMLComment.js";
import { XMLRaw } from "./XMLRaw.js";
import { XMLText } from "./XMLText.js";
import { XMLProcessingInstruction } from "./XMLProcessingInstruction.js";
import { XMLDeclaration } from "./XMLDeclaration.js";
import { XMLDocType } from "./XMLDocType.js";
import { XMLDTDAttList } from "./XMLDTDAttList.js";
import { XMLDTDEntity } from "./XMLDTDEntity.js";
import { XMLDTDElement } from "./XMLDTDElement.js";
import { XMLDTDNotation } from "./XMLDTDNotation.js";
import { XMLAttribute } from "./XMLAttribute.js";
import { XMLStringifier } from "./XMLStringifier.js";
import { XMLStringWriter } from "./XMLStringWriter.js";
import { WriterState } from "./WriterState.js";

var hasProp = {}.hasOwnProperty;

export function XMLDocumentCB(options, onData, onEnd) {
  var writerOptions;
  this.name = "?xml";
  this.type = NodeType.Document;
  options || (options = {});
  writerOptions = {};
  if (!options.writer) {
    options.writer = new XMLStringWriter();
  } else if (isPlainObject(options.writer)) {
    writerOptions = options.writer;
    options.writer = new XMLStringWriter();
  }
  this.options = options;
  this.writer = options.writer;
  this.writerOptions = this.writer.filterOptions(writerOptions);
  this.stringify = new XMLStringifier(options);
  this.onDataCallback = onData || function() {};
  this.onEndCallback = onEnd || function() {};
  this.currentNode = null;
  this.currentLevel = -1;
  this.openTags = {};
  this.documentStarted = false;
  this.documentCompleted = false;
  this.root = null;
}

XMLDocumentCB.prototype.createChildNode = function(node) {
  var att, attName, attributes, child, i, len, ref1, ref2;
  switch (node.type) {
    case NodeType.CData:
      this.cdata(node.value);
      break;
    case NodeType.Comment:
      this.comment(node.value);
      break;
    case NodeType.Element:
      attributes = {};
      ref1 = node.attribs;
      for (attName in ref1) {
        if (!hasProp.call(ref1, attName)) continue;
        att = ref1[attName];
        attributes[attName] = att.value;
      }
      this.node(node.name, attributes);
      break;
    case NodeType.Dummy:
      this.dummy();
      break;
    case NodeType.Raw:
      this.raw(node.value);
      break;
    case NodeType.Text:
      this.text(node.value);
      break;
    case NodeType.ProcessingInstruction:
      this.instruction(node.target, node.value);
      break;
    default:
      throw new Error("This XML node type is not supported in a JS object: " + node.constructor.name);
  }
  ref2 = node.children;
  for (i = 0, len = ref2.length; i < len; i++) {
    child = ref2[i];
    this.createChildNode(child);
    if (child.type === NodeType.Element) {
      this.up();
    }
  }
  return this;
};

XMLDocumentCB.prototype.dummy = function() {
  return this;
};

XMLDocumentCB.prototype.node = function(name, attributes, text) {
  var ref1;
  if (name == null) {
    throw new Error("Missing node name.");
  }
  if (this.root && this.currentLevel === -1) {
    throw new Error("Document can only have one root node. " + this.debugInfo(name));
  }
  this.openCurrent();
  name = getValue(name);
  if (attributes == null) {
    attributes = {};
  }
  attributes = getValue(attributes);
  if (!isObject(attributes)) {
    ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
  }
  this.currentNode = new XMLElement(this, name, attributes);
  this.currentNode.children = false;
  this.currentLevel++;
  this.openTags[this.currentLevel] = this.currentNode;
  if (text != null) {
    this.text(text);
  }
  return this;
};

XMLDocumentCB.prototype.element = function(name, attributes, text) {
  var child, i, len, oldValidationFlag, ref1, root;
  if (this.currentNode && this.currentNode.type === NodeType.DocType) {
    this.dtdElement.apply(this, arguments);
  } else {
    if (Array.isArray(name) || isObject(name) || isFunction(name)) {
      oldValidationFlag = this.options.noValidation;
      this.options.noValidation = true;
      root = new XMLDocument(this.options).element('TEMP_ROOT');
      root.element(name);
      this.options.noValidation = oldValidationFlag;
      ref1 = root.children;
      for (i = 0, len = ref1.length; i < len; i++) {
        child = ref1[i];
        this.createChildNode(child);
        if (child.type === NodeType.Element) {
          this.up();
        }
      }
    } else {
      this.node(name, attributes, text);
    }
  }
  return this;
};

XMLDocumentCB.prototype.attribute = function(name, value) {
  var attName, attValue;
  if (!this.currentNode || this.currentNode.children) {
    throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
  }
  if (name != null) {
    name = getValue(name);
  }
  if (isObject(name)) {
    for (attName in name) {
      if (!hasProp.call(name, attName)) continue;
      attValue = name[attName];
      this.attribute(attName, attValue);
    }
  } else {
    if (isFunction(value)) {
      value = value.apply();
    }
    if (this.options.keepNullAttributes && (value == null)) {
      this.currentNode.attribs[name] = new XMLAttribute(this, name, "");
    } else if (value != null) {
      this.currentNode.attribs[name] = new XMLAttribute(this, name, value);
    }
  }
  return this;
};

XMLDocumentCB.prototype.text = function(value) {
  var node;
  this.openCurrent();
  node = new XMLText(this, value);
  this.onData(this.writer.text(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
  return this;
};

XMLDocumentCB.prototype.cdata = function(value) {
  var node;
  this.openCurrent();
  node = new XMLCData(this, value);
  this.onData(this.writer.cdata(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
  return this;
};

XMLDocumentCB.prototype.comment = function(value) {
  var node;
  this.openCurrent();
  node = new XMLComment(this, value);
  this.onData(this.writer.comment(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
  return this;
};

XMLDocumentCB.prototype.raw = function(value) {
  var node;
  this.openCurrent();
  node = new XMLRaw(this, value);
  this.onData(this.writer.raw(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
  return this;
};

XMLDocumentCB.prototype.instruction = function(target, value) {
  var i, insTarget, insValue, len, node;
  this.openCurrent();
  if (target != null) {
    target = getValue(target);
  }
  if (value != null) {
    value = getValue(value);
  }
  if (Array.isArray(target)) {
    for (i = 0, len = target.length; i < len; i++) {
      insTarget = target[i];
      this.instruction(insTarget);
    }
  } else if (isObject(target)) {
    for (insTarget in target) {
      if (!hasProp.call(target, insTarget)) continue;
      insValue = target[insTarget];
      this.instruction(insTarget, insValue);
    }
  } else {
    if (isFunction(value)) {
      value = value.apply();
    }
    node = new XMLProcessingInstruction(this, target, value);
    this.onData(this.writer.processingInstruction(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
  }
  return this;
};

XMLDocumentCB.prototype.declaration = function(version, encoding, standalone) {
  var node;
  this.openCurrent();
  if (this.documentStarted) {
    throw new Error("declaration() must be the first node.");
  }
  node = new XMLDeclaration(this, version, encoding, standalone);
  this.onData(this.writer.declaration(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
  return this;
};

XMLDocumentCB.prototype.doctype = function(root, pubID, sysID) {
  this.openCurrent();
  if (root == null) {
    throw new Error("Missing root node name.");
  }
  if (this.root) {
    throw new Error("dtd() must come before the root node.");
  }
  this.currentNode = new XMLDocType(this, pubID, sysID);
  this.currentNode.rootNodeName = root;
  this.currentNode.children = false;
  this.currentLevel++;
  this.openTags[this.currentLevel] = this.currentNode;
  return this;
};

XMLDocumentCB.prototype.dtdElement = function(name, value) {
  var node;
  this.openCurrent();
  node = new XMLDTDElement(this, name, value);
  this.onData(this.writer.dtdElement(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
  return this;
};

XMLDocumentCB.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
  var node;
  this.openCurrent();
  node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
  this.onData(this.writer.dtdAttList(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
  return this;
};

XMLDocumentCB.prototype.entity = function(name, value) {
  var node;
  this.openCurrent();
  node = new XMLDTDEntity(this, false, name, value);
  this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
  return this;
};

XMLDocumentCB.prototype.pEntity = function(name, value) {
  var node;
  this.openCurrent();
  node = new XMLDTDEntity(this, true, name, value);
  this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
  return this;
};

XMLDocumentCB.prototype.notation = function(name, value) {
  var node;
  this.openCurrent();
  node = new XMLDTDNotation(this, name, value);
  this.onData(this.writer.dtdNotation(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
  return this;
};

XMLDocumentCB.prototype.up = function() {
  if (this.currentLevel < 0) {
    throw new Error("The document node has no parent.");
  }
  if (this.currentNode) {
    if (this.currentNode.children) {
      this.closeNode(this.currentNode);
    } else {
      this.openNode(this.currentNode);
    }
    this.currentNode = null;
  } else {
    this.closeNode(this.openTags[this.currentLevel]);
  }
  delete this.openTags[this.currentLevel];
  this.currentLevel--;
  return this;
};

XMLDocumentCB.prototype.end = function() {
  while (this.currentLevel >= 0) {
    this.up();
  }
  return this.onEnd();
};

XMLDocumentCB.prototype.openCurrent = function() {
  if (this.currentNode) {
    this.currentNode.children = true;
    return this.openNode(this.currentNode);
  }
};

XMLDocumentCB.prototype.openNode = function(node) {
  var att, chunk, name, ref1;
  if (!node.isOpen) {
    if (!this.root && this.currentLevel === 0 && node.type === NodeType.Element) {
      this.root = node;
    }
    chunk = '';
    if (node.type === NodeType.Element) {
      this.writerOptions.state = WriterState.OpenTag;
      chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '<' + node.name;
      ref1 = node.attribs;
      for (name in ref1) {
        if (!hasProp.call(ref1, name)) continue;
        att = ref1[name];
        chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
      }
      chunk += (node.children ? '>' : '/>') + this.writer.endline(node, this.writerOptions, this.currentLevel);
      this.writerOptions.state = WriterState.InsideTag;
    } else {
      this.writerOptions.state = WriterState.OpenTag;
      chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '<!DOCTYPE ' + node.rootNodeName;
      if (node.pubID && node.sysID) {
        chunk += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
      } else if (node.sysID) {
        chunk += ' SYSTEM "' + node.sysID + '"';
      }
      if (node.children) {
        chunk += ' [';
        this.writerOptions.state = WriterState.InsideTag;
      } else {
        this.writerOptions.state = WriterState.CloseTag;
        chunk += '>';
      }
      chunk += this.writer.endline(node, this.writerOptions, this.currentLevel);
    }
    this.onData(chunk, this.currentLevel);
    return node.isOpen = true;
  }
};

XMLDocumentCB.prototype.closeNode = function(node) {
  var chunk;
  if (!node.isClosed) {
    chunk = '';
    this.writerOptions.state = WriterState.CloseTag;
    if (node.type === NodeType.Element) {
      chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '</' + node.name + '>' + this.writer.endline(node, this.writerOptions, this.currentLevel);
    } else {
      chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + ']>' + this.writer.endline(node, this.writerOptions, this.currentLevel);
    }
    this.writerOptions.state = WriterState.None;
    this.onData(chunk, this.currentLevel);
    return node.isClosed = true;
  }
};

XMLDocumentCB.prototype.onData = function(chunk, level) {
  this.documentStarted = true;
  return this.onDataCallback(chunk, level + 1);
};

XMLDocumentCB.prototype.onEnd = function() {
  this.documentCompleted = true;
  return this.onEndCallback();
};

XMLDocumentCB.prototype.debugInfo = function(name) {
  if (name == null) {
    return "";
  } else {
    return "node: <" + name + ">";
  }
};

XMLDocumentCB.prototype.ele = function() {
  return this.element.apply(this, arguments);
};

XMLDocumentCB.prototype.nod = function(name, attributes, text) {
  return this.node(name, attributes, text);
};

XMLDocumentCB.prototype.txt = function(value) {
  return this.text(value);
};

XMLDocumentCB.prototype.dat = function(value) {
  return this.cdata(value);
};

XMLDocumentCB.prototype.com = function(value) {
  return this.comment(value);
};

XMLDocumentCB.prototype.ins = function(target, value) {
  return this.instruction(target, value);
};

XMLDocumentCB.prototype.dec = function(version, encoding, standalone) {
  return this.declaration(version, encoding, standalone);
};

XMLDocumentCB.prototype.dtd = function(root, pubID, sysID) {
  return this.doctype(root, pubID, sysID);
};

XMLDocumentCB.prototype.e = function(name, attributes, text) {
  return this.element(name, attributes, text);
};

XMLDocumentCB.prototype.n = function(name, attributes, text) {
  return this.node(name, attributes, text);
};

XMLDocumentCB.prototype.t = function(value) {
  return this.text(value);
};

XMLDocumentCB.prototype.d = function(value) {
  return this.cdata(value);
};

XMLDocumentCB.prototype.c = function(value) {
  return this.comment(value);
};

XMLDocumentCB.prototype.r = function(value) {
  return this.raw(value);
};

XMLDocumentCB.prototype.i = function(target, value) {
  return this.instruction(target, value);
};

XMLDocumentCB.prototype.att = function() {
  if (this.currentNode && this.currentNode.type === NodeType.DocType) {
    return this.attList.apply(this, arguments);
  } else {
    return this.attribute.apply(this, arguments);
  }
};

XMLDocumentCB.prototype.a = function() {
  if (this.currentNode && this.currentNode.type === NodeType.DocType) {
    return this.attList.apply(this, arguments);
  } else {
    return this.attribute.apply(this, arguments);
  }
};

XMLDocumentCB.prototype.ent = function(name, value) {
  return this.entity(name, value);
};

XMLDocumentCB.prototype.pent = function(name, value) {
  return this.pEntity(name, value);
};

XMLDocumentCB.prototype.not = function(name, value) {
  return this.notation(name, value);
};
