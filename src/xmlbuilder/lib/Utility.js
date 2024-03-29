var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject,
  slice = [].slice,
  hasProp = {}.hasOwnProperty;

assign = function() {
  var i, key, len, source, sources, target;
  target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  if (isFunction(Object.assign)) {
    Object.assign.apply(null, arguments);
  } else {
    for (i = 0, len = sources.length; i < len; i++) {
      source = sources[i];
      if (source != null) {
        for (key in source) {
          if (!hasProp.call(source, key)) continue;
          target[key] = source[key];
        }
      }
    }
  }
  return target;
};

isFunction = function(val) {
  return !!val && Object.prototype.toString.call(val) === '[object Function]';
};

isObject = function(val) {
  var ref;
  return !!val && ((ref = typeof val) === 'function' || ref === 'object');
};

isArray = function(val) {
  if (isFunction(Array.isArray)) {
    return Array.isArray(val);
  } else {
    return Object.prototype.toString.call(val) === '[object Array]';
  }
};

isEmpty = function(val) {
  var key;
  if (isArray(val)) {
    return !val.length;
  } else {
    for (key in val) {
      if (!hasProp.call(val, key)) continue;
      return false;
    }
    return true;
  }
};

isPlainObject = function(val) {
  var ctor, proto;
  return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && (typeof ctor === 'function') && (ctor instanceof ctor) && (Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object));
};

getValue = function(obj) {
  if (isFunction(obj.valueOf)) {
    return obj.valueOf();
  } else {
    return obj;
  }
};

export { assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject };

// module.exports.assign = assign;

// module.exports.isFunction = isFunction;

// module.exports.isObject = isObject;

// module.exports.isArray = isArray;

// module.exports.isEmpty = isEmpty;

// module.exports.isPlainObject = isPlainObject;

// module.exports.getValue = getValue;
