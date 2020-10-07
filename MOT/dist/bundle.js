var MOT =
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

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "/* style.css:\r\n * Makes additional style modifications to index.php\r\n */\r\n\r\nhtml, body {\r\n    margin: 0;\r\n    color: white;\r\n}\r\n\r\nbody {\r\n    font-family: Helvetica, Arial, sans-serif;\r\n    background-color: black;\r\n    text-align: center;\r\n    color: white;\r\n}\r\n\r\n.ui-widget-content {\r\ncolor: white;\r\n}\r\n\r\n#content {\r\nbackground: rgb(128, 128, 128);\r\nwidth: 50%;\r\nmargin: 1rem auto;\r\npadding: 1em 2em;\r\noverflow: auto;\r\n}\r\n\r\n#error {\r\ncolor: #FFCC00;\r\npadding-bottom: 0.5em;\r\nfont-size: 0.8em;\r\n}\r\n\r\n.ui-widget-content a {\r\ntext-decoration: none;\r\nfont-weight: bold;\r\n}\r\n\r\na:hover {\r\ncolor: white;\r\n}\r\n\r\n.ui-button {\r\nfont-size: 16px;\r\n}\r\n\r\n.small-text {\r\nfont-size: 0.8em;\r\n}\r\n\r\np {\r\n    font-family: \"Open Sans\", sans-serif;\r\n}\r\n\r\n#preexpt {\r\n    max-width: 1024px;\r\n    margin: 6rem auto 0;\r\n}\r\n\r\n#instructions {\r\n    font-size:1em;\r\n    margin: 0;\r\n    text-align: left;\r\n    height: 100px;\r\n}\r\n\r\n#backButton, #forwardButton {\r\n    padding: 0;\r\n    margin-bottom: 0.5em;\r\n    margin-top: 0.5em;\r\n}\r\n\r\n#content {\r\n    padding-bottom: 0.5em;\r\n    width: 50%;\r\n    margin: auto;\r\n}\r\n\r\n#reminder {\r\n    font-size: 0.8em;\r\n    text-align: left;\r\n}\r\n\r\n#reminderButton {\r\n    position: absolute;\r\n    right: 0%;\r\n    bottom: 0%;\r\n}\r\n\r\n.highlight {\r\n    color: #59E01B;\r\n    font-weight: bold;\r\n}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

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

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./src/config/bavelier.ts":
/*!********************************!*\
  !*** ./src/config/bavelier.ts ***!
  \********************************/
/*! exports provided: config */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
var config = {
    numDots: 16,
    straightProb: 0.4,
    angSD: 0.2,
};


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
})(Keys || (Keys = {}));


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
})(State || (State = {}));


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: init, keyboardResponse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keyboardResponse", function() { return keyboardResponse; });
/* harmony import */ var _config_bavelier__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config/bavelier */ "./src/config/bavelier.ts");
/* harmony import */ var _enums_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enums/keys */ "./src/enums/keys.ts");
/* harmony import */ var _enums_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./enums/state */ "./src/enums/state.ts");
/* harmony import */ var _mot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mot */ "./src/mot.ts");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ui */ "./src/ui.ts");
/* harmony import */ var _utils_calibration__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/calibration */ "./src/utils/calibration.ts");
/* harmony import */ var _utils_fullscreen__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/fullscreen */ "./src/utils/fullscreen.ts");
/* harmony import */ var _utils_submit_results__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/submit-results */ "./src/utils/submit-results.ts");
// import $ from 'jquery';









/**
 * This experience is calibrated to work on Viewpixx screen of 24 inch
 */
var monitorSize = 24;
var mot, ui, pxPerDeg;
// *********************** DRAWING CONTROL ************************ //
// for efficient redraw calls (from Paul Irish - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
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
var init = function (options) {
    var continueButton = $('#cButton');
    var reminderButton = $('#reminderButton');
    var reminderDialog = $('#reminder');
    if (!options.pxPerDeg) {
        var calibration = Object(_utils_calibration__WEBPACK_IMPORTED_MODULE_6__["getCalibration"])(monitorSize);
        pxPerDeg = calibration.pxPerDeg;
    }
    else {
        pxPerDeg = options.pxPerDeg;
    }
    mot = new _mot__WEBPACK_IMPORTED_MODULE_3__["Mot"](_config_bavelier__WEBPACK_IMPORTED_MODULE_0__["config"], pxPerDeg, options.dots);
    ui = new _ui__WEBPACK_IMPORTED_MODULE_5__["Ui"](mot);
    //hide content before subject starts
    $('#postexpt').hide();
    /**
     * Set up the continue button that allows the subject to start the task
     */
    // @ts-ignore
    continueButton.button();
    continueButton.click(function () {
        Object(_utils_fullscreen__WEBPACK_IMPORTED_MODULE_7__["openFullscreen"])();
        ui.init();
    });
    // @ts-ignore
    continueButton.button('option', 'disabled', true);
    /**
     * Set up the reminder button which brings up short instructions in a dialog box
     */
    // @ts-ignore
    reminderButton.button({
        icons: {
            primary: 'ui-icon-info',
        },
        text: false,
    });
    reminderButton.click(function () {
        // @ts-ignore
        reminderDialog.dialog('open');
    });
    /**
     * set up the reminder dialog that appears with short instructions
     */
    // @ts-ignore
    reminderDialog.dialog({
        autoOpen: false,
        modal: true,
        title: 'Instructions & Controls',
        width: 400,
    });
    //add keyboard listener to keep track of keys the subject presses
    window.addEventListener('keydown', keyboardResponse, true);
    //subject can now move on, now that everything is setup, so enable continue button
    // @ts-ignore
    continueButton.button('option', 'disabled', false);
    /**
     * Start the task
     */
    draw(); //start the task
};
// ************************* STATE UPDATES *************************** //
//At each frame, the frame is redrawn based on the current state
function updateFrame() {
    //check if dialog window for instructions is open
    if (mot) {
        // @ts-ignore
        mot.dialogOpen = !!$('#reminder').dialog('isOpen');
    }
    if (mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].START || mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].FIX) { //start of task or start of trial
        if (mot.stateChange) {
            mot.stateChange = false; //turn off state change
            mot.trialSeed[mot.trial] = mot.trial; //set trial seed
            // @ts-ignore
            Math.seedrandom(mot.trial); //create random number generator based on seed
            ui.drawContent(); //draw updated content
        }
        //wait for space bar
    }
    else if (mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].BREAK) { //break between blocks
        if (mot.stateChange) {
            mot.stateChange = false; //turn off state change
            ui.drawContent(); //draw updated content
        }
        //wait for space bar
    }
    else if (mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].CUE) { //display dots that should be tracked while moving all dots around
        if (mot.stateChange) {
            mot.startWait = performance.now(); //get start time of cue period
            mot.stateChange = false; //turn off state change
            mot.initState = true; //note that the trial needs to be set up
            ui.drawContent(); //draw updated content
        }
        //check how much time has passed; if the full time for the cue period has passed, move onto the "move" state
        if (performance.now() >= mot.startWait + mot.tCue) {
            mot.state = _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].MOVE;
            mot.stateChange = true;
        }
        else {
            //keep updating movement of dots
            ui.drawContent();
        }
    }
    else if (mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].MOVE) { //change the target dots to normal color (dots still moving)
        if (mot.stateChange) {
            mot.startWait = performance.now(); //get start time of move period
            mot.stateChange = false; //turn off state change
            ui.drawContent(); //draw updated content
        }
        //check how much time has passed; if the full time for the cue period has passed, move onto the "response" state
        if (performance.now() >= mot.startWait + mot.tMove) {
            mot.state = _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].RESPONSE;
            mot.stateChange = true;
        }
        else {
            //keep updating movement of dots
            ui.drawContent();
        }
    }
    else if (mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].RESPONSE) { //wait for subject response to the probed dot
        if (mot.stateChange) {
            mot.startWait = performance.now(); //get start time of response period
            mot.stateChange = false; //turn off state change
            //choose randomly (~50/50) whether or not the dot selected will be an originally cued dot or not
            ui.probeTracked[mot.trial] = Math.round(mot.targetRandomizer());
            if (ui.probeTracked[mot.trial]) { //if it is, then randomly select one of the cued dots as the queried dot
                ui.probedDot[mot.trial] = Math.floor(mot.targetRandomizer() * mot.numAttendDots[mot.trial]);
            }
            else { //otherwise, choose any of the other dots as the queried dot
                ui.probedDot[mot.trial] = Math.floor(mot.targetRandomizer() * (mot.numDots - mot.numAttendDots[mot.trial])) + mot.numAttendDots[mot.trial];
            }
            ui.drawContent(); //update the content
        }
        //once the subject has given a response for the trial, then move on
        if (mot.response[mot.trial] !== -1) {
            mot.updateTrial(); //update trial data
            if (mot.done) { //if this was the last trial, then take the participant to the end of the task
                mot.state = _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].DONE;
                Object(_utils_submit_results__WEBPACK_IMPORTED_MODULE_8__["submitResults"])(mot, ui, mot.pxPerDeg)
                    .then(function () {
                    $('#exptCanvas').hide();
                    var percentCorrect = Math.round(mot.blockCorrect / mot.trialsPerBlock * 100);
                    var finalText = 'Done! You got ' + percentCorrect + '% correct for this final block.';
                    $('#postexpt-result').text(finalText);
                    $('#postexpt').show();
                }); //send data to database
            }
            else if (mot.trial % mot.trialsPerBlock === 0) { //if this was the last trial of a block, then let the subject take a break
                mot.state = _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].BREAK;
            }
            else { //otherwise, move onto the next trial
                mot.state = _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].FIX;
            }
            mot.stateChange = true;
        }
    }
}
var keyboardResponse = function (event) {
    //only respond to any key presses if the dialog window for instructions is not open
    if (mot.dialogOpen)
        return;
    //if we're in the response state and the subject has yet to give a response to the trial
    if (mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].RESPONSE && mot.response[mot.trial] === -1) {
        if (event.keyCode == _enums_keys__WEBPACK_IMPORTED_MODULE_1__["Keys"].NO) { //the subject has indicated that the queried dot was not a cued dot
            mot.rt[mot.trial] = performance.now() - mot.startWait; //get response time
            mot.response[mot.trial] = 0; //set response given by subject
        }
        else if (event.keyCode === _enums_keys__WEBPACK_IMPORTED_MODULE_1__["Keys"].YES) { //the subject has indicated the queried dot was a cued dot
            mot.rt[mot.trial] = performance.now() - mot.startWait; //get response time
            mot.response[mot.trial] = 1; //set response given by subject
        }
        //check if the subject was correct or not, and record this
        if (mot.response[mot.trial] === ui.probeTracked[mot.trial]) {
            mot.correct[mot.trial] = 1;
        }
        else {
            mot.correct[mot.trial] = 0;
        }
        //keep track of number of trials correct for the current block
        mot.blockCorrect = mot.blockCorrect + mot.correct[mot.trial];
    }
    //if the trial start key was pressed and it's the start of a trial, then start the trial
    if (event.keyCode === _enums_keys__WEBPACK_IMPORTED_MODULE_1__["Keys"].START && (mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].START || mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].FIX)) {
        mot.trialStart[mot.trial] = performance.now() - mot.startTime;
        mot.state = _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].CUE;
        mot.stateChange = true;
        console.log('Start');
    }
    //if the break end key was pressed and it's currently a break, then start the next block
    if (event.keyCode === _enums_keys__WEBPACK_IMPORTED_MODULE_1__["Keys"].RESUME && mot.state === 'break') {
        mot.blockCorrect = 0; //reset number of correct trials for this block
        mot.state = _enums_state__WEBPACK_IMPORTED_MODULE_2__["State"].FIX; //change state to start a new trial
        mot.stateChange = true;
    }
    if (event.keyCode === _enums_keys__WEBPACK_IMPORTED_MODULE_1__["Keys"].QUIT) {
        Object(_utils_fullscreen__WEBPACK_IMPORTED_MODULE_7__["closeFullscreen"])();
    }
};
// // *********************** INITIALIZATION ************************** //
//
// //wait until the HTML5 page is ready before setting up all the widgets
// init();


/***/ }),

/***/ "./src/mot.ts":
/*!********************!*\
  !*** ./src/mot.ts ***!
  \********************/
/*! exports provided: Mot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mot", function() { return Mot; });
/* harmony import */ var _enums_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums/state */ "./src/enums/state.ts");
/* harmony import */ var _trialorder_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./trialorder.json */ "./src/trialorder.json");
var _trialorder_json__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./trialorder.json */ "./src/trialorder.json", 1);


var Mot = /** @class */ (function () {
    function Mot(config, pxPerDeg, dots) {
        /**
         * Value from config
         */
        this.pxPerDeg = pxPerDeg;
        this.numDots = config.numDots;
        this.straightProb = config.straightProb;
        this.angSD = config.angSD;
        this.numAttendDots = dots || _trialorder_json__WEBPACK_IMPORTED_MODULE_1__; //number of dots to attend to per trial (obtained from MOT/code.php)
        /**
         * Trial variables
         */
        this.targetSeed = new Date().getTime(); //stores seed used for the randon number generator used for initial dot setup
        // @ts-ignore
        this.targetRandomizer = new Math.seedrandom(this.targetSeed); //set RNG with seed
        this.trialSeed = []; //stores what seed was used for each trial
        this.drawCounter = []; //stores how many frames were drawn per trial
        this.numTrials = this.numAttendDots.length; // total number of trials
        /**
         * Timing variables
         */
        this.speed = 16; //length of time for each frame (ms/frame)
        this.tCue = 2000; //duration of presentation of cue (ms)
        this.tMove = 4000; //duration of dots moving (after the cue period) before asking about probed dot (ms)
        this.dotVel = 5; //velocity of dots in degrees/sec
        this.vel = Math.ceil(this.dotVel * pxPerDeg / (1 / (this.speed / 1000))); //velocity of dots in pixels/frame
        this.startWait = 0; //keeps track of timer start
        /**
         * Image config
         */
        this.dotRad = Math.round(0.4 * pxPerDeg); //dot radius (deg*ppd)
        this.imageSize = this.dotRad * 2; //dot size (diameter, in pixels)
        /**
         *  Stimuli movement Limits
         */
        this.minSep = Math.round(1.5 * pxPerDeg); //minimum distance allowed between dots (deg*ppd)
        this.minFix = Math.round(3 * pxPerDeg); //minimum distance allowed from fixation (deg*ppd)
        this.maxFix = Math.round(10 * pxPerDeg); //maximum distance allowed from fixation (deg*ppd)
        this.minEdge = Math.ceil(2 * Math.sqrt(2) * (this.vel + 1)) + this.dotRad + 4; //minimum distance from edge
        /**
         * Counters and data arrays
         */
        this.trial = 0; //current trial
        this.trialStart = []; //stores start time of each trial
        this.response = []; //stores subject's responses per trial
        this.correct = []; //stores if subject was correct per trial
        this.rt = []; //response time per trial
        /**
         * Initial first trial values
         */
        this.response[0] = -1;
        this.correct[0] = -1;
        this.rt[0] = -1;
        /**
         * State control
         */
        this.state = _enums_state__WEBPACK_IMPORTED_MODULE_0__["State"].START;
        this.done = false;
        this.stateChange = false; //keeps track if the state changed during the trial
        this.dialogOpen = false; //keeps track of whether dialog window is open or not
        this.initState = false; //keeps track if the current trial needs to be initialized
        /**
         * Trial config
         */
        this.numBlocks = 3; //total number of blocks
        this.blockCorrect = 0; //stores number of correct trials in a block
        this.trialsPerBlock = Math.round(this.numTrials / this.numBlocks); //number of trials per block, should be equal for all blocks
    }
    // ***************** TRIAL UPDATE ********************* //
    /**
     * this function prepares the state of the next trial
     */
    Mot.prototype.updateTrial = function () {
        this.trial++;
        if (this.trial >= this.numTrials) {
            this.done = true;
        }
        else {
            this.response[this.trial] = -1;
        }
    };
    return Mot;
}());



/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),

/***/ "./src/trialorder.json":
/*!*****************************!*\
  !*** ./src/trialorder.json ***!
  \*****************************/
/*! exports provided: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, default */
/***/ (function(module) {

module.exports = JSON.parse("[3,5,4,2,1,2,4,5,3,3,1,2,4,5,4,3,2,5,2,5,1,4,3,3,4,2,5,3,4,5,2,1,3,4,5,2,4,5,3,1,2,4,2,5,3]");

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
/* harmony import */ var _enums_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums/state */ "./src/enums/state.ts");
/* harmony import */ var _utils_create_empty_dot_array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/create-empty-dot-array */ "./src/utils/create-empty-dot-array.ts");
// import $ from 'jquery';


var Ui = /** @class */ (function () {
    function Ui(mot) {
        this.mot = mot;
        this.canvas = document.querySelector('#exptCanvas');
        this.context = this.canvas.getContext("2d");
        this.dotPosX = Object(_utils_create_empty_dot_array__WEBPACK_IMPORTED_MODULE_1__["createEmptyDotArray"])(mot.numTrials, mot.numDots); //stores X position of each dot per trial (updated at each frame)
        this.dotPosY = Object(_utils_create_empty_dot_array__WEBPACK_IMPORTED_MODULE_1__["createEmptyDotArray"])(mot.numTrials, mot.numDots); //stores Y position of each dot per trial (updated at each frame)
        this.dotMovAng = []; //stores current angle of motion for each dot (updated at each frame)
        this.probeTracked = []; //store whether the trial asked if a dot that needed to be attended to (blue) was the dot that was queried about at the end of a trial
        this.probedDot = []; //store the identity of the probed dot (the one asked about at the end of the trial)
    }
    Ui.prototype.init = function () {
        $("#preexpt").hide();
        this.canvas.height = window.innerHeight; //set canvas height to full browser window size for content
        this.canvas.width = window.innerWidth; //make the canvas square
        this.context.fillStyle = "rgb(0, 0, 0)"; //set the canvas color to black
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.cx = Math.round(this.canvas.width / 2); //get center x coordinate of canvas
        this.cy = Math.round(this.canvas.height / 2); //get center y coordinate of canvas
        //setting up the stimuli images
        var baseUrl = '/public';
        var images = [
            './dist/assets/images/happy_face.png',
            './dist/assets/images/sad_face.png',
            './dist/assets/images/query.png'
        ];
        this.sprites = images.map(function (src) {
            var image = new Image();
            image.src = src;
            return image;
        });
        this.mot.maxFix = Math.min(this.mot.maxFix, this.cy);
        this.mot.stateChange = true; //update the content to the current state
        this.mot.startTime = performance.now(); //get the task start time
    };
    Ui.prototype.drawContent = function () {
        //set the background to black
        this.context.fillStyle = "rgb(0, 0, 0)";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        //create the gray circle that the dots move within
        //(size is the extent of the canvas)
        this.context.fillStyle = "rgb(128, 128, 128)";
        this.context.beginPath();
        this.context.arc(this.cx, this.cy, Math.floor(this.mot.maxFix - 15), 0, 2 * Math.PI);
        this.context.fill();
        //draw on canvas based on state
        if (this.mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_0__["State"].START || this.mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_0__["State"].FIX) {
            this.mot.drawCounter[this.mot.trial] = 0; //reset counter for keeping track of number of frames drawn during a trial
            this.drawFix(); //draw fixation point
            //set font parameters
            this.context.fillStyle = "black";
            this.context.font = "12pt Arial";
            this.context.textAlign = "center";
            //set text displayed to subject
            this.context.fillText("Press the space bar to start the trial.", this.cx, this.cy + 25);
        }
        else if (this.mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_0__["State"].BREAK) {
            //set font parameters
            this.context.fillStyle = "black";
            this.context.font = "12pt Arial";
            this.context.textAlign = "center";
            //calculate percent correct for the block
            var percentCorrect = Math.round(this.mot.blockCorrect / this.mot.trialsPerBlock * 100);
            //set feedback text displayed
            var breakText1 = "You got " + percentCorrect + "% correct for this block. Time to take a break!";
            var breakText2 = "When you are ready to resume the task, press Enter.";
            this.context.fillText(breakText1, this.cx, this.cy + 25);
            this.context.fillText(breakText2, this.cx, this.cy + 50);
        }
        else if (this.mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_0__["State"].CUE || this.mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_0__["State"].MOVE) {
            this.mot.drawCounter[this.mot.trial]++; //increment frame counter
            this.drawFix(); //draw fixation point
            console.log('Init State');
            if (this.mot.initState) {
                //it's the initialization state, so set up all the dots
                $("#exptCanvas").css({ cursor: 'none' }); //hide the cursor
                //Now draw target and distractor dots moving:
                //choose initial positions and velocities
                for (var i = 0; i < this.mot.numDots; i++) {
                    var restart = 1; //keeps track if the initial dot position need to be recalculated
                    while (restart) {
                        restart = 0;
                        //choose the initial x and y position for this dot (a valid position within the boundaries)
                        this.dotPosX[this.mot.trial][i] = Math.random() * 2 * (this.mot.maxFix - this.mot.minEdge) + this.mot.minEdge + this.cx - this.mot.maxFix;
                        this.dotPosY[this.mot.trial][i] = Math.random() * 2 * (this.mot.maxFix - this.mot.minEdge) + this.mot.minEdge + this.cy - this.mot.maxFix;
                        // if the dot ended up outside of the boundaries, then refind a position for this dot
                        var r2 = Math.pow(this.dotPosX[this.mot.trial][i] - this.cx, 2) + Math.pow(this.dotPosY[this.mot.trial][i] - this.cy, 2);
                        if (r2 < Math.pow(this.mot.minFix, 2) || r2 > Math.pow(this.mot.maxFix - this.mot.minEdge, 2)) {
                            restart = 1;
                            console.log('This one');
                            continue;
                        }
                        //then check the distances between this dot and all previously positioned dots
                        if (!restart && i >= 1) {
                            for (var j = 0; j < i; j++) {
                                //if it starts too close to another dot, then find a new position for this current dot
                                if (Math.pow(this.dotPosX[this.mot.trial][i] - this.dotPosX[this.mot.trial][j], 2) + Math.pow(this.dotPosY[this.mot.trial][i] - this.dotPosY[this.mot.trial][j], 2) < Math.pow(this.mot.minSep, 2)) {
                                    restart = 1;
                                    break;
                                }
                            }
                        }
                    }
                }
                for (var i = 0; i < this.mot.numDots; i++) {
                    //now randomly assign a starting angle of motion for each dot
                    this.dotMovAng[i] = Math.random() * 2 * Math.PI;
                    var faceType = void 0;
                    //the first X dots in the array start as the cued dots (X = total number of dots to attend to during that trial)
                    if (i < this.mot.numAttendDots[this.mot.trial]) {
                        faceType = this.sprites[1];
                    }
                    else { //the rest are normal dots
                        faceType = this.sprites[0];
                    }
                    //now draw the dot
                    this.context.drawImage(faceType, this.dotPosX[this.mot.trial][i] - this.mot.dotRad, this.dotPosY[this.mot.trial][i] - this.mot.dotRad, this.mot.imageSize, this.mot.imageSize);
                }
                this.mot.initState = false; //turn off initialization state
            }
            else { //no longer the initialization state, so just keep the dots moving
                var posXNew = [];
                var posYNew = [];
                var randomize = [];
                //assign a random number to each dot
                for (var i = 0; i < this.mot.numDots; i++) {
                    randomize[i] = Math.random();
                }
                for (var i = 0; i < this.mot.numDots; i++) {
                    //if the dot's number is greater than the straight probability, then the dot's
                    //current trajectory will change to a randomly selected angle within the maximum deviation
                    if (randomize[i] > this.mot.straightProb) {
                        var randomness = Math.random() * this.mot.angSD;
                        if (Math.random() > 0.5) {
                            randomness = -randomness;
                        }
                        this.dotMovAng[i] = this.dotMovAng[i] + randomness;
                    }
                    //predicted position change (calculated based on current position plus the calculated distance and direction based on angle and dot speed)
                    posXNew[i] = this.dotPosX[this.mot.trial][i] + Math.cos(this.dotMovAng[i]) * this.mot.vel;
                    posYNew[i] = this.dotPosY[this.mot.trial][i] - Math.sin(this.dotMovAng[i]) * this.mot.vel;
                    //if the dot is past the inner or outer boundaries, then reflect the motion of the dot
                    // (this makes it looks like it bounces off the boundary walls)
                    var r2 = Math.pow(posXNew[i] - this.cx, 2) + Math.pow(posYNew[i] - this.cy, 2);
                    if (r2 < Math.pow(this.mot.minFix, 2) || r2 > Math.pow(this.mot.maxFix - this.mot.minEdge, 2)) {
                        var temp = this.dotMovAng[i];
                        this.dotMovAng[i] =
                            2 * Math.atan2(-(this.dotPosY[this.mot.trial][i] - this.cy), this.dotPosX[this.mot.trial][i] - this.cx) -
                                this.dotMovAng[i] - Math.PI;
                    }
                }
                // check if any of the dots collide with each other; if they do, then reflect their motion
                //(similar to billiard balls hitting each other)
                for (var i = 0; i < this.mot.numDots - 1; i++) {
                    for (var j = i + 1; j < this.mot.numDots; j++) {
                        if (Math.pow(posXNew[i] - posXNew[j], 2) + Math.pow(posYNew[i] - posYNew[j], 2) < Math.pow(this.mot.minSep, 2)) {
                            var tempAngle = this.dotMovAng[i];
                            this.dotMovAng[i] = this.dotMovAng[j];
                            this.dotMovAng[j] = tempAngle;
                        }
                    }
                }
                //with these new positions, now update and draw the dots
                for (var i = 0; i < this.mot.numDots; i++) {
                    this.dotPosX[this.mot.trial][i] = this.dotPosX[this.mot.trial][i] + Math.cos(this.dotMovAng[i]) * this.mot.vel;
                    this.dotPosY[this.mot.trial][i] = this.dotPosY[this.mot.trial][i] - Math.sin(this.dotMovAng[i]) * this.mot.vel;
                    //if we're in the cue state, then make sure the dots that need to be cued dots are displayed properly
                    var faceType = void 0;
                    if (this.mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_0__["State"].CUE && i < this.mot.numAttendDots[this.mot.trial]) {
                        faceType = this.sprites[1];
                    }
                    else {
                        faceType = this.sprites[0];
                    }
                    //draw the dot
                    this.context.drawImage(faceType, this.dotPosX[this.mot.trial][i] - this.mot.dotRad, this.dotPosY[this.mot.trial][i] - this.mot.dotRad, this.mot.imageSize, this.mot.imageSize);
                }
            }
        }
        else if (this.mot.state === _enums_state__WEBPACK_IMPORTED_MODULE_0__["State"].RESPONSE) {
            this.drawFix(); //draw the fixation point
            //now update and draw the dots (no longer moving)
            for (var i = 0; i < this.mot.numDots; i++) {
                var faceType = void 0;
                //if current dot is the dot to be queried, then change it to the queried dot stimulus
                if (i === this.probedDot[this.mot.trial]) {
                    faceType = this.sprites[2];
                }
                else { //set all the other dots to the normal stimulus image
                    faceType = this.sprites[0];
                }
                //draw the dot
                this.context.drawImage(faceType, this.dotPosX[this.mot.trial][i] - this.mot.dotRad, this.dotPosY[this.mot.trial][i] - this.mot.dotRad, this.mot.imageSize, this.mot.imageSize);
            }
            $("#exptCanvas").css({ cursor: 'default' }); //reset the cursor to be visible
        }
    };
    //draw fixation point
    Ui.prototype.drawFix = function () {
        this.context.fillStyle = "white";
        this.context.fillRect(this.cx - 2, this.cy - 2, 5, 5);
        this.context.fillStyle = "black";
        this.context.fillRect(this.cx - 1, this.cy - 1, 3, 3);
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

/***/ "./src/utils/create-empty-dot-array.ts":
/*!*********************************************!*\
  !*** ./src/utils/create-empty-dot-array.ts ***!
  \*********************************************/
/*! exports provided: createEmptyDotArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEmptyDotArray", function() { return createEmptyDotArray; });
//create empty template for 2D array (2 x numTrials)
var createEmptyDotArray = function (trials, dots) {
    var emptyDotArray = [];
    for (var i = 0; i < trials; i++) {
        emptyDotArray[i] = [];
        for (var j = 0; j < dots; j++) {
            emptyDotArray[i][j] = -1;
        }
    }
    return emptyDotArray;
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

//Once the subject is done with all the trials, send all the data at once to the database
//via the MOT/save.php script; data is passed with semicolons separating each trial's data
var submitResults = function (mot, ui, pxPerDeg) {
    //get the subject's current local time
    var d = new Date();
    var localsec = Math.round(d.getTime() / 1000) - d.getTimezoneOffset() * 60;
    //send data asynchronously
    return axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('save.php', {
        trialStart: mot.trialStart.join(';'),
        numAttendDots: mot.numAttendDots.join(';'),
        probeTracked: ui.probeTracked.join(';'),
        response: mot.response.join(';'),
        correct: mot.correct.join(';'),
        rt: mot.rt.join(';'),
        targetSeed: mot.targetSeed,
        trialSeed: mot.trialSeed.join(';'),
        numDrawCalls: mot.drawCounter.join(';'),
        canvasWidth: ui.canvas.width,
        canvasHeight: ui.canvas.height,
        pxperdeg: pxPerDeg,
        localsec: localsec,
    }); //once the script is done, then go to the end of the task
};


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map