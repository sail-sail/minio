
// Derivation = require('./Derivation');
import { Derivation } from './Derivation.js';

export const XMLTypeInfo = (function() {
  function XMLTypeInfo(typeName, typeNamespace) {
    this.typeName = typeName;
    this.typeNamespace = typeNamespace;
  }

  XMLTypeInfo.prototype.isDerivedFrom = function(typeNamespaceArg, typeNameArg, derivationMethod) {
    throw new Error("This DOM method is not implemented.");
  };

  return XMLTypeInfo;

})();
