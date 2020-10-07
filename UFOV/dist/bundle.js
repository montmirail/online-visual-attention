var UFOV =
/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath'
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./src/enums/keys.ts":
/*!***************************!*\
  !*** ./src/enums/keys.ts ***!
  \***************************/
/*! exports provided: Keys */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Keys", function() { return Keys; });
var Keys;
(function (Keys) {
    Keys[Keys["YES"] = 66] = "YES";
    Keys[Keys["NO"] = 89] = "NO";
    Keys[Keys["START"] = 32] = "START";
    Keys[Keys["RESUME"] = 13] = "RESUME";
    Keys[Keys["QUIT"] = 27] = "QUIT";
    Keys[Keys["SHORT"] = 83] = "SHORT";
    Keys[Keys["LONG"] = 68] = "LONG";
})(Keys || (Keys = {}));


/***/ }),

/***/ "./src/enums/mode.ts":
/*!***************************!*\
  !*** ./src/enums/mode.ts ***!
  \***************************/
/*! exports provided: Mode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mode", function() { return Mode; });
var Mode;
(function (Mode) {
    Mode[Mode["CENTER"] = 1] = "CENTER";
    Mode[Mode["PERIPHERAL"] = 2] = "PERIPHERAL";
    Mode[Mode["BOTH"] = 3] = "BOTH";
})(Mode || (Mode = {}));


/***/ }),

/***/ "./src/enums/state.ts":
/*!****************************!*\
  !*** ./src/enums/state.ts ***!
  \****************************/
/*! exports provided: State */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
var State;
(function (State) {
    State["RESPONSE"] = "response";
    State["START"] = "start";
    State["FIX"] = "fix";
    State["CUE"] = "cue";
    State["BREAK"] = "break";
    State["MOVE"] = "move";
    State["DONE"] = "done";
    State["DELAY"] = "delay";
    State["STIM"] = "stim";
    State["MASK"] = "mask";
    State["FEEDBACK"] = "feedback";
    State["FEEDBACK_DELAY"] = "feedback-delay";
})(State || (State = {}));


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: init */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony import */ var _enums_keys__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums/keys */ "./src/enums/keys.ts");
/* harmony import */ var _enums_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enums/state */ "./src/enums/state.ts");
/* harmony import */ var _ufov__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ufov */ "./src/ufov.ts");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui */ "./src/ui.ts");
/* harmony import */ var _utils_calibration__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/calibration */ "./src/utils/calibration.ts");
/* harmony import */ var _utils_fullscreen__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/fullscreen */ "./src/utils/fullscreen.ts");
/* harmony import */ var _utils_submit_results__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/submit-results */ "./src/utils/submit-results.ts");







/**
 * This experience is calibrated to work on Viewpixx screen of 24 inch
 */
var monitorSize = 24;
var ufov, ui, pxPerDeg;
// *********************** DRAWING CONTROL ************************ //
// @ts-ignore
window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
};
//controls state/canvas update
var draw = function () {
    // @ts-ignore
    requestAnimFrame(draw);
    updateFrame();
};
//this function sets up buttons amd dialog windows, and the keyboard listener
var init = function (options) {
    var continueButton = $('#cButton');
    if (!options.pxPerDeg) {
        var calibration = Object(_utils_calibration__WEBPACK_IMPORTED_MODULE_4__["getCalibration"])(monitorSize);
        pxPerDeg = calibration.pxPerDeg;
    }
    else {
        pxPerDeg = options.pxPerDeg;
    }
    console.log(pxPerDeg);
    ufov = new _ufov__WEBPACK_IMPORTED_MODULE_2__["Ufov"](pxPerDeg);
    ui = new _ui__WEBPACK_IMPORTED_MODULE_3__["Ui"](ufov);
    //hide content before the subject starts the task
    $("#postexpt").hide();
    //hide content before subject starts
    $('#postexpt').hide();
    /**
     * Set up the continue button that allows the subject to start the task
     */
    // @ts-ignore
    continueButton.button();
    continueButton.click(function () {
        Object(_utils_fullscreen__WEBPACK_IMPORTED_MODULE_5__["openFullscreen"])();
        ui.init();
    });
    //set up the reminder dialog that appears with short instructions
    // @ts-ignore
    $("#reminder").dialog({
        autoOpen: false,
        modal: true,
        title: "Instructions & Controls",
        width: 400
    });
    //set up the reminder button which brings up short instructions in a dialog box
    // @ts-ignore
    $("#reminderButton").button({
        icons: { primary: "ui-icon-info" },
        text: false
    });
    $("#reminderButton").click(function () {
        // @ts-ignore
        $("#reminder").dialog("open");
    });
    //add keyboard listener to keep track of keys the subject presses
    window.addEventListener("keydown", keyResponse, true);
    /**
     * Start the task
     */
    draw(); //start the task};
};
// ************************* STATE UPDATES *************************** //
//At each frame, the frame is redrawn based on the current state
function updateFrame() {
    //check if dialog window for instructions is open
    // @ts-ignore
    if ($("#reminder").dialog("isOpen")) {
        ufov.dialogOpen = true;
    }
    else {
        ufov.dialogOpen = false;
    }
    if (ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].START) { //first trial of the task
        if (ufov.stateChange) {
            ufov.stateChange = false;
            ui.drawContent(); //update content displayed
        }
        //wait for space bar
    }
    else if (ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].FIX) { //start of a trial (that's not the first one)
        if (ufov.stateChange) {
            ufov.stateChange = false;
            ui.drawContent(); //update content displayed
        }
        //wait for space bar
    }
    else if (ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].DELAY) { //delay before stimuli presentation
        if (ufov.stateChange) {
            ufov.startWait = new Date().getTime(); //get start time of the delay period
            ufov.curDelay = ufov.delays[ufov.trial]; //store current delay duration
            ufov.stateChange = false;
            ui.drawContent(); //update content displayed
        }
        //if the set amount of time for the delay period has passed, then switch to stim state and display stimuli
        else if (new Date().getTime() >= ufov.startWait + ufov.curDelay) {
            ufov.state = _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].STIM;
            ufov.stateChange = true;
        }
    }
    else if (ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].STIM) { //stimuli presentation
        if (ufov.stateChange) {
            ufov.startWait = new Date().getTime(); //get start time of stimulus presentation
            ufov.stateChange = false;
            ufov.startTimes[ufov.trial] = ufov.startWait; //record this presentation start time
            ui.drawContent(); //update content displayed
        }
        else {
            var curTime = new Date().getTime(); //get current time
            //if the set amount of time for the presentation period has passed, then switch to mask state and display mask
            if (curTime >= ufov.startWait + ufov.duration[ufov.curSC][ufov.scTrial[ufov.curSC]]) {
                ufov.state = _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].MASK;
                ufov.stateChange = true;
                ufov.endTimes[ufov.trial] = curTime; //record end time of presentation
            }
        }
    }
    else if (ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].MASK) { //mask presentation
        if (ufov.stateChange) {
            ufov.startWait = new Date().getTime(); //get start time of mask period
            ufov.stateChange = false;
            ui.drawContent(); //update content displayed
        }
        //if the set amount of time for the mask period has passed, then switch to reponse state
        else if (new Date().getTime() >= ufov.startWait + ufov.maskDur) {
            ufov.state = _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].RESPONSE;
            ufov.stateChange = true;
        }
    }
    else if (ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].RESPONSE) { //wait for subject's response
        if (ufov.stateChange) {
            ufov.startWait = new Date().getTime(); //get start time of response period
            ufov.stateChange = false;
            ui.drawContent(); //update content displayed
        }
        //once the subject has given a response for the trial, then move on
        //(check if the subject needs to respond to only the center (mode = 1), only the peripheral (mode = 2) or both (mode = 3))
        if ((ufov.mode == 1 && ufov.cResp[ufov.curSC][ufov.scTrial[ufov.curSC]] != -1) ||
            (ufov.mode == 2 && ufov.pResp[ufov.curSC][ufov.scTrial[ufov.curSC]] >= 0) ||
            (ufov.mode == 3 && ufov.cResp[ufov.curSC][ufov.scTrial[ufov.curSC]] != -1 &&
                ufov.pResp[ufov.curSC][ufov.scTrial[ufov.curSC]] >= 0)) {
            ufov.state = _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].FEEDBACK_DELAY; //switch to feedback-delay state
            ufov.stateChange = true;
        }
        //if enough time has passed where the subject hasn't responded to all of the required targets,
        //then display a message to note that they need to respond to both the center and peripheral targets
        else if (!ufov.displayPrompt && new Date().getTime() >= ufov.startWait + ufov.promptTime) {
            ufov.displayPrompt = true; //enable prompt message
            ui.displayPrompt(); //now display prompt message
        }
    }
    else if (ufov.state == "feedback-delay") { //delay before feedback
        if (ufov.stateChange) {
            ufov.displayPrompt = false;
            ufov.startWait = new Date().getTime(); //get start time of feedback delay period
            ufov.stateChange = false;
        }
        //once the set amount of time for the feedback delay has passed, switch to the feedback state and display feedback
        else if (new Date().getTime() >= ufov.startWait + ufov.feedbackDelay) {
            ufov.state = _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].FEEDBACK;
            ufov.stateChange = true;
        }
    }
    else if (ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].FEEDBACK) { //feedback given
        if (ufov.stateChange) {
            ufov.startWait = new Date().getTime(); //get start time of feedback display
            ufov.stateChange = false;
            ui.drawContent(); //update content displayed
        }
        //once the set amount of time for the feedback period has passed, check if the subject is done with all the trials
        else if (new Date().getTime() >= ufov.startWait + ufov.feedbackTime) {
            ufov.updateStaircase(); //update the staircase based on the subject's performance
            if (ufov.done) { //if done, then start wrapping up the task
                ufov.state = _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].DONE;
                Object(_utils_submit_results__WEBPACK_IMPORTED_MODULE_6__["submitResults"])(ufov)
                    .then(function () {
                    $("#exptCanvas").hide();
                    $("#postexpt").show();
                }); //send data to database
            }
            else {
                ufov.state = _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].FIX; //otherwise, move onto the next trial
            }
            ufov.stateChange = true;
        }
    }
}
// ****************** INPUT TRACKERS *********************** //
//this function is triggered whenever a key is pressed on the keyboard
function keyResponse(event) {
    //only respond to any key presses if the dialog window is not open
    if (!ufov.dialogOpen) {
        //if it's time for the subject to respond, and we're waiting for a response to the center target
        if (ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].RESPONSE && (ufov.mode == 1 || ufov.mode == 3)
            && ufov.cResp[ufov.curSC][ufov.scTrial[ufov.curSC]] == -1) {
            if (event.keyCode == _enums_keys__WEBPACK_IMPORTED_MODULE_0__["Keys"].SHORT) {
                ufov.cRT[ufov.curSC][ufov.scTrial[ufov.curSC]] = new Date().getTime() - ufov.startWait; //calculate response time
                ufov.cResp[ufov.curSC][ufov.scTrial[ufov.curSC]] = 0; //record that they responded the center target had short hair
                ui.drawContent(); //update content displayed
                //Indicate which key the subject pressed by drawing the letter in the center of the screen (S)
                ui.writeLetter(ui.cText[0]);
            }
            else if (event.keyCode == _enums_keys__WEBPACK_IMPORTED_MODULE_0__["Keys"].LONG) {
                ufov.cRT[ufov.curSC][ufov.scTrial[ufov.curSC]] = new Date().getTime() - ufov.startWait; //calculate response time
                ufov.cResp[ufov.curSC][ufov.scTrial[ufov.curSC]] = 1; //record that they responded the center target had long hair
                ui.drawContent(); //update content displayed
                //Indicate which key the subject pressed by drawing the letter in the center of the screen (D)
                ui.writeLetter(ui.cText[1]);
            }
        }
        //if there is already a response to the peripheral target, need to redraw the location they selected:
        //draw a question mark if the location they selected was not a valid spot to select
        if (ufov.pResp[ufov.curSC][ufov.scTrial[ufov.curSC]] == -2) {
            ui.context.drawImage(ui.response[0], Math.round(ui.x - ui.respsz / 2), Math.round(ui.y - ui.respsz / 2), ui.respsz, ui.respsz);
        }
        //otherwise, draw a white X where the subject clicked for indicating where the peripheral target was
        else if (ufov.pResp[ufov.curSC][ufov.scTrial[ufov.curSC]] != -1) {
            ui.context.drawImage(ui.response[1], Math.round(ui.x - ui.respsz / 2), Math.round(ui.y - ui.respsz / 2), ui.respsz, ui.respsz);
        }
        //if they pressed the start key at the beginning of a trial, then start the trial
        if (event.keyCode === _enums_keys__WEBPACK_IMPORTED_MODULE_0__["Keys"].START && (ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].START || ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].FIX)) {
            ufov.trialStart[ufov.curSC][ufov.scTrial[ufov.curSC]] = new Date().getTime() - ufov.startTime;
            ufov.state = _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].DELAY;
            ufov.stateChange = true;
        }
        if (event.keyCode === 27) {
            Object(_utils_fullscreen__WEBPACK_IMPORTED_MODULE_5__["closeFullscreen"])();
        }
    }
}


/***/ }),

/***/ "./src/ufov.ts":
/*!*********************!*\
  !*** ./src/ufov.ts ***!
  \*********************/
/*! exports provided: Ufov */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ufov", function() { return Ufov; });
/* harmony import */ var _enums_mode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums/mode */ "./src/enums/mode.ts");
/* harmony import */ var _enums_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enums/state */ "./src/enums/state.ts");
/* harmony import */ var _utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/create-empty-2d-array */ "./src/utils/create-empty-2d-array.ts");



var Ufov = /** @class */ (function () {
    function Ufov(pxPerDeg) {
        //current trial tracker (staircase agnostic)
        this.trial = 0;
        /**
         * Value from config
         */
        this.pxPerDeg = pxPerDeg;
        this.outerOnly = true;
        this.mode = _enums_mode__WEBPACK_IMPORTED_MODULE_0__["Mode"].BOTH;
        this.maxTrials = 72;
        this.correctDec = 3;
        this.incorrectInc = 1;
        this.initStep = 2;
        this.finalStep = 1;
        this.speed = 16;
        this.initDur = [9, 15];
        this.minFrames = 1;
        this.maxFrames = 99;
        this.curDelay = 0;
        this.minDelay = 200;
        this.maxDelay = 1000;
        this.maskDur = 320;
        this.feedbackDelay = 350;
        this.feedbackTime = 400;
        this.startWait = 0;
        this.promptTime = 5000;
        this.thetaPos = [45, 90, 135, 180, 225, 270, 315, 360];
        //acceptable distances for peripheral mouse click responses
        this.respDegLim = 120 / this.thetaPos.length; //acceptable angular distance from spokes
        this.respDegMin = 1 * this.pxPerDeg;
        //trial and staircase variables ------------------------------------------------------
        this.step = [this.initStep, this.initStep]; //this keeps track of the current step multiplier for the inner and outer staircase
        //(currently defaults to only using outer staircase)
        this.switchReversals = 3; //how many reversals are needed in the staircase before the step multiplier changes from initStep to finalStep
        this.stopReversals = 8; //how many reversals are needed in the staircase before the task can end
        this.maxCeilTrials = 10; //the maximum number of consecutive trials that can have the same duration (only applies for the ceiling value or floor value)
        if (this.outerOnly) {
            this.nTrials = this.maxTrials;
        }
        else {
            this.nTrials = this.maxTrials * 2;
        }
        this.delays = [];
        for (var i = 0; i < this.nTrials; i++) {
            this.delays[i] = Math.floor((this.maxDelay - this.minDelay + 1) * Math.random()) + this.minDelay;
        }
        this.initOutput();
        this.initCounters();
        this.trialSetup();
    }
    /**
     * Initialize output
     */
    Ufov.prototype.initOutput = function () {
        this.cResp = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.pResp = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.cRT = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.pRT = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.cCorrect = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.pCorrect = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.pX = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.pY = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.pTargetX = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.pTargetY = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.trialStart = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.reversals = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
    };
    /**
     * Initialize all counters
     */
    Ufov.prototype.initCounters = function () {
        this.floorCount = [0, 0]; //number of trials that have occurred with the stimulus presentation duration at the floor value (kept track for the inner and outer staircase)
        this.ceilCount = [0, 0]; //number of trials that have occurred with the stimulus presentation duration at the ceiling value (kept track for the inner and outer staircase)
        this.scTrial = [0, 0]; //current trial number within a staircase
        this.nRevs = [0, 0]; //current number of reversals for each staircase
        this.stepRising = [0, 0]; //state tracker for if the last step taken was an increase (used for determining when a reversal occurs); tracked for each staircase
        this.stepFalling = [0, 0]; //state tracker for if the last step taken was a decrease (used for determining when a reversal occurs); tracked for each staircase
        this.correctStreak = [0, 0]; //current number of trials that the subject has gotten correct consecutively per staircase
        this.incorrectStreak = [0, 0]; //current number of trials that the subject has gotten incorrect consecutively per staircase
        this.trial = 0; //current trial tracker (staircase agnostic)
    };
    Ufov.prototype.trialSetup = function () {
        //setup starting stimulus presentation duration for both the inner and outer staircase
        this.duration = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.frames = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        this.frames[0][0] = this.initDur[0];
        this.frames[1][0] = this.initDur[1];
        this.duration[0][0] = this.frames[0][0] * this.speed;
        this.duration[1][0] = this.frames[1][0] * this.speed;
        //create array with equal peripheral target location appearances across all trials
        //for both the inner and outer circles
        var tmpInner = [];
        var tmpOuter = [];
        for (var i = 0; i < Math.ceil(this.maxTrials / this.thetaPos.length); i++) {
            for (var j = 0; j < this.thetaPos.length; j++) {
                tmpInner.push(j);
                tmpOuter.push(j);
            }
        }
        //now randomize the order of the arrays setup above so that they are presented in a random order
        var shuffleInner = tmpInner;
        var shuffleOuter = tmpOuter;
        this.pPos = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        for (var i = 0; i < this.maxTrials; i++) {
            var indInner = Math.floor(Math.random() * shuffleInner.length);
            var indOuter = Math.floor(Math.random() * shuffleOuter.length);
            this.pPos[0][i] = shuffleInner[indInner];
            this.pPos[1][i] = shuffleOuter[indOuter];
            shuffleInner.splice(indInner, 1);
            shuffleOuter.splice(indOuter, 1);
        }
        //randomize the stimulus type for the center target
        //(need two separate arrays for the two different staircases, if both are being used)
        this.cStim = Object(_utils_create_empty_2d_array__WEBPACK_IMPORTED_MODULE_2__["createEmpty2dArray"])(this.maxTrials);
        for (var i = 0; i < this.maxTrials; i++) {
            this.cStim[0][i] = Math.floor(Math.random() * 2);
            this.cStim[1][i] = Math.floor(Math.random() * 2);
        }
        //randomize order of staircase presentation (this only applies if more than one staircase is being used)
        //if only one being used, it's only the staircase with the peripheral target at the outer circle
        this.sc = [];
        if (this.outerOnly) {
            for (var i = 0; i < this.nTrials; i++) {
                this.sc[i] = 1; //fill array with 1's
            }
        }
        else {
            var tmp2 = [];
            for (var i = 0; i < this.maxTrials; i++) {
                for (var j = 0; j < 2; j++) {
                    tmp2.push(j); //fill array with both 0's and 1's equally
                }
            }
            //randomize order
            for (var i = 0; i < this.nTrials; i++) {
                var ind = Math.floor(Math.random() * tmp2.length);
                this.sc[i] = tmp2[ind];
                tmp2.splice(ind, 1);
            }
        }
        //state control --------------------------------------------------------
        this.state = _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].START; //which state the trial is in; state order: start/fix, delay, stim, mask, response, feedback-delay, feedback
        this.stateChange = false; //keeps track if the state changed during the trial
        this.isScaled = false; //this scales what is drawn on the HTML5 canvas; only implemented when drawing the mask before the response period
        this.curSC = this.sc[this.trial]; //this keeps track of which staircase is currently being used (either inner or outer staircase)
        this.done = false; //keeps track if subject is done with the task
        this.dialogOpen = false; //keeps track of whether dialog window is open or not
        this.displayPrompt = false; //keeps track of whether subject should be prompted to respond (after taking too long to response to both targets)
        //time tracker variables --------------------------
        this.startTimes = []; //stores start time of stimulus presentation (for calculating total stimulus presentation duration)
        this.endTimes = []; //stores end time of stimulus presentation (for calculating total stimulus presentation duration)
    };
    /**
     * this function determines the next trial's stimulus presentation duration as it
     * updates the staircase based on trial performance
     */
    Ufov.prototype.updateStaircase = function () {
        //check if the response is correct:
        //for the peripheral target
        if (this.mode != _enums_mode__WEBPACK_IMPORTED_MODULE_0__["Mode"].CENTER) {
            if (this.pResp[this.curSC][this.scTrial[this.curSC]] == this.pPos[this.curSC][this.scTrial[this.curSC]]) {
                this.pCorrect[this.curSC][this.scTrial[this.curSC]] = 1; //correct
            }
            else {
                this.pCorrect[this.curSC][this.scTrial[this.curSC]] = 0; //incorrect
            }
        }
        //for the center target
        if (this.mode != _enums_mode__WEBPACK_IMPORTED_MODULE_0__["Mode"].PERIPHERAL) {
            if (this.cResp[this.curSC][this.scTrial[this.curSC]] == this.cStim[this.curSC][this.scTrial[this.curSC]]) {
                this.cCorrect[this.curSC][this.scTrial[this.curSC]] = 1; //correct
            }
            else {
                this.cCorrect[this.curSC][this.scTrial[this.curSC]] = 0; //incorrect
            }
        }
        //check if the response given was correct
        //(for trials with both peripheral and center targets, the subject needs to get both correct in order for the trial to be considered correct)
        if ((this.mode == 1 && this.cCorrect[this.curSC][this.scTrial[this.curSC]]) ||
            (this.mode == 2 && this.pCorrect[this.curSC][this.scTrial[this.curSC]]) ||
            (this.mode == 3 && this.cCorrect[this.curSC][this.scTrial[this.curSC]] && this.pCorrect[this.curSC][this.scTrial[this.curSC]])) {
            this.correctStreak[this.curSC]++; //increase the number of consecutively correct trials
            this.incorrectStreak[this.curSC] = 0; //reset the number of consecutively incorrect trials to 0
        }
        else {
            this.correctStreak[this.curSC] = 0; //reset the number of consecutively correct trials to 0
            this.incorrectStreak[this.curSC]++; //increase the number of consecutively incorrect trials
        }
        //if the maxmimum number of trials hasn't been reached yet, then check if the staircase needs to be updated
        if (this.scTrial[this.curSC] < this.maxTrials - 1) {
            //first check if the staircase needs to be decreased; that is, the number of correct trials required to decrease the staircase
            //has been reached, and there is still room to decrease the staircase (the minimum hasn't been hit yet)
            if (this.correctStreak[this.curSC] >= this.correctDec && this.frames[this.curSC][this.scTrial[this.curSC]] > this.minFrames) {
                var stepSize = Math.round(this.frames[this.curSC][this.scTrial[this.curSC]] - this.step[this.curSC]); //decrease the simulus presentation duration (in frames)
                //if the new duration is less than the minimum allowed, change the value to the mimumum
                this.frames[this.curSC][this.scTrial[this.curSC] + 1] = Math.max(stepSize, this.minFrames);
                //record the new duration to be used for the next trial
                this.duration[this.curSC][this.scTrial[this.curSC] + 1] = this.frames[this.curSC][this.scTrial[this.curSC] + 1] * this.speed;
                this.correctStreak[this.curSC] = 0; //reset the correct streak to 0 in order to start counting for the next step
                this.stepFalling[this.curSC] = 1; //note that the subject is now falling in the staircase (to keep track of reversals)
                if (this.stepRising[this.curSC]) { //if the subject's last step was a rising step, then record that there was a reversal
                    this.stepRising[this.curSC] = 0; //now the subject is no longer taking a rising step
                    this.nRevs[this.curSC]++; //increase reversal count
                }
            }
            //if not a decrease, then check if the staircase needs to be increased instead; the number of incorrect trials to decrease the staircase
            //has been reached and there is still room to increase the staircase (the maximum hasn't been reached yet)
            else if (this.incorrectStreak[this.curSC] >= this.incorrectInc && this.frames[this.curSC][this.scTrial[this.curSC]] < this.maxFrames) {
                var stepSize = Math.round(this.frames[this.curSC][this.scTrial[this.curSC]] + this.step[this.curSC]); //increase the simulus presentation duration (in frames)
                //if the new duration is more than the maximum allowed, change the value to the maximum
                this.frames[this.curSC][this.scTrial[this.curSC] + 1] = Math.min(stepSize, this.maxFrames);
                //record the new duration to be used for the next trial
                this.duration[this.curSC][this.scTrial[this.curSC] + 1] = this.frames[this.curSC][this.scTrial[this.curSC] + 1] * this.speed;
                this.incorrectStreak[this.curSC] = 0; //reset the incorrect streak to 0 in order to start counting for the next step
                this.stepRising[this.curSC] = 1; //note that the subject is now rising in the staircase (to keep track of reversals)
                if (this.stepFalling[this.curSC]) { //if the subject's last step was a falling step, then record that there was a reversal
                    this.stepFalling[this.curSC] = 0; //now the subject is no longer taking a falling step
                    this.nRevs[this.curSC]++; //increase reversal count
                }
            }
            //no need to make any changes to the staircase, so keep the current frame number for the stimulus presentation duration
            else {
                this.frames[this.curSC][this.scTrial[this.curSC] + 1] = this.frames[this.curSC][this.scTrial[this.curSC]];
                this.duration[this.curSC][this.scTrial[this.curSC] + 1] = this.frames[this.curSC][this.scTrial[this.curSC] + 1] * this.speed;
            }
        }
        //otherwise, end the task
        else {
            this.done = true;
        }
        //record number of current reversals at this point in the task
        this.reversals[this.curSC][this.scTrial[this.curSC]] = this.nRevs[this.curSC];
        //update the counter for how many consecutive trials have had the floor stimulus presentation duration
        if (this.frames[this.curSC][this.scTrial[this.curSC]] == this.minFrames) {
            this.floorCount[this.curSC]++;
        }
        else {
            this.floorCount[this.curSC] = 0;
        }
        //do the same for the ceiling counter
        if (this.frames[this.curSC][this.scTrial[this.curSC]] == this.maxFrames) {
            this.ceilCount[this.curSC]++;
        }
        else {
            this.ceilCount[this.curSC] = 0;
        }
        //if either of the counters have reached the maximum number of trials allowed at the extremes, then end the task
        if (this.floorCount[this.curSC] == this.maxCeilTrials || this.ceilCount[this.curSC] == this.maxCeilTrials) {
            this.done = true;
        }
        //otherwise, if the subject has reached the number of reversals in the staircase needed, then end the task
        else if ((!this.outerOnly && this.nRevs[0] >= this.stopReversals && this.nRevs[1] >= this.stopReversals)
            || this.outerOnly && this.nRevs[1] >= this.stopReversals) {
            this.done = true;
        }
        //check if the step size needs to be updated based on the current number of reversals
        if (!this.done) {
            //continue to the next trial and get the next staircase
            this.trial++;
            this.scTrial[this.curSC]++;
            this.curSC = this.sc[this.trial];
            if (this.nRevs[this.curSC] >= this.switchReversals) {
                this.step[this.curSC] = this.finalStep;
            }
            else {
                this.step[this.curSC] = this.initStep;
            }
        }
    };
    return Ufov;
}());



/***/ }),

/***/ "./src/ui.ts":
/*!*******************!*\
  !*** ./src/ui.ts ***!
  \*******************/
/*! exports provided: Ui */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ui", function() { return Ui; });
/* harmony import */ var _enums_mode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums/mode */ "./src/enums/mode.ts");
/* harmony import */ var _enums_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enums/state */ "./src/enums/state.ts");


var Ui = /** @class */ (function () {
    function Ui(ufov) {
        this.cText = ['S', 'D'];
        this.ufov = ufov;
        this.canvas = document.querySelector('#exptCanvas');
        this.context = this.canvas.getContext('2d');
        this.dialogOpen = false;
        this.ecc = [3, 7];
        this.distEcc = [3, 5, 7];
        this.maskDensity = 2;
    }
    Ui.prototype.init = function () {
        //hide fullscreen message
        $('#preexpt').hide();
        //initialize canvas
        this.canvas.height = window.innerHeight; //set canvas to take up the full width of the browser
        this.canvas.width = window.innerWidth; //set canvas to take up the full height of the browser
        this.cx = Math.round(this.canvas.width / 2); //get center x coordinate of canvas
        this.cy = Math.round(this.canvas.height / 2); //get center y coordinate of canvas
        // Init stimuli size
        this.pimgsz = this.ufov.pxPerDeg;
        this.cimgsz = this.ufov.pxPerDeg;
        this.respsz = this.ufov.pxPerDeg;
        this.convertDeg2Px(); //figure out peripheral stimuli position
        this.createMask(); //create mask
        this.context.fillStyle = 'rgb(0, 0, 0)'; //fill canvas with black ba// ckground
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.addEventListener('click', this.mouseUpdate.bind(this)); //set up mouse listener for the canvas
        this.canvas.addEventListener('click', this.mouseUpdate.bind(this)); //set up mouse listener for the canvas
        this.canvas.addEventListener('mousemove', this.mouseHover.bind(this)); //add mouse listener for hovering over the canvas
        this.ufov.stateChange = true; //keeps track of when the state changed during a trial
        this.ufov.startTime = new Date().getTime(); //get the start time of the task
        this.initAssets();
    };
    Ui.prototype.initAssets = function () {
        //set up stimuli images
        var imgDir = './dist/assets/images/'; //image directory
        this.cimg = [new Image(), new Image()];
        this.cimg[0].src = imgDir + 'shorthair.jpg'; //short hair center target
        this.cimg[1].src = imgDir + 'longhair.jpg'; //long hair center target
        this.ptarget = new Image();
        this.pdistract = new Image();
        this.ptarget.src = imgDir + 'target.jpg'; //peripheral target
        this.pdistract.src = imgDir + 'distractor.jpg'; //peripheral distractor
        //setup feedback images
        this.response = [new Image(), new Image()];
        this.feedback = [new Image(), new Image()];
        this.response[0].src = imgDir + 'query.png'; //image to display when no center response has been given, or an invalid peripheral location was selected
        this.response[1].src = imgDir + 'whitex.png'; //marker for where the subject indicated there was a peripheral target
        this.feedback[0].src = imgDir + 'redx.png'; //feedback for getting the center or peripheral response incorrect
        this.feedback[1].src = imgDir + 'greencheck.png'; //feedback for getting the center or peripheral response correct
    };
    Ui.prototype.drawContent = function () {
        //check if the canvas is currently scaling (i.e., increasing the size) of what is drawn
        if (this.isScaled) {
            //set scaling back to original value
            this.context.scale(1 / this.maskDensity, 1 / this.maskDensity);
            //turn off scaling
            this.isScaled = false;
            //reset background to black
            this.context.fillStyle = 'rgb(0, 0, 0)';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        // clear canvas
        this.drawBlank();
        switch (this.ufov.state) {
            case _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].START:
                this.drawFix();
                this.drawOrder();
                break;
            case _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].FIX:
                this.drawFix();
                this.drawOrder();
                break;
            // delay period before stimulus presentation
            case _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].DELAY:
                //hide the mouse cursor before stimulus presentation
                $('#exptCanvas').css({ cursor: 'none' });
                break;
            // stimulus presentation
            case _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].STIM:
                //if it's a mode with the center target, then draw it
                if (this.ufov.mode !== _enums_mode__WEBPACK_IMPORTED_MODULE_0__["Mode"].PERIPHERAL) {
                    this.drawFace();
                }
                //if it's a mode with the peripheral target, then draw it
                if (this.ufov.mode !== _enums_mode__WEBPACK_IMPORTED_MODULE_0__["Mode"].CENTER) {
                    this.drawPeriph();
                }
                break;
            // Mask presentation
            case _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].MASK:
                this.drawMask();
                break;
            // response period
            case _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].RESPONSE:
                //show the mouse cursor again so that the subject can use it
                $('#exptCanvas').css({ cursor: 'default' });
                //if it's a practice mode with the peripheral target,
                //draw lines to represent the possible locations of the target
                if (this.ufov.mode > 1) {
                    this.drawSpokes();
                }
                //draw a question mark in the middle of the screen if the subject hasn't given a response
                //to the center target yet
                if (this.ufov.mode != 2 && this.ufov.cResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] == -1) {
                    this.context.drawImage(this.response[0], Math.round(this.cx - this.respsz / 2), Math.round(this.cy - this.respsz / 2), this.respsz, this.respsz);
                }
                this.displayPrompt(); //check if the subject needs to be prompted to respond
                break;
            // give subject feedback about their responses
            case _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].FEEDBACK:
                //keep lines for peripheral locations on the screen
                if (this.ufov.mode > 1) {
                    this.drawSpokes();
                }
                //give feedback for the peripheral response
                if (this.ufov.mode != 1) {
                    //if they gave the correct answer
                    if (this.ufov.pResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] == (this.ufov.pPos[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] % this.ufov.thetaPos.length)) {
                        this.context.drawImage(this.feedback[1], Math.round(this.x - this.respsz / 2), Math.round(this.y - this.respsz / 2), this.respsz, this.respsz); //display checkmark
                    }
                    //if they gave an incorrect answer
                    else {
                        this.context.drawImage(this.feedback[0], Math.round(this.x - this.respsz / 2), Math.round(this.y - this.respsz / 2), this.respsz, this.respsz); //display red X
                    }
                }
                //give feedback for the center response
                if (this.ufov.mode != 2) {
                    //if they gave the correct answer
                    if (this.ufov.cResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] == this.ufov.cStim[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]]) {
                        this.context.drawImage(this.feedback[1], Math.round(this.cx - this.respsz / 2), Math.round(this.cy - this.respsz / 2), this.respsz, this.respsz); //display checkmark
                    }
                    //if they gave an incorrect answer
                    else {
                        this.context.drawImage(this.feedback[0], Math.round(this.cx - this.respsz / 2), Math.round(this.cy - this.respsz / 2), this.respsz, this.respsz); //display red X
                    }
                }
                break;
        }
    };
    /**
     * At each frame, the frame is redrawn based on the current state
     */
    Ui.prototype.updateFrame = function () {
        //check if dialog window for instructions is open
        // @ts-ignore
        this.ufov.dialogOpen = $('#reminder').dialog('isOpen');
        if (this.ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].START) { //first trial of the task
            if (this.ufov.stateChange) {
                this.ufov.stateChange = false;
                this.drawContent(); //update content displayed
            }
        }
        else if (this.ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].FIX) { //start of a trial (that's not the first one)
            if (this.ufov.stateChange) {
                this.ufov.stateChange = false;
                this.drawContent(); //update content displayed
            }
            //wait for space bar
        }
    };
    /**
     * prepare the canvas for new stimuli by clearing it out and drawing a new gray circle at the center
     */
    Ui.prototype.drawBlank = function () {
        this.context.fillStyle = 'rgb(0, 0, 0)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'rgb(128,128,128)';
        this.context.beginPath();
        this.context.arc(this.cx, this.cy, Math.floor(this.canvas.height / 2), 0, 2 * Math.PI);
        this.context.fill();
    };
    /**
     * Draw order to start trial
     */
    Ui.prototype.drawOrder = function () {
        this.writeText('Press the space bar to start.', this.cx, this.cy + 25);
    };
    /**
     * Write a text
     */
    Ui.prototype.writeText = function (text, x, y) {
        this.context.fillStyle = 'black';
        this.context.font = 'bold 14pt Arial';
        this.context.textAlign = 'center';
        this.context.fillText(text, x, y);
    };
    /**
     * Write a letter at the center
     */
    Ui.prototype.writeLetter = function (letter) {
        this.context.fillStyle = "white";
        this.context.font = "bold 30pt Arial";
        this.context.textBaseline = "middle";
        this.context.textAlign = "center";
        this.context.fillText(letter, this.cx, this.cy);
    };
    /**
     * draw fixation point
     */
    Ui.prototype.drawFix = function () {
        this.context.fillStyle = 'white';
        this.context.fillRect(this.cx - 2, this.cy - 2, 5, 5);
        this.context.fillStyle = 'black';
        this.context.fillRect(this.cx - 1, this.cy - 1, 3, 3);
    };
    //draw the center target, based on what the trial calls for
    Ui.prototype.drawFace = function () {
        this.context.drawImage(this.cimg[this.ufov.cStim[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]]], Math.round(this.cx - this.cimgsz / 2), Math.round(this.cy - this.cimgsz / 2), this.cimgsz, this.cimgsz);
    };
    /**
     * Draw the mask after stimulus presentation
     */
    Ui.prototype.drawMask = function () {
        this.context.scale(this.maskDensity, this.maskDensity); //scale the canvas density so the mask image appears correctly
        this.context.drawImage(this.mask, 0, 0);
        this.isScaled = true; //note that we scaled the canvas
    };
    /**
     * Draw the peripheral target and distractors if needed
     */
    Ui.prototype.drawPeriph = function () {
        //peripheral target location holders
        var px;
        var py;
        //if it's staircase 1, then place the peripheral target at the outer circle
        if (this.ufov.curSC == 1) {
            px = this.pxxPos[this.ufov.pPos[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] + this.ufov.thetaPos.length * 2];
            py = this.pxyPos[this.ufov.pPos[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] + this.ufov.thetaPos.length * 2];
        }
        //otherwise if it's staircase 0, place the peripheral target at the inner circle
        else {
            px = this.pxxPos[this.ufov.pPos[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]]];
            py = this.pxyPos[this.ufov.pPos[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]]];
        }
        //now draw the peripheral target
        this.context.drawImage(this.ptarget, px - Math.round(this.pimgsz / 2), py - Math.round(this.pimgsz / 2), this.pimgsz, this.pimgsz);
        //record where it was drawn on the canvas
        this.ufov.pTargetX[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] = px - this.cx;
        this.ufov.pTargetY[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] = -(py - this.cy);
        //now draw all the distractors where the peripheral target is not
        for (var i = 0; i < this.pxxPos.length; i++) {
            if ((this.ufov.curSC == 0 && i != this.ufov.pPos[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]]) ||
                (this.ufov.curSC == 1 && i != this.ufov.pPos[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] + this.ufov.thetaPos.length * 2)) {
                this.context.drawImage(this.pdistract, Math.round(this.pxxPos[i] - this.pimgsz / 2), Math.round(this.pxyPos[i] - this.pimgsz / 2), this.pimgsz, this.pimgsz);
            }
        }
    };
    /**
     * draw spoke lines that represent the locations where the peripheral target can appear
     */
    Ui.prototype.drawSpokes = function () {
        this.context.strokeStyle = 'rgb(255,255,255)';
        this.context.beginPath();
        for (var i = 0; i < this.ufov.thetaPos.length; i++) {
            this.context.moveTo(this.cx + 0.5, this.cy + 0.5);
            //draws spoke edge to the edge of the circle
            this.context.lineTo(0.5 + this.pxxSpoke[i], 0.5 + this.pxySpoke[i]);
        }
        this.context.stroke();
    };
    /**
     * if the subject hasn't responded to the targets in a set amount of time,
     * prompt the subject to respond with a message displayed at the center of the screen
     */
    Ui.prototype.displayPrompt = function () {
        //first check if the prompt should be showm
        if (this.displayPrompt) {
            if (this.ufov.mode === _enums_mode__WEBPACK_IMPORTED_MODULE_0__["Mode"].CENTER || this.ufov.mode === _enums_mode__WEBPACK_IMPORTED_MODULE_0__["Mode"].PERIPHERAL) {
                //if only one response is needed, note that
                this.writeText('Please give a response.', this.cx, this.cy - 50);
            }
            else { //otherwise, let them know they need to respond to both the center and peripheral targets
                this.writeText('Please give both required responses.', this.cx, this.cy - 50);
            }
        }
    };
    Ui.prototype.createMask = function () {
        //create blank image of the dimensions of the canvas with the set mask density
        var mask = this.context.createImageData(Math.ceil(this.canvas.width / this.maskDensity), Math.ceil(this.canvas.height / this.maskDensity));
        var color;
        //randomly choose a grayscale color for each point in the image
        for (var i = 0; i < mask.width * mask.height * 4; i += 4) {
            color = Math.floor(Math.random() * 2) * 255;
            mask.data[i] = color;
            mask.data[i + 1] = color;
            mask.data[i + 2] = color;
            mask.data[i + 3] = 255;
        }
        //fill canvas with the mask image
        this.mask = document.createElement('canvas');
        this.mask.width = this.canvas.width;
        this.mask.height = this.canvas.height;
        this.mask.getContext('2d').putImageData(mask, 0, 0);
    };
    Ui.prototype.convertDeg2Px = function () {
        this.pxxPos = [];
        this.pxyPos = [];
        var posCount = 0;
        //determine position of peripheral stimuli
        for (var d = 0; d < this.distEcc.length; d++) { //calculate for each of the eccentricities listed (inner and outer circles)
            for (var i = 0; i < this.ufov.thetaPos.length; i++) {
                this.pxxPos[posCount] = this.cx + Math.round(this.ufov.pxPerDeg * this.distEcc[d] * Math.cos(Math.PI * this.ufov.thetaPos[i] / 180)); //x-coordinate
                this.pxyPos[posCount] = this.cy - Math.round(this.ufov.pxPerDeg * this.distEcc[d] * Math.sin(Math.PI * this.ufov.thetaPos[i] / 180)); //y-coordinate
                posCount++;
            }
        }
        //determine spoke outer point positions so that the lines extend all the way to the edge of the circle
        this.pxxSpoke = [];
        this.pxySpoke = [];
        for (var i = 0; i < this.ufov.thetaPos.length; i++) {
            this.pxxSpoke[i] = this.cx + Math.floor(this.canvas.height / 2 * Math.cos(Math.PI * this.ufov.thetaPos[i] / 180));
            this.pxySpoke[i] = this.cy - Math.floor(this.canvas.height / 2 * Math.sin(Math.PI * this.ufov.thetaPos[i] / 180));
        }
    };
    /**
     * this function detects when the mouse pointer is hovering over a peripheral line during the
     * response period, in order to give them feedback about which line they will be selecting when
     * they click
     */
    Ui.prototype.mouseHover = function (event) {
        //check first that the help dialog is not open
        if (!this.dialogOpen) {
            //only react to the pointer hovering when a peripheral response is needed
            if (this.ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].RESPONSE && this.ufov.mode > 1 &&
                this.ufov.pResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] < 0) {
                var mouseX = event.pageX; // - event.offsetX;
                var mouseY = event.pageY; // - event.offsetY;
                //determine which line the subject was attempting to select
                //(based on which is closest to the point they clicked on)
                var r = Math.sqrt(Math.pow(mouseX - this.cx, 2) + Math.pow(mouseY - this.cy, 2));
                var theta = (90 - 180 * Math.atan2(mouseX - this.cx, this.cy - mouseY) / Math.PI) % 360;
                var respDeg = 360;
                var choice = -1;
                for (var i = 0; i < this.ufov.thetaPos.length; i++) {
                    var minDeg = Math.min(Math.abs(theta - this.ufov.thetaPos[i]), Math.abs(360 + theta - this.ufov.thetaPos[i]));
                    if (minDeg < respDeg) {
                        respDeg = minDeg;
                        choice = i;
                    }
                }
                var hoveredLine = -1;
                //if they are within range of a nearby line, then mark it as the one they are hovering over
                if (r >= this.ufov.respDegMin && r <= this.cy && respDeg <= this.ufov.respDegLim) {
                    hoveredLine = choice;
                }
                this.drawBlank(); //clear canvas
                //Highlight the line the subject is hovering over in a different color
                this.context.strokeStyle = 'rgb(255,255,0)';
                this.context.lineWidth = 3;
                this.context.beginPath();
                this.context.moveTo(this.cx + 0.5, this.cy + 0.5);
                //draws highlighted spoke
                this.context.lineTo(0.5 + this.pxxSpoke[hoveredLine], 0.5 + this.pxySpoke[hoveredLine]);
                this.context.stroke();
                //redraw all the other peripheral lines since they were cleared out
                this.context.strokeStyle = 'rgb(255,255,255)';
                this.context.lineWidth = 1;
                this.context.beginPath();
                for (var i = 0; i < this.ufov.thetaPos.length; i++) {
                    if (i != hoveredLine) {
                        this.context.moveTo(this.cx + 0.5, this.cy + 0.5);
                        //draws spoke edge to the edge of the circle
                        this.context.lineTo(0.5 + this.pxxSpoke[i], 0.5 + this.pxySpoke[i]);
                    }
                }
                this.context.stroke();
                this.context.fillStyle = 'white';
                //add back any marker (letter) about what the subject responded for the center target
                if (this.ufov.mode != 2 && this.ufov.cResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] != -1) {
                    this.context.font = 'bold 30pt Arial';
                    this.context.textBaseline = 'middle';
                    this.context.textAlign = 'center';
                    this.context.fillText(this.cText[this.ufov.cResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]]], this.cx, this.cy);
                }
                //otherwise, add back a question mark to the center of the screen since the subject hasn't responded yet
                else if (this.ufov.mode != 2 && this.ufov.cResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] == -1) {
                    this.context.drawImage(this.response[0], Math.round(this.cx - this.respsz / 2), Math.round(this.cy - this.respsz / 2), this.respsz, this.respsz);
                }
                //check if a question mark needs to be drawn if the subject clicked on an invalid spot for the peripheral target
                if (this.ufov.mode != 1 && this.ufov.pResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] == -2) {
                    this.context.drawImage(this.response[0], Math.round(this.x - this.respsz / 2), Math.round(this.y - this.respsz / 2), this.respsz, this.respsz);
                }
                this.displayPrompt(); //check if the subject needs to be prompted to respond
            }
        }
    };
    Ui.prototype.mouseUpdate = function (event) {
        //check first that the help dialog is not open
        if (!this.dialogOpen) {
            //only respond to a mouse click if when a peripheral response is needed
            if (this.ufov.state === _enums_state__WEBPACK_IMPORTED_MODULE_1__["State"].RESPONSE && (this.ufov.mode == 2 || this.ufov.mode == 3)
                && this.ufov.pResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] < 0) {
                //get mouse coordinates in relation to the canvas
                this.x = event.pageX - this.canvas.offsetLeft;
                this.y = event.pageY - this.canvas.offsetTop;
                this.drawContent(); //update content displayed
                //if the subject has already responded to the center target, redraw the marker (letter) for their response
                if (this.ufov.mode > 2 && this.ufov.cResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] != -1) {
                    this.context.fillStyle = 'white';
                    this.context.font = 'bold 30pt Arial';
                    this.context.textBaseline = 'middle';
                    this.context.textAlign = 'center';
                    this.context.fillText(this.cText[this.ufov.cResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]]], this.cx, this.cy);
                }
                //determine which line the subject was attempting to select
                //(based on which is closest to the point they clicked on)
                var r = Math.sqrt(Math.pow(this.x - this.cx, 2) + Math.pow(this.y - this.cy, 2));
                var theta = (90 - 180 * Math.atan2(this.x - this.cx, this.cy - this.y) / Math.PI) % 360;
                var respDeg = 360;
                var choice = -1;
                for (var i = 0; i < this.ufov.thetaPos.length; i++) {
                    var minDeg = Math.min(Math.abs(theta - this.ufov.thetaPos[i]), Math.abs(360 + theta - this.ufov.thetaPos[i]));
                    if (minDeg < respDeg) {
                        respDeg = minDeg;
                        choice = i;
                    }
                }
                //check if the subject's click was close enough to a line, based on the accepted range parameters
                if (r >= this.ufov.respDegMin && r <= this.cy && respDeg <= this.ufov.respDegLim) {
                    //check if the subject's click was close enough to a line, based on the accepted range parameters
                    this.ufov.pRT[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] = new Date().getTime() - this.ufov.startWait;
                    this.ufov.pResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] = choice;
                    //record specifically where the subject clicked
                    this.ufov.pX[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] = this.x - this.cx;
                    this.ufov.pY[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] = -(this.y - this.cy);
                    //draw an X where the subject clicked
                    this.context.drawImage(this.response[1], Math.round(this.x - this.respsz / 2), Math.round(this.y - this.respsz / 2), this.respsz, this.respsz);
                }
                //otherwise, if the click point is outside of the accepted range, display a
                //question mark and have the subject reselect a peripheral line
                else {
                    this.ufov.pResp[this.ufov.curSC][this.ufov.scTrial[this.ufov.curSC]] = -2; //this response means they need to give a new response to the peripheral target
                    this.context.drawImage(this.response[0], Math.round(this.x - this.respsz / 2), Math.round(this.y - this.respsz / 2), this.respsz, this.respsz);
                }
                this.displayPrompt(); //check if the subject needs to be prompted to respond
            }
        }
    };
    return Ui;
}());



/***/ }),

/***/ "./src/utils/calibration.ts":
/*!**********************************!*\
  !*** ./src/utils/calibration.ts ***!
  \**********************************/
/*! exports provided: getCalibration */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCalibration", function() { return getCalibration; });
/* Calibration/calibrationcode.js
 * This js code does the calculation for pixels/degree, based on the subject's screen size
 * and moves the subject along through each step. At the end, it sends the relevant calibration
 * information to a php script (addcalibration.php) so that the data can be added to the
 * database.
 */
var distance = 58; //cm, chosen distance from screen as this approximates to an arm's length
var pxDiagonal = Math.sqrt(Math.pow(screen.width, 2) + Math.pow(screen.height, 2)); //get the screen's diagonal size in pixels
//slider parameters for changing the displayed object's size
//the units are inches * 10 (the * 10 helps to elongate the slider's appearances)
var screenMin = 10; //minimum screen size allowed for the task
var screenMax = 40; //maximum screen size allowed for the task
var min = screenMin * 10;
var max = screenMax * 10;
/**
 * This function calculates pixels per degrees, based on the size of the monitor
 */
var getCalibration = function (screenSize) {
    if (screenSize === void 0) { screenSize = 24; }
    // first pixels per inch is converted to pixels per centimeter (used for drawing the brightness/contrast grayscale rectangles)
    var pxPerInch = pxDiagonal / screenSize;
    var pxPerCm = Math.round(pxPerInch / 2.54);
    //then calculate pixels per degree
    var angle = Math.atan(screen.height / screen.width);
    var diagCM = ((max - (max - screenSize * 10 + min) + min) / 10) * 2.54;
    var screenWidthCM = diagCM * Math.cos(angle);
    var pxPerDeg = Math.PI / 180 * screen.width * distance / screenWidthCM;
    //get the subject's current local time
    var date = new Date();
    var localSec = Math.round(date.getTime() / 1000) - date.getTimezoneOffset() * 60;
    return {
        pxWidth: screen.width,
        pxHeight: screen.height,
        pxPerDeg: pxPerDeg,
        localSec: localSec,
    };
};


/***/ }),

/***/ "./src/utils/create-empty-2d-array.ts":
/*!********************************************!*\
  !*** ./src/utils/create-empty-2d-array.ts ***!
  \********************************************/
/*! exports provided: createEmpty2dArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEmpty2dArray", function() { return createEmpty2dArray; });
var createEmpty2dArray = function (size) {
    var empty2DArray = [[], []];
    for (var i = 0; i < size; i++) {
        empty2DArray[0][i] = -1;
        empty2DArray[1][i] = -1;
    }
    return empty2DArray;
};


/***/ }),

/***/ "./src/utils/fullscreen.ts":
/*!*********************************!*\
  !*** ./src/utils/fullscreen.ts ***!
  \*********************************/
/*! exports provided: openFullscreen, closeFullscreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openFullscreen", function() { return openFullscreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "closeFullscreen", function() { return closeFullscreen; });
var openFullscreen = function () {
    var page = document.documentElement;
    if (page.requestFullscreen) {
        page.requestFullscreen().then(function () { return console.log('fullscreen open'); });
    }
    else if (page.mozRequestFullScreen) { /* Firefox */
        page.mozRequestFullScreen();
    }
    else if (page.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        page.webkitRequestFullscreen();
    }
    else if (page.msRequestFullscreen) { /* IE/Edge */
        page.msRequestFullscreen();
    }
};
var closeFullscreen = function () {
    var page = document.documentElement;
    if (page.exitFullscreen) {
        page.exitFullscreen();
    }
    else if (page.mozCancelFullScreen) { /* Firefox */
        page.mozCancelFullScreen();
    }
    else if (page.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        page.webkitExitFullscreen();
    }
    else if (page.msExitFullscreen) { /* IE/Edge */
        page.msExitFullscreen();
    }
};


/***/ }),

/***/ "./src/utils/submit-results.ts":
/*!*************************************!*\
  !*** ./src/utils/submit-results.ts ***!
  \*************************************/
/*! exports provided: submitResults */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "submitResults", function() { return submitResults; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

//send all of the trial data at once to the database via the ufov/save.php script;
var submitResults = function (ufov) {
    //keep track of trials per staircase
    var scCount = [0, 0];
    //condense all data from both staircases into one array for each variable
    var frames = [];
    var duration = [];
    var actualDuration = [];
    var cStim = [];
    var cResp = [];
    var cRT = [];
    var cCorrect = [];
    var pPos = [];
    var pTargetX = [];
    var pTargetY = [];
    var pResp = [];
    var pX = [];
    var pY = [];
    var pRT = [];
    var pCorrect = [];
    var trialStart = [];
    var reversals = [];
    //get subject's current local time
    var date = new Date();
    var localsec = Math.round(date.getTime() / 1000) - date.getTimezoneOffset() * 60;
    //now combine both staircases data together
    for (var i = 0; i <= ufov.trial; i++) {
        var sc = ufov.sc[i];
        var t = scCount[sc];
        frames.push(ufov.frames[sc][t]);
        duration.push(ufov.duration[sc][t]);
        actualDuration.push(ufov.endTimes[i] - ufov.startTimes[i]); //calculate actual duration of stimulus presentation
        cStim.push(ufov.cStim[sc][t]);
        cResp.push(ufov.cResp[sc][t]);
        cRT.push(ufov.cRT[sc][t]);
        cCorrect.push(ufov.cCorrect[sc][t]);
        pPos.push(ufov.pPos[sc][t]);
        pTargetX.push(ufov.pTargetX[sc][t]);
        pTargetY.push(ufov.pTargetY[sc][t]);
        pResp.push(ufov.pResp[sc][t]);
        pX.push(ufov.pX[sc][t]);
        pY.push(ufov.pY[sc][t]);
        pRT.push(ufov.pRT[sc][t]);
        pCorrect.push(ufov.pCorrect[sc][t]);
        trialStart.push(ufov.trialStart[sc][t]);
        reversals.push(ufov.reversals[sc][t]);
        scCount[sc]++;
    }
    return axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('save.php', {
        frames: frames.join(";"),
        duration: duration.join(";"),
        actualDuration: actualDuration.join(";"),
        cStim: cStim.join(";"),
        cResp: cResp.join(";"),
        cRT: cRT.join(";"),
        cCorrect: cCorrect.join(";"),
        pPos: pPos.join(";"),
        pTargetX: pTargetX.join(";"),
        pTargetY: pTargetY.join(";"),
        pResp: pResp.join(";"),
        pX: pX.join(";"),
        pY: pY.join(";"),
        pRT: pRT.join(";"),
        pCorrect: pCorrect.join(";"),
        trialStart: trialStart.join(";"),
        reversals: reversals.join(";"),
        pxperdeg: ufov.pxPerDeg,
        localsec: localsec //the subject's current local time
    }); //once the script is done, then go to the end of the task
};


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map