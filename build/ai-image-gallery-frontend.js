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

;// external "jQuery"
const external_jQuery_namespaceObject = jQuery;
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_namespaceObject);
;// ./src/blocks/ai-image-gallery/ai-image-gallery-frontend.js


// Initialize Masonry and Lightbox
external_jQuery_default()(document).ready(function () {
  var galleries = external_jQuery_default()('.wp-block-techplay-gutenberg-blocks-ai-image-gallery');
  galleries.each(function () {
    var $gallery = external_jQuery_default()(this);
    var isMasonry = $gallery.hasClass('has-masonry');
    var hasLightbox = $gallery.hasClass('has-lightbox');

    // Initialize Masonry if enabled
    if (isMasonry && typeof Masonry !== 'undefined') {
      var masonryInstance = new Masonry(this, {
        itemSelector: '.gallery-item',
        columnWidth: '.gallery-item',
        percentPosition: true,
        gutter: parseInt($gallery.css('gap')) || 16
      });

      // Ensure images are loaded before layout
      imagesLoaded(this).on('progress', function () {
        masonryInstance.layout();
      });
    }

    // Initialize Lightbox if enabled
    if (hasLightbox) {
      initLightbox($gallery);
    }
  });

  // Create a single lightbox modal element for the entire page if it doesn't exist
  if (external_jQuery_default()('#ai-gallery-lightbox-modal').length === 0) {
    external_jQuery_default()('body').append("\n            <div id=\"ai-gallery-lightbox-modal\" class=\"ai-gallery-lightbox-modal\" style=\"display: none;\">\n                <div class=\"modal-content\">\n                    <figure>\n                        <span class=\"close-button\">&times;</span>\n                        <img src=\"\" alt=\"\">\n                    </figure>\n                </div>\n            </div>\n        ");

    // Close modal functionality
    var $modal = external_jQuery_default()('#ai-gallery-lightbox-modal');
    $modal.on('click', function (e) {
      // Close if clicking on background or close button
      if (external_jQuery_default()(e.target).is($modal) || external_jQuery_default()(e.target).is('.close-button')) {
        $modal.fadeOut();
      }
    });
  }

  // Create a single info modal element if it doesn't exist
  if (external_jQuery_default()('#ai-gallery-info-modal').length === 0) {
    external_jQuery_default()('body').append("\n            <div id=\"ai-gallery-info-modal\" class=\"ai-image-modal\" style=\"display: none;\">\n                <div class=\"modal-content\">\n                    <span class=\"close-button\">&times;</span>\n                    <div class=\"image-meta\">\n                        <!-- Content will be populated by JS -->\n                    </div>\n                </div>\n            </div>\n        ");
    // Close info modal functionality
    var $infoModal = external_jQuery_default()('#ai-gallery-info-modal');
    $infoModal.on('click', function (e) {
      if (external_jQuery_default()(e.target).is($infoModal) || external_jQuery_default()(e.target).is('.close-button')) {
        $infoModal.fadeOut();
      }
    });
  }
});
function initLightbox($gallery) {
  // Image click handler for lightbox
  $gallery.on('click', '.gallery-item > figure > img', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $img = external_jQuery_default()(this);
    var imageUrl = $img.attr('src');
    var altText = $img.attr('alt') || 'Gallery image';
    var $modal = external_jQuery_default()('#ai-gallery-lightbox-modal');
    var $modalImg = $modal.find('img');

    // Reset image source and hide modal initially
    $modalImg.attr('src', '').attr('alt', '');
    $modal.hide(); // Hide completely initially

    // Preload image
    var tempImg = new Image();
    tempImg.onload = function () {
      // Set modal image source and alt *after* loaded
      $modalImg.attr('src', imageUrl).attr('alt', altText);
      // Show the lightbox modal *after* image is loaded
      $modal.fadeIn();
    };
    tempImg.onerror = function () {
      // Handle image loading error (optional)
      console.error("Error loading image for lightbox:", imageUrl);
      // Optionally show an error message or close the modal
      $modal.hide(); // Or $modal.fadeOut();
    };
    tempImg.src = imageUrl; // Start loading
  });

  // Info icon click handler
  $gallery.on('click', '.image-info-icon', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $icon = external_jQuery_default()(this);
    var $img = $icon.closest('.gallery-item').find('img');
    // Try reading the attribute directly
    var parameters = $img.attr('data-parameters') || '';
    console.log("Info icon clicked.");
    console.log("Image Element:", $img[0]); // Log the image element itself
    console.log("Attempting to read data-parameters attribute:", parameters); // Log raw attribute value

    if (parameters && parameters.trim() !== '') {
      displayInfoModal(parameters);
    } else {
      console.log("No parameters found or attribute is empty.");
      // Optionally display a message in the modal if parameters are empty
      displayInfoModal(''); // Call with empty string to show default message
    }
  });
}

// Function to parse SD parameters (revised v2)
function parseSDParameters(paramsString) {
  console.log("Parsing parameters string (raw):", paramsString);
  var result = {
    positive: '',
    negative: '',
    params: {}
  };
  if (!paramsString || typeof paramsString !== 'string') return result;
  var lines = paramsString.split('\n');
  var positiveLines = [];
  var paramLinesStartIndex = -1;
  var negativePromptLineIndex = -1;

  // First pass: Identify parameter start and negative prompt line
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (paramLinesStartIndex === -1 && line.match(/^\s*\w+\s*:.+/)) {
      paramLinesStartIndex = i;
    }
    if (line.startsWith('Negative prompt:')) {
      negativePromptLineIndex = i;
    }
  }

  // Determine positive prompt lines
  var positiveEndIndex = lines.length; // Default to end if no params/negative found
  if (negativePromptLineIndex !== -1) {
    positiveEndIndex = negativePromptLineIndex;
  } else if (paramLinesStartIndex !== -1) {
    positiveEndIndex = paramLinesStartIndex;
  }
  positiveLines = lines.slice(0, positiveEndIndex);
  result.positive = positiveLines.join('\n').trim();

  // Extract negative prompt if found
  if (negativePromptLineIndex !== -1) {
    result.negative = lines[negativePromptLineIndex].substring('Negative prompt:'.length).trim();
    // Adjust param start if negative prompt came before params
    if (paramLinesStartIndex === -1 || paramLinesStartIndex < negativePromptLineIndex) {
      paramLinesStartIndex = negativePromptLineIndex + 1;
    }
  } else {
    result.negative = '';
  }

  // Process key-value parameters if found
  if (paramLinesStartIndex !== -1 && paramLinesStartIndex < lines.length) {
    var paramString = lines.slice(paramLinesStartIndex).join(' ').trim(); // Join remaining lines
    console.log("Parameter string part for parsing:", paramString);

    // Split by comma, looking ahead for "Key:" pattern more carefully
    // This regex is still imperfect for complex values with commas, but better
    var paramParts = paramString.split(/,(?=\s*(?:\w+\s*):\s*)/);
    console.log("Split param parts:", paramParts);
    paramParts.forEach(function (part) {
      var parts = part.trim().split(':');
      if (parts.length >= 2) {
        var key = parts[0].trim();
        var value = parts.slice(1).join(':').trim(); // Join back potential colons

        // Remove trailing comma if present (from split edge case)
        if (value.endsWith(',')) {
          value = value.substring(0, value.length - 1).trim();
        }
        if (key) {
          result.params[key] = value;
        }
      }
    });
  }
  console.log("Parsed data (final v2):", result);
  return result;
}

// Function to display info modal
function displayInfoModal(parameters) {
  var $modal = external_jQuery_default()('#ai-gallery-info-modal');
  var $metaContainer = $modal.find('.image-meta');
  var html = '<h3>Image Generation Details</h3>';
  console.log("[displayInfoModal] Function called. Modal element found:", $modal.length > 0);

  // Handle empty parameters case
  if (!parameters || parameters.trim() === '') {
    html += '<p>No detailed parameter information available for this image.</p>';
    console.log("[displayInfoModal] Displaying 'no info' message.");
    $metaContainer.html(html);
    console.log("[displayInfoModal] HTML set for 'no info'. Attempting direct display change...");
    $modal.css('display', 'flex'); // Use the display property used for centering
    console.log("[displayInfoModal] display style set to 'flex'.");
    return; // Exit early
  }

  // Proceed with parsing if parameters exist
  console.log("[displayInfoModal] Parameters found, proceeding with parsing...");
  var parsedData = parseSDParameters(parameters);
  console.log("[displayInfoModal] Parsing complete. Parsed data:", parsedData);

  // Positive Prompt
  if (parsedData.positive) {
    html += "\n            <div class=\"meta-section\">\n                <h4>Positive Prompt</h4>\n                <div class=\"prompt-box positive\">\n                    <p>".concat(parsedData.positive.replace(/</g, "&lt;").replace(/>/g, "&gt;"), "</p>\n                </div>\n            </div>\n        ");
  }

  // Negative Prompt
  if (parsedData.negative) {
    html += "\n            <div class=\"meta-section\">\n                <h4>Negative Prompt</h4>\n                <div class=\"prompt-box negative\">\n                     <p>".concat(parsedData.negative.replace(/</g, "&lt;").replace(/>/g, "&gt;"), "</p>\n                </div>\n            </div>\n        ");
  }

  // Other Parameters
  var otherParamsKeys = Object.keys(parsedData.params);
  if (otherParamsKeys.length > 0) {
    html += '<div class="meta-section"><h4>Parameters</h4>';
    otherParamsKeys.forEach(function (key) {
      var value = parsedData.params[key];
      html += "<p><strong>".concat(key.replace(/</g, "&lt;").replace(/>/g, "&gt;"), ":</strong> ").concat(value.replace(/</g, "&lt;").replace(/>/g, "&gt;"), "</p>");
    });
    html += '</div>';
  }
  if (!parsedData.positive && !parsedData.negative && otherParamsKeys.length === 0) {
    // This condition might be redundant now due to the early exit for empty parameters
    html += '<p>No detailed parameter information available.</p>';
  }
  console.log("[displayInfoModal] HTML generation complete.");
  $metaContainer.html(html);
  console.log("[displayInfoModal] HTML set for parameters. Attempting direct display change with !important...");
  // $modal.css('display', 'flex'); // Replace with direct style manipulation
  $modal.attr('style', 'display: flex !important;'); // Force display with !important
  console.log("[displayInfoModal] display style forcibly set to 'flex !important'.");
}
/******/ })()
;
//# sourceMappingURL=ai-image-gallery-frontend.js.map