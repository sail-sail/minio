import * as ref from './Utility.js';
// ref = require('./Utility'),
const assign = ref.assign
const isFunction = ref.isFunction;

// XMLDOMImplementation = require('./XMLDOMImplementation');
import { XMLDOMImplementation } from './XMLDOMImplementation.js';

// XMLDocument = require('./XMLDocument');
import { XMLDocument } from './XMLDocument.js';

// XMLDocumentCB = require('./XMLDocumentCB');
import { XMLDocumentCB } from './XMLDocumentCB.js';

// XMLStringWriter = require('./XMLStringWriter');
import { XMLStringWriter } from './XMLStringWriter.js';

// XMLStreamWriter = require('./XMLStreamWriter');
import { XMLStreamWriter } from './XMLStreamWriter.js';

// NodeType = require('./NodeType');
import { NodeType } from './NodeType.js';

// WriterState = require('./WriterState');
import { WriterState } from './WriterState.js';

export const create = function(name, xmldec, doctype, options) {
  var doc, root;
  if (name == null) {
    throw new Error("Root element needs a name.");
  }
  options = assign({}, xmldec, doctype, options);
  doc = new XMLDocument(options);
  root = doc.element(name);
  if (!options.headless) {
    doc.declaration(options);
    if ((options.pubID != null) || (options.sysID != null)) {
      doc.dtd(options);
    }
  }
  return root;
};

export const begin = function(options, onData, onEnd) {
  var ref1;
  if (isFunction(options)) {
    ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
    options = {};
  }
  if (onData) {
    return new XMLDocumentCB(options, onData, onEnd);
  } else {
    return new XMLDocument(options);
  }
};

export const stringWriter = function(options) {
  return new XMLStringWriter(options);
};

export const streamWriter = function(stream, options) {
  return new XMLStreamWriter(stream, options);
};

export const implementation = new XMLDOMImplementation();

export const nodeType = NodeType;

export const writerState = WriterState;
