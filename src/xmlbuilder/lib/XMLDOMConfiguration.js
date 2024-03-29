// XMLDOMErrorHandler = require('./XMLDOMErrorHandler');
import { XMLDOMErrorHandler } from './XMLDOMErrorHandler.js';

// XMLDOMStringList = require('./XMLDOMStringList');
import { XMLDOMStringList } from './XMLDOMStringList.js';

export const XMLDOMConfiguration = (function() {
  function XMLDOMConfiguration() {
    var clonedSelf;
    this.defaultParams = {
      "canonical-form": false,
      "cdata-sections": false,
      "comments": false,
      "datatype-normalization": false,
      "element-content-whitespace": true,
      "entities": true,
      "error-handler": new XMLDOMErrorHandler(),
      "infoset": true,
      "validate-if-schema": false,
      "namespaces": true,
      "namespace-declarations": true,
      "normalize-characters": false,
      "schema-location": '',
      "schema-type": '',
      "split-cdata-sections": true,
      "validate": false,
      "well-formed": true
    };
    this.params = clonedSelf = Object.create(this.defaultParams);
  }

  Object.defineProperty(XMLDOMConfiguration.prototype, 'parameterNames', {
    get: function() {
      return new XMLDOMStringList(Object.keys(this.defaultParams));
    }
  });

  XMLDOMConfiguration.prototype.getParameter = function(name) {
    if (this.params.hasOwnProperty(name)) {
      return this.params[name];
    } else {
      return null;
    }
  };

  XMLDOMConfiguration.prototype.canSetParameter = function(name, value) {
    return true;
  };

  XMLDOMConfiguration.prototype.setParameter = function(name, value) {
    if (value != null) {
      return this.params[name] = value;
    } else {
      return delete this.params[name];
    }
  };

  return XMLDOMConfiguration;

})();
