(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("printo", [], factory);
	else if(typeof exports === 'object')
		exports["printo"] = factory();
	else
		root["printo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _printo = __webpack_require__(1);

var _printo2 = _interopRequireDefault(_printo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _printo2.default;
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Turn any javascript object into a serializable object
 * @param {any} obj Any Javascript variable
 * @param {object} [options] Options used
 * @param {(number|null)} [options.maxDepth=null] Max depth the function should traverse
 * @param {boolean} [options.skipPrototype=false] Set to true to not enumerate properties from prototype
 * @param {string} [options.rootKey=root] Name use to represent the top level variable
 * @param {formatter} [options.formatter] Function used to format each key, value in the final JSON
 * @param {pointerFormatter} [options.pointerFormatter] Function used to format the pointers path
 * @param {functionFormatter} [options.functionFormatter] Function used to turn functions into strings
 * @returns {object} A serializable object
 */
function printo(obj, options) {
  'use strict';

  //defaults

  options = deepObjectExtend({
    maxDepth: null,
    skipPrototype: false,
    rootKey: 'root',
    formatter: function formatter(obj, prop, type, value, constructorName, path, isPrototype, isPointer, maxDepth) {
      var PROTO_IDENTIFIER = '__proto__.';
      var POINTER_IDENTIFIER = ' *POINTER';
      return {
        key: '' + (isPrototype ? PROTO_IDENTIFIER : '') + prop + ' (' + type + (type === 'object' ? ' ' + constructorName : '') + ')' + (isPointer ? POINTER_IDENTIFIER : ''),
        val: maxDepth ? '/* MAX DEPTH */' : value
      };
    },
    pointerFormatter: function pointerFormatter(obj, path) {
      return '/* ' + path.join('.') + ' */';
    },
    functionFormatter: function functionFormatter(fn) {
      var source = fn.toString();
      if (source.length > 50) {
        source = source.substr(0, source.indexOf(')') + 1);
      }
      return source;
    }
  }, options);

  function deepObjectExtend(base, extension) {
    for (var prop in extension) {
      if (extension.hasOwnProperty(prop)) {
        if (base[prop] && _typeof(extension[prop]) === 'object') {
          deepObjectExtend(base[prop], extension[prop]);
        } else {
          base[prop] = extension[prop];
        }
      }
    }
    return base;
  }

  var ROOT_KEY = options.rootKey;
  var MAXDEPTH_IDENTIFIER = '/* MAX DEPTH */';

  var wrapper = {};
  wrapper[ROOT_KEY] = obj;

  var mem = new WeakMap();

  function visit(obj, path) {
    mem.set(obj, path);
  }

  function isVisited(obj) {
    return mem.get(obj);
  }

  function typeOf(variable) {
    if (variable === null) {
      return 'null';
    } else if (Object.prototype.toString.call(variable) === '[object Array]') {
      return 'array';
    } else {
      return typeof variable === 'undefined' ? 'undefined' : _typeof(variable);
    }
  }

  function getConstructor(obj) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
      try {
        return '' + obj.constructor.name;
      } catch (e) {
        return 'UNKNOWN';
      }
    }
    return 'PRIMITIVE';
  }

  function stringifableObj(obj) {

    function isHTMLElement(o) {
      return getConstructor(o).match(/HTML|SVG/);
    }

    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
      var x = Object.prototype.toString.call(obj);
      switch (x) {
        case '[object Date]':
          return obj.toString();
        case '[object RegExp]':
          return obj.toString();
        case '[object SVGTextElement]':
          return obj.toString();
      }
      if (isHTMLElement(obj)) return (obj.outerHTML || '').match(/<[^>]+>/) + '';
    }
    return false;
  }

  function expandObject(obj, path) {

    var depth = path.length;
    var isMaxDepth = typeof options.maxDepth === 'number' && depth >= options.maxDepth;

    var symbols = {};

    visit(obj, path);

    // expand child properties
    for (var prop in obj) {

      // access child
      var child = void 0;
      try {
        child = obj[prop];
      } catch (err) {
        symbols['/* ' + prop + ' (EXCEPTION) */'] = err;
        continue; // skip
      }

      var isProto = !Object.prototype.hasOwnProperty.call(obj, prop);
      if (options.skipPrototype && isProto) continue;

      var type = typeOf(obj[prop]);
      var constructorName = getConstructor(child);
      var pointer = isVisited(child);

      var printVal = void 0;

      if (pointer) {
        printVal = options.pointerFormatter(child, pointer);
      } else if (type === 'function') {
        printVal = options.functionFormatter(child);
      } else if (type === 'object' || type === 'array') {

        var str = stringifableObj(child);
        if (str) {
          visit(child, [].concat(path, prop));
          printVal = str;
        } else {
          if (isMaxDepth) {
            printVal = MAXDEPTH_IDENTIFIER;
          } else {
            printVal = expandObject(child, [].concat(path, prop)); // print children using recursion
          }
        }
      } else {
        // primitive
        printVal = child;
      }

      var p = options.formatter(child, prop, type, printVal, constructorName, path, isProto, !!pointer, isMaxDepth);
      symbols[p.key] = p.val;
    }
    return symbols;
  }

  var result = expandObject(wrapper, []);
  return result;
}

/**
 * Function that formats every object
 * @callback formatter
 * @param {any} obj The actual object reference
 * @param {string} prop Name of the property
 * @param {string} type Type of the value
 * @param {any} value Printable value
 * @param {string} constructorName Name of the constructor if it is an object
 * @param {Array} path Array containing the path of parent properties
 * @param {boolean} isPrototype If this property comes from the prototype
 * @param {boolean} isPointer If this property is a reference to an already visited object
 * @param {boolean} maxDepth If maxDepth is reatched
 * @returns {formatterResult} An object containing a key:string and a val:string property
 */

/**
 * @typedef {object} formatterResult
 * @property {string} key Value stored on the key
 * @property {string} val Value stored on the value
 */

/**
 * Function that formats the value of already visited objects
 * @callback pointerFormatter
 * @param {any} obj The actual object reference
 * @param {Array} path Array containing the path of parent properties
 * @returns {string} Return a string
 */

/**
 * Function that turn functions into strings
 * @callback functionFormatter
 * @param {function} fn A function
 * @returns {string} A printable string
 */

exports.default = printo;
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=printo.js.map