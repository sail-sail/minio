var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  hasProp = {}.hasOwnProperty;

export const XMLStringifier = (function() {
  function XMLStringifier(options) {
    this.assertLegalName = bind(this.assertLegalName, this);
    this.assertLegalChar = bind(this.assertLegalChar, this);
    var key, ref, value;
    options || (options = {});
    this.options = options;
    if (!this.options.version) {
      this.options.version = '1.0';
    }
    ref = options.stringify || {};
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      value = ref[key];
      this[key] = value;
    }
  }

  XMLStringifier.prototype.name = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    return this.assertLegalName('' + val || '');
  };

  XMLStringifier.prototype.text = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    return this.assertLegalChar(this.textEscape('' + val || ''));
  };

  XMLStringifier.prototype.cdata = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    val = '' + val || '';
    val = val.replace(']]>', ']]]]><![CDATA[>');
    return this.assertLegalChar(val);
  };

  XMLStringifier.prototype.comment = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    val = '' + val || '';
    if (val.match(/--/)) {
      throw new Error("Comment text cannot contain double-hypen: " + val);
    }
    return this.assertLegalChar(val);
  };

  XMLStringifier.prototype.raw = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    return '' + val || '';
  };

  XMLStringifier.prototype.attValue = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    return this.assertLegalChar(this.attEscape(val = '' + val || ''));
  };

  XMLStringifier.prototype.insTarget = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    return this.assertLegalChar('' + val || '');
  };

  XMLStringifier.prototype.insValue = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    val = '' + val || '';
    if (val.match(/\?>/)) {
      throw new Error("Invalid processing instruction value: " + val);
    }
    return this.assertLegalChar(val);
  };

  XMLStringifier.prototype.xmlVersion = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    val = '' + val || '';
    if (!val.match(/1\.[0-9]+/)) {
      throw new Error("Invalid version number: " + val);
    }
    return val;
  };

  XMLStringifier.prototype.xmlEncoding = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    val = '' + val || '';
    if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
      throw new Error("Invalid encoding: " + val);
    }
    return this.assertLegalChar(val);
  };

  XMLStringifier.prototype.xmlStandalone = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    if (val) {
      return "yes";
    } else {
      return "no";
    }
  };

  XMLStringifier.prototype.dtdPubID = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    return this.assertLegalChar('' + val || '');
  };

  XMLStringifier.prototype.dtdSysID = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    return this.assertLegalChar('' + val || '');
  };

  XMLStringifier.prototype.dtdElementValue = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    return this.assertLegalChar('' + val || '');
  };

  XMLStringifier.prototype.dtdAttType = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    return this.assertLegalChar('' + val || '');
  };

  XMLStringifier.prototype.dtdAttDefault = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    return this.assertLegalChar('' + val || '');
  };

  XMLStringifier.prototype.dtdEntityValue = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    return this.assertLegalChar('' + val || '');
  };

  XMLStringifier.prototype.dtdNData = function(val) {
    if (this.options.noValidation) {
      return val;
    }
    return this.assertLegalChar('' + val || '');
  };

  XMLStringifier.prototype.convertAttKey = '@';

  XMLStringifier.prototype.convertPIKey = '?';

  XMLStringifier.prototype.convertTextKey = '#text';

  XMLStringifier.prototype.convertCDataKey = '#cdata';

  XMLStringifier.prototype.convertCommentKey = '#comment';

  XMLStringifier.prototype.convertRawKey = '#raw';

  XMLStringifier.prototype.assertLegalChar = function(str) {
    var regex, res;
    if (this.options.noValidation) {
      return str;
    }
    regex = '';
    if (this.options.version === '1.0') {
      regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
      if (res = str.match(regex)) {
        throw new Error("Invalid character in string: " + str + " at index " + res.index);
      }
    } else if (this.options.version === '1.1') {
      regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
      if (res = str.match(regex)) {
        throw new Error("Invalid character in string: " + str + " at index " + res.index);
      }
    }
    return str;
  };

  XMLStringifier.prototype.assertLegalName = function(str) {
    var regex;
    if (this.options.noValidation) {
      return str;
    }
    this.assertLegalChar(str);
    regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
    if (!str.match(regex)) {
      throw new Error("Invalid character in name");
    }
    return str;
  };

  XMLStringifier.prototype.textEscape = function(str) {
    var ampregex;
    if (this.options.noValidation) {
      return str;
    }
    ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
    return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '&#xD;');
  };

  XMLStringifier.prototype.attEscape = function(str) {
    var ampregex;
    if (this.options.noValidation) {
      return str;
    }
    ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
    return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
  };

  return XMLStringifier;

})();
