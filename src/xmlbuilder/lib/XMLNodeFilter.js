export const XMLNodeFilter = (function() {
  function XMLNodeFilter() {}

  XMLNodeFilter.prototype.FilterAccept = 1;

  XMLNodeFilter.prototype.FilterReject = 2;

  XMLNodeFilter.prototype.FilterSkip = 3;

  XMLNodeFilter.prototype.ShowAll = 0xffffffff;

  XMLNodeFilter.prototype.ShowElement = 0x1;

  XMLNodeFilter.prototype.ShowAttribute = 0x2;

  XMLNodeFilter.prototype.ShowText = 0x4;

  XMLNodeFilter.prototype.ShowCDataSection = 0x8;

  XMLNodeFilter.prototype.ShowEntityReference = 0x10;

  XMLNodeFilter.prototype.ShowEntity = 0x20;

  XMLNodeFilter.prototype.ShowProcessingInstruction = 0x40;

  XMLNodeFilter.prototype.ShowComment = 0x80;

  XMLNodeFilter.prototype.ShowDocument = 0x100;

  XMLNodeFilter.prototype.ShowDocumentType = 0x200;

  XMLNodeFilter.prototype.ShowDocumentFragment = 0x400;

  XMLNodeFilter.prototype.ShowNotation = 0x800;

  XMLNodeFilter.prototype.acceptNode = function(node) {
    throw new Error("This DOM method is not implemented.");
  };

  return XMLNodeFilter;

})();
