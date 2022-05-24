var getValue, isEmpty, isFunction, isObject,
  hasProp = {}.hasOwnProperty;

// ref1 = require('./Utility'), 
import * as ref1 from "./Utility.js";
isObject = ref1.isObject, isFunction = ref1.isFunction, isEmpty = ref1.isEmpty, getValue = ref1.getValue;

// XMLElement = require('./XMLElement');
import { XMLElement } from "./XMLElement.js";
// XMLCData = require('./XMLCData');
import { XMLCData } from "./XMLCData.js";

// XMLComment = require('./XMLComment');
import { XMLComment } from "./XMLComment.js";

// XMLDeclaration = require('./XMLDeclaration');
import { XMLDeclaration } from "./XMLDeclaration.js";

// XMLDocType = require('./XMLDocType');
import { XMLDocType } from "./XMLDocType.js";

// XMLRaw = require('./XMLRaw');
import { XMLRaw } from "./XMLRaw.js";

// XMLText = require('./XMLText');
import { XMLText } from "./XMLText.js";

// XMLProcessingInstruction = require('./XMLProcessingInstruction');
import { XMLProcessingInstruction } from "./XMLProcessingInstruction.js";

// XMLDummy = require('./XMLDummy');
import { XMLDummy } from "./XMLDummy.js";

// NodeType = require('./NodeType');
import { NodeType } from "./NodeType.js";

// XMLNodeList = require('./XMLNodeList');
import { XMLNodeList } from "./XMLNodeList.js";

// XMLNamedNodeMap = require('./XMLNamedNodeMap');
import { XMLNamedNodeMap } from "./XMLNamedNodeMap.js";

// DocumentPosition = require('./DocumentPosition');
import { DocumentPosition } from "./DocumentPosition.js";

export function XMLNode(parent1) {
  this.parent = parent1;
  if (this.parent) {
    this.options = this.parent.options;
    this.stringify = this.parent.stringify;
  }
  this.value = null;
  this.children = [];
  this.baseURI = null;
  // if (!XMLElement) {
  //   XMLElement = require('./XMLElement');
  //   XMLCData = require('./XMLCData');
  //   XMLComment = require('./XMLComment');
  //   XMLDeclaration = require('./XMLDeclaration');
  //   XMLDocType = require('./XMLDocType');
  //   XMLRaw = require('./XMLRaw');
  //   XMLText = require('./XMLText');
  //   XMLProcessingInstruction = require('./XMLProcessingInstruction');
  //   XMLDummy = require('./XMLDummy');
  //   NodeType = require('./NodeType');
  //   XMLNodeList = require('./XMLNodeList');
  //   XMLNamedNodeMap = require('./XMLNamedNodeMap');
  //   DocumentPosition = require('./DocumentPosition');
  // }
}

Object.defineProperty(XMLNode.prototype, 'nodeName', {
  get: function() {
    return this.name;
  }
});

Object.defineProperty(XMLNode.prototype, 'nodeType', {
  get: function() {
    return this.type;
  }
});

Object.defineProperty(XMLNode.prototype, 'nodeValue', {
  get: function() {
    return this.value;
  }
});

Object.defineProperty(XMLNode.prototype, 'parentNode', {
  get: function() {
    return this.parent;
  }
});

Object.defineProperty(XMLNode.prototype, 'childNodes', {
  get: function() {
    if (!this.childNodeList || !this.childNodeList.nodes) {
      this.childNodeList = new XMLNodeList(this.children);
    }
    return this.childNodeList;
  }
});

Object.defineProperty(XMLNode.prototype, 'firstChild', {
  get: function() {
    return this.children[0] || null;
  }
});

Object.defineProperty(XMLNode.prototype, 'lastChild', {
  get: function() {
    return this.children[this.children.length - 1] || null;
  }
});

Object.defineProperty(XMLNode.prototype, 'previousSibling', {
  get: function() {
    var i;
    i = this.parent.children.indexOf(this);
    return this.parent.children[i - 1] || null;
  }
});

Object.defineProperty(XMLNode.prototype, 'nextSibling', {
  get: function() {
    var i;
    i = this.parent.children.indexOf(this);
    return this.parent.children[i + 1] || null;
  }
});

Object.defineProperty(XMLNode.prototype, 'ownerDocument', {
  get: function() {
    return this.document() || null;
  }
});

Object.defineProperty(XMLNode.prototype, 'textContent', {
  get: function() {
    var child, j, len, ref2, str;
    if (this.nodeType === NodeType.Element || this.nodeType === NodeType.DocumentFragment) {
      str = '';
      ref2 = this.children;
      for (j = 0, len = ref2.length; j < len; j++) {
        child = ref2[j];
        if (child.textContent) {
          str += child.textContent;
        }
      }
      return str;
    } else {
      return null;
    }
  },
  set: function(value) {
    throw new Error("This DOM method is not implemented." + this.debugInfo());
  }
});

XMLNode.prototype.setParent = function(parent) {
  var child, j, len, ref2, results;
  this.parent = parent;
  if (parent) {
    this.options = parent.options;
    this.stringify = parent.stringify;
  }
  ref2 = this.children;
  results = [];
  for (j = 0, len = ref2.length; j < len; j++) {
    child = ref2[j];
    results.push(child.setParent(this));
  }
  return results;
};

XMLNode.prototype.element = function(name, attributes, text) {
  var childNode, item, j, k, key, lastChild, len, len1, ref2, ref3, val;
  lastChild = null;
  if (attributes === null && (text == null)) {
    ref2 = [{}, null], attributes = ref2[0], text = ref2[1];
  }
  if (attributes == null) {
    attributes = {};
  }
  attributes = getValue(attributes);
  if (!isObject(attributes)) {
    ref3 = [attributes, text], text = ref3[0], attributes = ref3[1];
  }
  if (name != null) {
    name = getValue(name);
  }
  if (Array.isArray(name)) {
    for (j = 0, len = name.length; j < len; j++) {
      item = name[j];
      lastChild = this.element(item);
    }
  } else if (isFunction(name)) {
    lastChild = this.element(name.apply());
  } else if (isObject(name)) {
    for (key in name) {
      if (!hasProp.call(name, key)) continue;
      val = name[key];
      if (isFunction(val)) {
        val = val.apply();
      }
      if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
        lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
      } else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty(val)) {
        lastChild = this.dummy();
      } else if (isObject(val) && isEmpty(val)) {
        lastChild = this.element(key);
      } else if (!this.options.keepNullNodes && (val == null)) {
        lastChild = this.dummy();
      } else if (!this.options.separateArrayItems && Array.isArray(val)) {
        for (k = 0, len1 = val.length; k < len1; k++) {
          item = val[k];
          childNode = {};
          childNode[key] = item;
          lastChild = this.element(childNode);
        }
      } else if (isObject(val)) {
        if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
          lastChild = this.element(val);
        } else {
          lastChild = this.element(key);
          lastChild.element(val);
        }
      } else {
        lastChild = this.element(key, val);
      }
    }
  } else if (!this.options.keepNullNodes && text === null) {
    lastChild = this.dummy();
  } else {
    if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
      lastChild = this.text(text);
    } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
      lastChild = this.cdata(text);
    } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
      lastChild = this.comment(text);
    } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
      lastChild = this.raw(text);
    } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
      lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
    } else {
      lastChild = this.node(name, attributes, text);
    }
  }
  if (lastChild == null) {
    throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
  }
  return lastChild;
};

XMLNode.prototype.insertBefore = function(name, attributes, text) {
  var child, i, newChild, refChild, removed;
  if (name != null ? name.type : void 0) {
    newChild = name;
    refChild = attributes;
    newChild.setParent(this);
    if (refChild) {
      i = children.indexOf(refChild);
      removed = children.splice(i);
      children.push(newChild);
      Array.prototype.push.apply(children, removed);
    } else {
      children.push(newChild);
    }
    return newChild;
  } else {
    if (this.isRoot) {
      throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
    }
    i = this.parent.children.indexOf(this);
    removed = this.parent.children.splice(i);
    child = this.parent.element(name, attributes, text);
    Array.prototype.push.apply(this.parent.children, removed);
    return child;
  }
};

XMLNode.prototype.insertAfter = function(name, attributes, text) {
  var child, i, removed;
  if (this.isRoot) {
    throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
  }
  i = this.parent.children.indexOf(this);
  removed = this.parent.children.splice(i + 1);
  child = this.parent.element(name, attributes, text);
  Array.prototype.push.apply(this.parent.children, removed);
  return child;
};

XMLNode.prototype.remove = function() {
  var i, ref2;
  if (this.isRoot) {
    throw new Error("Cannot remove the root element. " + this.debugInfo());
  }
  i = this.parent.children.indexOf(this);
  [].splice.apply(this.parent.children, [i, i - i + 1].concat(ref2 = [])), ref2;
  return this.parent;
};

XMLNode.prototype.node = function(name, attributes, text) {
  var child, ref2;
  if (name != null) {
    name = getValue(name);
  }
  attributes || (attributes = {});
  attributes = getValue(attributes);
  if (!isObject(attributes)) {
    ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
  }
  child = new XMLElement(this, name, attributes);
  if (text != null) {
    child.text(text);
  }
  this.children.push(child);
  return child;
};

XMLNode.prototype.text = function(value) {
  var child;
  if (isObject(value)) {
    this.element(value);
  }
  child = new XMLText(this, value);
  this.children.push(child);
  return this;
};

XMLNode.prototype.cdata = function(value) {
  var child;
  child = new XMLCData(this, value);
  this.children.push(child);
  return this;
};

XMLNode.prototype.comment = function(value) {
  var child;
  child = new XMLComment(this, value);
  this.children.push(child);
  return this;
};

XMLNode.prototype.commentBefore = function(value) {
  var child, i, removed;
  i = this.parent.children.indexOf(this);
  removed = this.parent.children.splice(i);
  child = this.parent.comment(value);
  Array.prototype.push.apply(this.parent.children, removed);
  return this;
};

XMLNode.prototype.commentAfter = function(value) {
  var child, i, removed;
  i = this.parent.children.indexOf(this);
  removed = this.parent.children.splice(i + 1);
  child = this.parent.comment(value);
  Array.prototype.push.apply(this.parent.children, removed);
  return this;
};

XMLNode.prototype.raw = function(value) {
  var child;
  child = new XMLRaw(this, value);
  this.children.push(child);
  return this;
};

XMLNode.prototype.dummy = function() {
  var child;
  child = new XMLDummy(this);
  return child;
};

XMLNode.prototype.instruction = function(target, value) {
  var insTarget, insValue, instruction, j, len;
  if (target != null) {
    target = getValue(target);
  }
  if (value != null) {
    value = getValue(value);
  }
  if (Array.isArray(target)) {
    for (j = 0, len = target.length; j < len; j++) {
      insTarget = target[j];
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
    instruction = new XMLProcessingInstruction(this, target, value);
    this.children.push(instruction);
  }
  return this;
};

XMLNode.prototype.instructionBefore = function(target, value) {
  var child, i, removed;
  i = this.parent.children.indexOf(this);
  removed = this.parent.children.splice(i);
  child = this.parent.instruction(target, value);
  Array.prototype.push.apply(this.parent.children, removed);
  return this;
};

XMLNode.prototype.instructionAfter = function(target, value) {
  var child, i, removed;
  i = this.parent.children.indexOf(this);
  removed = this.parent.children.splice(i + 1);
  child = this.parent.instruction(target, value);
  Array.prototype.push.apply(this.parent.children, removed);
  return this;
};

XMLNode.prototype.declaration = function(version, encoding, standalone) {
  var doc, xmldec;
  doc = this.document();
  xmldec = new XMLDeclaration(doc, version, encoding, standalone);
  if (doc.children.length === 0) {
    doc.children.unshift(xmldec);
  } else if (doc.children[0].type === NodeType.Declaration) {
    doc.children[0] = xmldec;
  } else {
    doc.children.unshift(xmldec);
  }
  return doc.root() || doc;
};

XMLNode.prototype.dtd = function(pubID, sysID) {
  var child, doc, doctype, i, j, k, len, len1, ref2, ref3;
  doc = this.document();
  doctype = new XMLDocType(doc, pubID, sysID);
  ref2 = doc.children;
  for (i = j = 0, len = ref2.length; j < len; i = ++j) {
    child = ref2[i];
    if (child.type === NodeType.DocType) {
      doc.children[i] = doctype;
      return doctype;
    }
  }
  ref3 = doc.children;
  for (i = k = 0, len1 = ref3.length; k < len1; i = ++k) {
    child = ref3[i];
    if (child.isRoot) {
      doc.children.splice(i, 0, doctype);
      return doctype;
    }
  }
  doc.children.push(doctype);
  return doctype;
};

XMLNode.prototype.up = function() {
  if (this.isRoot) {
    throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
  }
  return this.parent;
};

XMLNode.prototype.root = function() {
  var node;
  node = this;
  while (node) {
    if (node.type === NodeType.Document) {
      return node.rootObject;
    } else if (node.isRoot) {
      return node;
    } else {
      node = node.parent;
    }
  }
};

XMLNode.prototype.document = function() {
  var node;
  node = this;
  while (node) {
    if (node.type === NodeType.Document) {
      return node;
    } else {
      node = node.parent;
    }
  }
};

XMLNode.prototype.end = function(options) {
  return this.document().end(options);
};

XMLNode.prototype.prev = function() {
  var i;
  i = this.parent.children.indexOf(this);
  if (i < 1) {
    throw new Error("Already at the first node. " + this.debugInfo());
  }
  return this.parent.children[i - 1];
};

XMLNode.prototype.next = function() {
  var i;
  i = this.parent.children.indexOf(this);
  if (i === -1 || i === this.parent.children.length - 1) {
    throw new Error("Already at the last node. " + this.debugInfo());
  }
  return this.parent.children[i + 1];
};

XMLNode.prototype.importDocument = function(doc) {
  var clonedRoot;
  clonedRoot = doc.root().clone();
  clonedRoot.parent = this;
  clonedRoot.isRoot = false;
  this.children.push(clonedRoot);
  return this;
};

XMLNode.prototype.debugInfo = function(name) {
  var ref2, ref3;
  name = name || this.name;
  if ((name == null) && !((ref2 = this.parent) != null ? ref2.name : void 0)) {
    return "";
  } else if (name == null) {
    return "parent: <" + this.parent.name + ">";
  } else if (!((ref3 = this.parent) != null ? ref3.name : void 0)) {
    return "node: <" + name + ">";
  } else {
    return "node: <" + name + ">, parent: <" + this.parent.name + ">";
  }
};

XMLNode.prototype.ele = function(name, attributes, text) {
  return this.element(name, attributes, text);
};

XMLNode.prototype.nod = function(name, attributes, text) {
  return this.node(name, attributes, text);
};

XMLNode.prototype.txt = function(value) {
  return this.text(value);
};

XMLNode.prototype.dat = function(value) {
  return this.cdata(value);
};

XMLNode.prototype.com = function(value) {
  return this.comment(value);
};

XMLNode.prototype.ins = function(target, value) {
  return this.instruction(target, value);
};

XMLNode.prototype.doc = function() {
  return this.document();
};

XMLNode.prototype.dec = function(version, encoding, standalone) {
  return this.declaration(version, encoding, standalone);
};

XMLNode.prototype.e = function(name, attributes, text) {
  return this.element(name, attributes, text);
};

XMLNode.prototype.n = function(name, attributes, text) {
  return this.node(name, attributes, text);
};

XMLNode.prototype.t = function(value) {
  return this.text(value);
};

XMLNode.prototype.d = function(value) {
  return this.cdata(value);
};

XMLNode.prototype.c = function(value) {
  return this.comment(value);
};

XMLNode.prototype.r = function(value) {
  return this.raw(value);
};

XMLNode.prototype.i = function(target, value) {
  return this.instruction(target, value);
};

XMLNode.prototype.u = function() {
  return this.up();
};

XMLNode.prototype.importXMLBuilder = function(doc) {
  return this.importDocument(doc);
};

XMLNode.prototype.replaceChild = function(newChild, oldChild) {
  throw new Error("This DOM method is not implemented." + this.debugInfo());
};

XMLNode.prototype.removeChild = function(oldChild) {
  throw new Error("This DOM method is not implemented." + this.debugInfo());
};

XMLNode.prototype.appendChild = function(newChild) {
  throw new Error("This DOM method is not implemented." + this.debugInfo());
};

XMLNode.prototype.hasChildNodes = function() {
  return this.children.length !== 0;
};

XMLNode.prototype.cloneNode = function(deep) {
  throw new Error("This DOM method is not implemented." + this.debugInfo());
};

XMLNode.prototype.normalize = function() {
  throw new Error("This DOM method is not implemented." + this.debugInfo());
};

XMLNode.prototype.isSupported = function(feature, version) {
  return true;
};

XMLNode.prototype.hasAttributes = function() {
  return this.attribs.length !== 0;
};

XMLNode.prototype.compareDocumentPosition = function(other) {
  var ref, res;
  ref = this;
  if (ref === other) {
    return 0;
  } else if (this.document() !== other.document()) {
    res = DocumentPosition.Disconnected | DocumentPosition.ImplementationSpecific;
    if (Math.random() < 0.5) {
      res |= DocumentPosition.Preceding;
    } else {
      res |= DocumentPosition.Following;
    }
    return res;
  } else if (ref.isAncestor(other)) {
    return DocumentPosition.Contains | DocumentPosition.Preceding;
  } else if (ref.isDescendant(other)) {
    return DocumentPosition.Contains | DocumentPosition.Following;
  } else if (ref.isPreceding(other)) {
    return DocumentPosition.Preceding;
  } else {
    return DocumentPosition.Following;
  }
};

XMLNode.prototype.isSameNode = function(other) {
  throw new Error("This DOM method is not implemented." + this.debugInfo());
};

XMLNode.prototype.lookupPrefix = function(namespaceURI) {
  throw new Error("This DOM method is not implemented." + this.debugInfo());
};

XMLNode.prototype.isDefaultNamespace = function(namespaceURI) {
  throw new Error("This DOM method is not implemented." + this.debugInfo());
};

XMLNode.prototype.lookupNamespaceURI = function(prefix) {
  throw new Error("This DOM method is not implemented." + this.debugInfo());
};

XMLNode.prototype.isEqualNode = function(node) {
  var i, j, ref2;
  if (node.nodeType !== this.nodeType) {
    return false;
  }
  if (node.children.length !== this.children.length) {
    return false;
  }
  for (i = j = 0, ref2 = this.children.length - 1; 0 <= ref2 ? j <= ref2 : j >= ref2; i = 0 <= ref2 ? ++j : --j) {
    if (!this.children[i].isEqualNode(node.children[i])) {
      return false;
    }
  }
  return true;
};

XMLNode.prototype.getFeature = function(feature, version) {
  throw new Error("This DOM method is not implemented." + this.debugInfo());
};

XMLNode.prototype.setUserData = function(key, data, handler) {
  throw new Error("This DOM method is not implemented." + this.debugInfo());
};

XMLNode.prototype.getUserData = function(key) {
  throw new Error("This DOM method is not implemented." + this.debugInfo());
};

XMLNode.prototype.contains = function(other) {
  if (!other) {
    return false;
  }
  return other === this || this.isDescendant(other);
};

XMLNode.prototype.isDescendant = function(node) {
  var child, isDescendantChild, j, len, ref2;
  ref2 = this.children;
  for (j = 0, len = ref2.length; j < len; j++) {
    child = ref2[j];
    if (node === child) {
      return true;
    }
    isDescendantChild = child.isDescendant(node);
    if (isDescendantChild) {
      return true;
    }
  }
  return false;
};

XMLNode.prototype.isAncestor = function(node) {
  return node.isDescendant(this);
};

XMLNode.prototype.isPreceding = function(node) {
  var nodePos, thisPos;
  nodePos = this.treePosition(node);
  thisPos = this.treePosition(this);
  if (nodePos === -1 || thisPos === -1) {
    return false;
  } else {
    return nodePos < thisPos;
  }
};

XMLNode.prototype.isFollowing = function(node) {
  var nodePos, thisPos;
  nodePos = this.treePosition(node);
  thisPos = this.treePosition(this);
  if (nodePos === -1 || thisPos === -1) {
    return false;
  } else {
    return nodePos > thisPos;
  }
};

XMLNode.prototype.treePosition = function(node) {
  var found, pos;
  pos = 0;
  found = false;
  this.foreachTreeNode(this.document(), function(childNode) {
    pos++;
    if (!found && childNode === node) {
      return found = true;
    }
  });
  if (found) {
    return pos;
  } else {
    return -1;
  }
};

XMLNode.prototype.foreachTreeNode = function(node, func) {
  var child, j, len, ref2, res;
  node || (node = this.document());
  ref2 = node.children;
  for (j = 0, len = ref2.length; j < len; j++) {
    child = ref2[j];
    if (res = func(child)) {
      return res;
    } else {
      res = this.foreachTreeNode(child, func);
      if (res) {
        return res;
      }
    }
  }
};

