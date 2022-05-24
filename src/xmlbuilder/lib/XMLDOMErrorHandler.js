
export const XMLDOMErrorHandler = (function() {
  function XMLDOMErrorHandler() {}

  XMLDOMErrorHandler.prototype.handleError = function(error) {
    throw new Error(error);
  };

  return XMLDOMErrorHandler;

})();
