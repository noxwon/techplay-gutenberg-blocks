/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/

;// external "wp.blocks"
const external_wp_blocks_namespaceObject = wp.blocks;
;// external "wp.i18n"
const external_wp_i18n_namespaceObject = wp.i18n;
;// external "wp.blockEditor"
const external_wp_blockEditor_namespaceObject = wp.blockEditor;
;// external "wp.components"
const external_wp_components_namespaceObject = wp.components;
;// external "wp.element"
const external_wp_element_namespaceObject = wp.element;
;// ./src/blocks/download-button/index.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }







(0,external_wp_blocks_namespaceObject.registerBlockType)('techplay-blocks/download-button', {
  title: (0,external_wp_i18n_namespaceObject.__)('다운로드 버튼'),
  icon: 'download',
  category: 'common',
  attributes: {
    fileURL: {
      type: 'string',
      "default": ''
    },
    buttonText: {
      type: 'string',
      "default": '다운로드'
    },
    buttonStyle: {
      type: 'string',
      "default": 'default'
    },
    buttonIcon: {
      type: 'string',
      "default": 'download'
    },
    fileName: {
      type: 'string',
      "default": ''
    },
    alignment: {
      type: 'string',
      "default": 'left'
    },
    size: {
      type: 'string',
      "default": 'size-default'
    },
    backgroundColor: {
      type: 'string',
      "default": '#007bff'
    },
    textColor: {
      type: 'string',
      "default": '#ffffff'
    },
    hoverBackgroundColor: {
      type: 'string',
      "default": '#0056b3'
    },
    hoverTextColor: {
      type: 'string',
      "default": '#ffffff'
    }
  },
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var fileURL = attributes.fileURL,
      buttonText = attributes.buttonText,
      buttonStyle = attributes.buttonStyle,
      buttonIcon = attributes.buttonIcon,
      fileName = attributes.fileName,
      alignment = attributes.alignment,
      size = attributes.size,
      backgroundColor = attributes.backgroundColor,
      textColor = attributes.textColor,
      hoverBackgroundColor = attributes.hoverBackgroundColor,
      hoverTextColor = attributes.hoverTextColor;
    var blockProps = (0,external_wp_blockEditor_namespaceObject.useBlockProps)({
      className: "wp-block-techplay-download-button style-".concat(buttonStyle, " ").concat(size),
      style: {
        '--button-bg-color': backgroundColor || '#007bff',
        '--button-text-color': textColor || '#ffffff',
        '--button-hover-bg-color': hoverBackgroundColor || '#0056b3',
        '--button-hover-text-color': hoverTextColor || '#ffffff'
      }
    });

    // 정렬 스타일을 직접 적용
    var alignmentStyle = {
      display: 'flex',
      justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'center' ? 'center' : 'flex-end'
    };
    var onSelectFile = function onSelectFile(media) {
      if (media && media.url) {
        setAttributes({
          fileURL: media.url,
          fileName: media.title || media.filename
        });
      }
    };
    var buttonStyles = [{
      label: '기본',
      value: 'default'
    }, {
      label: '강조',
      value: 'accent'
    }, {
      label: '라운드',
      value: 'round'
    }];
    var buttonIcons = [{
      label: '다운로드',
      value: 'download'
    }, {
      label: '문서',
      value: 'document'
    }, {
      label: '파일',
      value: 'file'
    }, {
      label: 'PDF',
      value: 'pdf'
    }, {
      label: '압축파일',
      value: 'archive'
    }];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.InspectorControls, null, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.PanelBody, {
      title: (0,external_wp_i18n_namespaceObject.__)('다운로드 버튼 설정', 'techplay-gutenberg-blocks')
    }, /*#__PURE__*/React.createElement("div", {
      className: "components-base-control"
    }, /*#__PURE__*/React.createElement("label", {
      className: "components-base-control__label"
    }, (0,external_wp_i18n_namespaceObject.__)('파일 URL', 'techplay-gutenberg-blocks')), /*#__PURE__*/React.createElement("div", {
      className: "components-base-control__field"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: fileURL || '',
      onChange: function onChange(e) {
        return setAttributes({
          fileURL: e.target.value
        });
      },
      className: "components-text-control__input"
    }), /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.MediaUpload, {
      onSelect: onSelectFile,
      allowedTypes: ['application'],
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Button, {
          isSecondary: true,
          onClick: open,
          style: {
            marginTop: '8px'
          }
        }, (0,external_wp_i18n_namespaceObject.__)('파일 선택', 'techplay-gutenberg-blocks'));
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "components-base-control"
    }, /*#__PURE__*/React.createElement("label", {
      className: "components-base-control__label"
    }, (0,external_wp_i18n_namespaceObject.__)('버튼 텍스트', 'techplay-gutenberg-blocks')), /*#__PURE__*/React.createElement("div", {
      className: "components-base-control__field"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: buttonText || '',
      onChange: function onChange(e) {
        return setAttributes({
          buttonText: e.target.value
        });
      },
      className: "components-text-control__input"
    }))), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.SelectControl, {
      label: (0,external_wp_i18n_namespaceObject.__)('아이콘', 'techplay-gutenberg-blocks'),
      value: buttonIcon,
      options: buttonIcons,
      onChange: function onChange(value) {
        return setAttributes({
          buttonIcon: value
        });
      }
    }), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.SelectControl, {
      label: (0,external_wp_i18n_namespaceObject.__)('스타일', 'techplay-gutenberg-blocks'),
      value: buttonStyle,
      options: buttonStyles,
      onChange: function onChange(value) {
        return setAttributes({
          buttonStyle: value
        });
      }
    }), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.SelectControl, {
      label: (0,external_wp_i18n_namespaceObject.__)('정렬', 'techplay-gutenberg-blocks'),
      value: alignment,
      options: [{
        label: (0,external_wp_i18n_namespaceObject.__)('좌측', 'techplay-gutenberg-blocks'),
        value: 'left'
      }, {
        label: (0,external_wp_i18n_namespaceObject.__)('중앙', 'techplay-gutenberg-blocks'),
        value: 'center'
      }, {
        label: (0,external_wp_i18n_namespaceObject.__)('우측', 'techplay-gutenberg-blocks'),
        value: 'right'
      }],
      onChange: function onChange(value) {
        return setAttributes({
          alignment: value
        });
      }
    }), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.SelectControl, {
      label: (0,external_wp_i18n_namespaceObject.__)('크기', 'techplay-gutenberg-blocks'),
      value: size,
      options: [{
        label: (0,external_wp_i18n_namespaceObject.__)('매우 작음', 'techplay-gutenberg-blocks'),
        value: 'size-xs'
      }, {
        label: (0,external_wp_i18n_namespaceObject.__)('작음', 'techplay-gutenberg-blocks'),
        value: 'size-sm'
      }, {
        label: (0,external_wp_i18n_namespaceObject.__)('기본', 'techplay-gutenberg-blocks'),
        value: 'size-default'
      }, {
        label: (0,external_wp_i18n_namespaceObject.__)('크게', 'techplay-gutenberg-blocks'),
        value: 'size-lg'
      }, {
        label: (0,external_wp_i18n_namespaceObject.__)('매우 크게', 'techplay-gutenberg-blocks'),
        value: 'size-xlg'
      }],
      onChange: function onChange(value) {
        return setAttributes({
          size: value
        });
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "button-style-controls"
    }, /*#__PURE__*/React.createElement("div", {
      className: "style-control"
    }, /*#__PURE__*/React.createElement("label", null, "\uBC30\uACBD\uC0C9"), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.ColorPicker, {
      color: backgroundColor,
      onChange: function onChange(color) {
        return setAttributes({
          backgroundColor: color
        });
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "style-control"
    }, /*#__PURE__*/React.createElement("label", null, "\uD14D\uC2A4\uD2B8 \uC0C9\uC0C1"), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.ColorPicker, {
      color: textColor,
      onChange: function onChange(color) {
        return setAttributes({
          textColor: color
        });
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "style-control"
    }, /*#__PURE__*/React.createElement("label", null, "\uD638\uBC84 \uBC30\uACBD\uC0C9"), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.ColorPicker, {
      color: hoverBackgroundColor,
      onChange: function onChange(color) {
        return setAttributes({
          hoverBackgroundColor: color
        });
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "style-control"
    }, /*#__PURE__*/React.createElement("label", null, "\uD638\uBC84 \uD14D\uC2A4\uD2B8"), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.ColorPicker, {
      color: hoverTextColor,
      onChange: function onChange(color) {
        return setAttributes({
          hoverTextColor: color
        });
      }
    }))))), /*#__PURE__*/React.createElement("div", _extends({}, blockProps, {
      style: _objectSpread(_objectSpread({}, blockProps.style), alignmentStyle)
    }), /*#__PURE__*/React.createElement("button", {
      className: "download-button",
      "data-file": fileURL,
      "data-filename": fileName,
      "data-icon": buttonIcon
    }, /*#__PURE__*/React.createElement("span", {
      className: "button-icon"
    }, buttonIcon && /*#__PURE__*/React.createElement("span", {
      className: "icon-".concat(buttonIcon)
    })), /*#__PURE__*/React.createElement("span", {
      className: "button-text"
    }, buttonText || (0,external_wp_i18n_namespaceObject.__)('다운로드', 'techplay-gutenberg-blocks')))));
  },
  save: function save(_ref3) {
    var attributes = _ref3.attributes;
    var fileURL = attributes.fileURL,
      buttonText = attributes.buttonText,
      buttonStyle = attributes.buttonStyle,
      buttonIcon = attributes.buttonIcon,
      fileName = attributes.fileName,
      size = attributes.size,
      backgroundColor = attributes.backgroundColor,
      textColor = attributes.textColor,
      hoverBackgroundColor = attributes.hoverBackgroundColor,
      hoverTextColor = attributes.hoverTextColor,
      alignment = attributes.alignment;
    var blockClassName = ['wp-block-techplay-download-button', "style-".concat(buttonStyle), size].filter(Boolean).join(' ');

    // 정렬 스타일 정의
    var alignmentStyle = {
      display: 'flex',
      justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'center' ? 'center' : 'flex-end'
    };
    return /*#__PURE__*/React.createElement("div", {
      className: blockClassName,
      style: _objectSpread({
        '--button-bg-color': backgroundColor || '#007bff',
        '--button-text-color': textColor || '#ffffff',
        '--button-hover-bg-color': hoverBackgroundColor || '#0056b3',
        '--button-hover-text-color': hoverTextColor || '#ffffff'
      }, alignmentStyle)
    }, /*#__PURE__*/React.createElement("button", {
      className: "download-button",
      "data-file": fileURL,
      "data-filename": fileName,
      "data-icon": buttonIcon
    }, /*#__PURE__*/React.createElement("span", {
      className: "button-icon"
    }, buttonIcon && /*#__PURE__*/React.createElement("span", {
      className: "icon-".concat(buttonIcon)
    })), /*#__PURE__*/React.createElement("span", {
      className: "button-text"
    }, buttonText || (0,external_wp_i18n_namespaceObject.__)('다운로드', 'techplay-gutenberg-blocks'))));
  }
});
;// ./src/blocks/image-compare/index.js




(0,external_wp_blocks_namespaceObject.registerBlockType)('techplay-blocks/image-compare', {
  title: (0,external_wp_i18n_namespaceObject.__)('이미지 비교'),
  icon: 'images-alt2',
  category: 'common',
  keywords: ['이미지', '비교', 'compare'],
  attributes: {
    image1: {
      type: 'object',
      "default": null
    },
    image2: {
      type: 'object',
      "default": null
    }
  },
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var image1 = attributes.image1,
      image2 = attributes.image2;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.InspectorControls, null, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.PanelBody, {
      title: (0,external_wp_i18n_namespaceObject.__)('이미지 설정')
    }, /*#__PURE__*/React.createElement("div", {
      className: "image-compare-upload"
    }, /*#__PURE__*/React.createElement("p", null, "\uCCAB \uBC88\uC9F8 \uC774\uBBF8\uC9C0"), /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.MediaUpload, {
      onSelect: function onSelect(media) {
        setAttributes({
          image1: media
        });
      },
      allowedTypes: ['image'],
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Button, {
          onClick: open,
          isPrimary: true
        }, image1 ? '이미지 변경' : '이미지 선택');
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "image-compare-upload"
    }, /*#__PURE__*/React.createElement("p", null, "\uB450 \uBC88\uC9F8 \uC774\uBBF8\uC9C0"), /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.MediaUpload, {
      onSelect: function onSelect(media) {
        setAttributes({
          image2: media
        });
      },
      allowedTypes: ['image'],
      render: function render(_ref3) {
        var open = _ref3.open;
        return /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Button, {
          onClick: open,
          isPrimary: true
        }, image2 ? '이미지 변경' : '이미지 선택');
      }
    })))), /*#__PURE__*/React.createElement("div", {
      className: "wp-block-techplay-image-compare"
    }, image1 && image2 ? /*#__PURE__*/React.createElement("div", {
      className: "image-compare-container"
    }, /*#__PURE__*/React.createElement("img", {
      src: image1.url,
      alt: image1.alt || ''
    }), /*#__PURE__*/React.createElement("div", {
      className: "image-compare-separator"
    }), /*#__PURE__*/React.createElement("img", {
      src: image2.url,
      alt: image2.alt || ''
    })) : /*#__PURE__*/React.createElement("p", null, "\uC774\uBBF8\uC9C0\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.")));
  },
  save: function save(_ref4) {
    var attributes = _ref4.attributes;
    var image1 = attributes.image1,
      image2 = attributes.image2;
    if (!image1 || !image2) {
      return null;
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "wp-block-techplay-image-compare"
    }, /*#__PURE__*/React.createElement("div", {
      className: "image-compare-container"
    }, /*#__PURE__*/React.createElement("img", {
      src: image1.url,
      alt: image1.alt || ''
    }), /*#__PURE__*/React.createElement("div", {
      className: "image-compare-separator"
    }), /*#__PURE__*/React.createElement("img", {
      src: image2.url,
      alt: image2.alt || ''
    })));
  }
});
;// external "wp.apiFetch"
const external_wp_apiFetch_namespaceObject = wp.apiFetch;
var external_wp_apiFetch_default = /*#__PURE__*/__webpack_require__.n(external_wp_apiFetch_namespaceObject);
;// ./src/blocks/reference-links/index.js
function reference_links_typeof(o) { "@babel/helpers - typeof"; return reference_links_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, reference_links_typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == reference_links_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(reference_links_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function reference_links_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function reference_links_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? reference_links_ownKeys(Object(t), !0).forEach(function (r) { reference_links_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : reference_links_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function reference_links_defineProperty(e, r, t) { return (r = reference_links_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function reference_links_toPropertyKey(t) { var i = reference_links_toPrimitive(t, "string"); return "symbol" == reference_links_typeof(i) ? i : i + ""; }
function reference_links_toPrimitive(t, r) { if ("object" != reference_links_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != reference_links_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }







(0,external_wp_blocks_namespaceObject.registerBlockType)('techplay-blocks/reference-links', {
  title: (0,external_wp_i18n_namespaceObject.__)('레퍼런스 링크'),
  icon: 'admin-links',
  category: 'common',
  keywords: ['레퍼런스', '링크', 'reference'],
  attributes: {
    links: {
      type: 'array',
      "default": []
    },
    showIcon: {
      type: 'boolean',
      "default": true
    },
    fontSize: {
      type: 'string',
      "default": 'inherit'
    },
    fontSizeUnit: {
      type: 'string',
      "default": 'px'
    }
  },
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var links = attributes.links,
      showIcon = attributes.showIcon,
      fontSize = attributes.fontSize,
      fontSizeUnit = attributes.fontSizeUnit;
    var _useState = (0,external_wp_element_namespaceObject.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isLoading = _useState2[0],
      setIsLoading = _useState2[1];
    var blockProps = (0,external_wp_blockEditor_namespaceObject.useBlockProps)({
      style: {
        '--reference-link-font-size': fontSize === 'inherit' ? 'inherit' : "".concat(fontSize).concat(fontSizeUnit),
        '--reference-link-icon-size': fontSize === 'inherit' ? '1em' : "".concat(fontSize).concat(fontSizeUnit)
      }
    });
    var addLink = function addLink() {
      setAttributes({
        links: [].concat(_toConsumableArray(links), [{
          url: '',
          title: '',
          favicon: ''
        }])
      });
    };
    var updateLink = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(index, field, value) {
        var newLinks, response;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              newLinks = _toConsumableArray(links);
              newLinks[index] = reference_links_objectSpread(reference_links_objectSpread({}, newLinks[index]), {}, reference_links_defineProperty({}, field, value));

              // URL이 변경되었고, 유효한 URL인 경우 타이틀과 파비콘을 가져옵니다
              if (!(field === 'url' && value && isValidUrl(value))) {
                _context.next = 17;
                break;
              }
              setIsLoading(true);
              _context.prev = 4;
              _context.next = 7;
              return external_wp_apiFetch_default()({
                path: '/techplay-blocks/v1/fetch-site-info',
                method: 'POST',
                data: {
                  url: value
                }
              })["catch"](function (error) {
                console.error('API 호출 실패:', error);
                throw error;
              });
            case 7:
              response = _context.sent;
              if (response && response.success) {
                newLinks[index] = reference_links_objectSpread(reference_links_objectSpread({}, newLinks[index]), {}, {
                  title: response.title || value,
                  favicon: response.favicon || ''
                });
              } else {
                console.error('API 응답 실패:', response);
              }
              _context.next = 14;
              break;
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](4);
              console.error('사이트 정보 가져오기 실패:', _context.t0);
            case 14:
              _context.prev = 14;
              setIsLoading(false);
              return _context.finish(14);
            case 17:
              setAttributes({
                links: newLinks
              });
            case 18:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[4, 11, 14, 17]]);
      }));
      return function updateLink(_x, _x2, _x3) {
        return _ref2.apply(this, arguments);
      };
    }();
    var removeLink = function removeLink(index) {
      var newLinks = links.filter(function (_, i) {
        return i !== index;
      });
      setAttributes({
        links: newLinks
      });
    };
    var isValidUrl = function isValidUrl(string) {
      try {
        var url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch (_) {
        return false;
      }
    };
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.InspectorControls, null, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.PanelBody, {
      title: "\uC124\uC815"
    }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.ToggleControl, {
      label: "\uC544\uC774\uCF58 \uD45C\uC2DC",
      checked: showIcon,
      onChange: function onChange(value) {
        return setAttributes({
          showIcon: value
        });
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "components-base-control"
    }, /*#__PURE__*/React.createElement("label", {
      className: "components-base-control__label"
    }, "\uD3F0\uD2B8 \uD06C\uAE30"), /*#__PURE__*/React.createElement("div", {
      className: "components-flex components-flex--nowrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "components-flex__item"
    }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.TextControl, {
      type: "number",
      value: fontSize,
      onChange: function onChange(value) {
        return setAttributes({
          fontSize: value
        });
      },
      min: "0",
      step: "0.1"
    })), /*#__PURE__*/React.createElement("div", {
      className: "components-flex__item"
    }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.SelectControl, {
      value: fontSizeUnit,
      options: [{
        label: 'px',
        value: 'px'
      }, {
        label: 'em',
        value: 'em'
      }, {
        label: 'rem',
        value: 'rem'
      }, {
        label: 'pt',
        value: 'pt'
      }],
      onChange: function onChange(value) {
        return setAttributes({
          fontSizeUnit: value
        });
      }
    })))))), /*#__PURE__*/React.createElement("div", {
      className: "reference-links-editor"
    }, links.map(function (link, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        className: "reference-link-item"
      }, /*#__PURE__*/React.createElement("div", {
        className: "components-flex components-flex--nowrap"
      }, /*#__PURE__*/React.createElement("div", {
        className: "components-flex__item"
      }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.TextControl, {
        placeholder: "URL",
        value: link.url,
        onChange: function onChange(value) {
          return updateLink(index, 'url', value);
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "components-flex__item"
      }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.TextControl, {
        placeholder: "\uC81C\uBAA9",
        value: link.title,
        onChange: function onChange(value) {
          return updateLink(index, 'title', value);
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "components-flex__item"
      }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Button, {
        isDestructive: true,
        onClick: function onClick() {
          return removeLink(index);
        }
      }, "\uC0AD\uC81C"))));
    }), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Button, {
      variant: "secondary",
      onClick: addLink,
      disabled: isLoading
    }, isLoading ? '로딩 중...' : '링크 추가')));
  },
  save: function save(_ref3) {
    var attributes = _ref3.attributes;
    var links = attributes.links,
      showIcon = attributes.showIcon,
      fontSize = attributes.fontSize,
      fontSizeUnit = attributes.fontSizeUnit;
    var blockProps = external_wp_blockEditor_namespaceObject.useBlockProps.save({
      style: {
        '--reference-link-font-size': fontSize === 'inherit' ? 'inherit' : "".concat(fontSize).concat(fontSizeUnit),
        '--reference-link-icon-size': fontSize === 'inherit' ? '1em' : "".concat(fontSize).concat(fontSizeUnit)
      }
    });
    return /*#__PURE__*/React.createElement("div", blockProps, links.map(function (link, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        className: "reference-link-item"
      }, /*#__PURE__*/React.createElement("a", {
        href: link.url,
        target: "_blank",
        rel: "noopener noreferrer"
      }, showIcon && /*#__PURE__*/React.createElement("span", {
        className: "reference-link-favicon default-icon",
        "data-icon": "external"
      }), /*#__PURE__*/React.createElement("span", {
        className: "reference-link-title"
      }, link.title || link.url)));
    }));
  }
});
;// ./src/blocks/ai-image-gallery/ai-image-gallery.js
function ai_image_gallery_extends() { return ai_image_gallery_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, ai_image_gallery_extends.apply(null, arguments); }
function ai_image_gallery_toConsumableArray(r) { return ai_image_gallery_arrayWithoutHoles(r) || ai_image_gallery_iterableToArray(r) || ai_image_gallery_unsupportedIterableToArray(r) || ai_image_gallery_nonIterableSpread(); }
function ai_image_gallery_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function ai_image_gallery_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return ai_image_gallery_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? ai_image_gallery_arrayLikeToArray(r, a) : void 0; } }
function ai_image_gallery_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function ai_image_gallery_arrayWithoutHoles(r) { if (Array.isArray(r)) return ai_image_gallery_arrayLikeToArray(r); }
function ai_image_gallery_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }





(0,external_wp_blocks_namespaceObject.registerBlockType)('techplay-gutenberg-blocks/ai-image-gallery', {
  title: 'AI 이미지 갤러리',
  icon: 'format-gallery',
  category: 'media',
  supports: {
    align: ['wide', 'full']
  },
  attributes: {
    columns: {
      type: 'number',
      "default": 3
    },
    gap: {
      type: 'number',
      "default": 16
    },
    images: {
      type: 'array',
      "default": []
    },
    lightboxEnabled: {
      type: 'boolean',
      "default": true
    },
    masonryEnabled: {
      type: 'boolean',
      "default": true
    },
    imageFit: {
      type: 'string',
      "default": 'cover'
    },
    imageHeight: {
      type: 'number',
      "default": 300
    },
    showImageInfo: {
      type: 'boolean',
      "default": true
    }
  },
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var columns = attributes.columns,
      gap = attributes.gap,
      images = attributes.images,
      lightboxEnabled = attributes.lightboxEnabled,
      masonryEnabled = attributes.masonryEnabled,
      imageFit = attributes.imageFit,
      imageHeight = attributes.imageHeight,
      showImageInfo = attributes.showImageInfo;
    var galleryRef = (0,external_wp_element_namespaceObject.useRef)(null);
    var blockProps = (0,external_wp_blockEditor_namespaceObject.useBlockProps)({
      className: "wp-block-techplay-gutenberg-blocks-ai-image-gallery".concat(masonryEnabled ? ' has-masonry' : '', " columns-").concat(columns, " gap-").concat(gap, " image-height-").concat(imageHeight, " image-fit-").concat(imageFit)
    });
    (0,external_wp_element_namespaceObject.useEffect)(function () {
      if (galleryRef.current && images.length > 0) {
        var imgs = galleryRef.current.querySelectorAll('img');
        imgs.forEach(function (img) {
          if (!img.complete) {
            img.addEventListener('load', function () {
              // 이미지가 로드되면 레이아웃 업데이트
              if (masonryEnabled) {
                img.style.height = 'auto';
              }
            });
          } else if (masonryEnabled) {
            img.style.height = 'auto';
          }
        });
      }
    }, [images, masonryEnabled]);
    var onSelectImages = function onSelectImages(selectedImages) {
      var newImages = selectedImages.map(function (image) {
        return {
          url: image.url,
          prompt: image.alt || '',
          parameters: image.description || '',
          id: image.id,
          width: image.width,
          height: image.height
        };
      });
      setAttributes({
        images: newImages
      });
    };
    var removeImage = function removeImage(index) {
      var newImages = ai_image_gallery_toConsumableArray(images);
      newImages.splice(index, 1);
      setAttributes({
        images: newImages
      });
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.InspectorControls, null, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.PanelBody, {
      title: "\uB808\uC774\uC544\uC6C3 \uC124\uC815"
    }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.RangeControl, {
      label: "\uC5F4 \uC218",
      value: columns,
      onChange: function onChange(value) {
        return setAttributes({
          columns: value
        });
      },
      min: 1,
      max: 8
    }), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.RangeControl, {
      label: "\uAC04\uACA9",
      value: gap,
      onChange: function onChange(value) {
        return setAttributes({
          gap: value
        });
      },
      min: 0,
      max: 50
    }), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.ToggleControl, {
      label: "Masonry \uB808\uC774\uC544\uC6C3",
      help: masonryEnabled ? '이미지 높이를 자동으로 조정합니다.' : '모든 이미지를 동일한 높이로 표시합니다.',
      checked: masonryEnabled,
      onChange: function onChange(value) {
        return setAttributes({
          masonryEnabled: value
        });
      }
    }), !masonryEnabled && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.RangeControl, {
      label: "\uC774\uBBF8\uC9C0 \uB192\uC774",
      value: imageHeight,
      onChange: function onChange(value) {
        return setAttributes({
          imageHeight: value
        });
      },
      min: 100,
      max: 1000,
      step: 10
    }), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.SelectControl, {
      label: "\uC774\uBBF8\uC9C0 \uB9DE\uCDA4",
      value: imageFit,
      options: [{
        label: '꽉 채우기',
        value: 'cover'
      }, {
        label: '원본 비율',
        value: 'contain'
      }],
      onChange: function onChange(value) {
        return setAttributes({
          imageFit: value
        });
      }
    })), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.ToggleControl, {
      label: "\uC774\uBBF8\uC9C0 \uC815\uBCF4 \uC544\uC774\uCF58 \uD45C\uC2DC",
      checked: showImageInfo,
      onChange: function onChange(value) {
        return setAttributes({
          showImageInfo: value
        });
      }
    })), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.PanelBody, {
      title: "\uB77C\uC774\uD2B8\uBC15\uC2A4"
    }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.ToggleControl, {
      label: "\uB77C\uC774\uD2B8\uBC15\uC2A4 \uD65C\uC131\uD654",
      checked: lightboxEnabled,
      onChange: function onChange(value) {
        return setAttributes({
          lightboxEnabled: value
        });
      }
    }))), /*#__PURE__*/React.createElement("div", ai_image_gallery_extends({}, blockProps, {
      ref: galleryRef
    }), images.map(function (image, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        className: "gallery-item",
        "data-id": image.id
      }, /*#__PURE__*/React.createElement("figure", null, /*#__PURE__*/React.createElement("img", {
        src: image.url,
        alt: image.prompt || '',
        "data-prompt": image.prompt || '',
        "data-parameters": image.parameters || ''
      }), /*#__PURE__*/React.createElement("div", {
        className: "image-info-icon"
      }, /*#__PURE__*/React.createElement("span", {
        className: "dashicons dashicons-info"
      })), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Button, {
        isDestructive: true,
        onClick: function onClick() {
          return removeImage(index);
        },
        className: "remove-image-button"
      }, "\uC0AD\uC81C")));
    })), /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.MediaUploadCheck, null, /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.MediaUpload, {
      onSelect: onSelectImages,
      allowedTypes: ['image'],
      multiple: true,
      gallery: true,
      value: images.map(function (img) {
        return img.id;
      }),
      render: function render(_ref) {
        var open = _ref.open;
        return /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Button, {
          isPrimary: true,
          onClick: open,
          style: {
            marginTop: '20px'
          }
        }, "\uC774\uBBF8\uC9C0 \uCD94\uAC00");
      }
    })));
  },
  save: function save(props) {
    // Dynamic block, rendering is handled by PHP.
    return null;
  }
});
;// ./src/blocks/ai-image-gallery/index.js
function ai_image_gallery_typeof(o) { "@babel/helpers - typeof"; return ai_image_gallery_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, ai_image_gallery_typeof(o); }
function ai_image_gallery_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function ai_image_gallery_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ai_image_gallery_ownKeys(Object(t), !0).forEach(function (r) { ai_image_gallery_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ai_image_gallery_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function ai_image_gallery_defineProperty(e, r, t) { return (r = ai_image_gallery_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function ai_image_gallery_toPropertyKey(t) { var i = ai_image_gallery_toPrimitive(t, "string"); return "symbol" == ai_image_gallery_typeof(i) ? i : i + ""; }
function ai_image_gallery_toPrimitive(t, r) { if ("object" != ai_image_gallery_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != ai_image_gallery_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * WordPress dependencies
 */









// SD 파라미터 파싱 함수
function parseSDParameters(description) {
  var params = {};
  var regex = /(\w+):\s*([^,\n]+)/g;
  var match;
  while ((match = regex.exec(description)) !== null) {
    params[match[1]] = match[2].trim();
  }
  return params;
}
(0,external_wp_blocks_namespaceObject.registerBlockType)('techplay-gutenberg-blocks/ai-image-gallery', {
  title: (0,external_wp_i18n_namespaceObject.__)('AI 이미지 갤러리', 'techplay-gutenberg-blocks'),
  icon: 'format-gallery',
  category: 'common',
  attributes: {
    images: {
      type: 'array',
      "default": []
    },
    columns: {
      type: 'number',
      "default": 3
    },
    gap: {
      type: 'number',
      "default": 16
    },
    imageHeight: {
      type: 'number',
      "default": 300
    },
    useMasonry: {
      type: 'boolean',
      "default": false
    },
    showImageInfo: {
      type: 'boolean',
      "default": true
    }
  },
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var columns = attributes.columns,
      gap = attributes.gap,
      images = attributes.images,
      useMasonry = attributes.useMasonry,
      showImageInfo = attributes.showImageInfo,
      imageHeight = attributes.imageHeight;
    var blockProps = (0,external_wp_blockEditor_namespaceObject.useBlockProps)({
      className: "wp-block-techplay-gutenberg-blocks-ai-image-gallery columns-".concat(columns, " gap-").concat(gap, " height-").concat(imageHeight, " ").concat(useMasonry ? 'has-masonry' : '')
    });
    var onSelectImages = function onSelectImages(newImages) {
      var updatedImages = newImages.map(function (image) {
        var params = {};
        if (image.description) {
          try {
            params = parseSDParameters(image.description);
          } catch (e) {
            console.error('Error parsing SD parameters:', e);
          }
        }
        return ai_image_gallery_objectSpread({
          url: image.url,
          alt: image.alt,
          id: image.id
        }, params);
      });
      setAttributes({
        images: updatedImages
      });
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.InspectorControls, null, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.PanelBody, {
      title: (0,external_wp_i18n_namespaceObject.__)('갤러리 설정', 'techplay-gutenberg-blocks')
    }, /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.MediaUploadCheck, null, /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.MediaUpload, {
      onSelect: onSelectImages,
      allowedTypes: ['image'],
      multiple: true,
      gallery: true,
      value: images.map(function (img) {
        return img.id;
      }),
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Button, {
          onClick: open,
          isPrimary: true
        }, images.length > 0 ? '이미지 편집' : '이미지 추가');
      }
    })), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.RangeControl, {
      label: (0,external_wp_i18n_namespaceObject.__)('열 수', 'techplay-gutenberg-blocks'),
      value: Number(columns),
      onChange: function onChange(value) {
        return setAttributes({
          columns: Number(value)
        });
      },
      min: 1,
      max: 6
    }), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.RangeControl, {
      label: (0,external_wp_i18n_namespaceObject.__)('간격', 'techplay-gutenberg-blocks'),
      value: gap,
      onChange: function onChange(value) {
        return setAttributes({
          gap: value
        });
      },
      min: 8,
      max: 48
    }), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.RangeControl, {
      label: (0,external_wp_i18n_namespaceObject.__)('이미지 높이', 'techplay-gutenberg-blocks'),
      value: imageHeight,
      onChange: function onChange(value) {
        return setAttributes({
          imageHeight: value
        });
      },
      min: 100,
      max: 600
    }), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.ToggleControl, {
      label: (0,external_wp_i18n_namespaceObject.__)('메이슨리 레이아웃', 'techplay-gutenberg-blocks'),
      checked: useMasonry,
      onChange: function onChange(value) {
        return setAttributes({
          useMasonry: value
        });
      }
    }), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.ToggleControl, {
      label: (0,external_wp_i18n_namespaceObject.__)('이미지 정보 표시', 'techplay-gutenberg-blocks'),
      checked: showImageInfo,
      onChange: function onChange(value) {
        return setAttributes({
          showImageInfo: value
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, images.map(function (image, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        className: "gallery-item",
        "data-id": image.id
      }, /*#__PURE__*/React.createElement("figure", null, /*#__PURE__*/React.createElement("img", {
        src: image.url,
        alt: image.alt || '',
        "data-prompt": image.prompt || '',
        "data-parameters": image.parameters || ''
      }), showImageInfo && /*#__PURE__*/React.createElement("div", {
        className: "image-info-icon"
      }, /*#__PURE__*/React.createElement("span", {
        className: "dashicons dashicons-info"
      }))));
    })));
  },
  // save 함수를 제거하고 render.php를 사용하도록 변경
  render: function render(_ref3) {
    var attributes = _ref3.attributes;
    // render.php가 자동으로 호출됨
    return null;
  }
});
;// ./src/index.js




/******/ })()
;
//# sourceMappingURL=index.js.map