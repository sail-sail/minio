
export const XMLDOMStringList = (function() {
  function XMLDOMStringList(arr) {
    this.arr = arr || [];
  }

  Object.defineProperty(XMLDOMStringList.prototype, 'length', {
    get: function() {
      return this.arr.length;
    }
  });

  XMLDOMStringList.prototype.item = function(index) {
    return this.arr[index] || null;
  };

  XMLDOMStringList.prototype.contains = function(str) {
    return this.arr.indexOf(str) !== -1;
  };

  return XMLDOMStringList;

})();
