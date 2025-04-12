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


// Initialize Masonry, Lightbox, and Hover Actions
external_jQuery_default()(document).ready(function () {
  var galleries = external_jQuery_default()('.wp-block-techplay-gutenberg-blocks-ai-image-gallery');
  galleries.each(function () {
    var $gallery = external_jQuery_default()(this);
    var isMasonry = $gallery.hasClass('has-masonry');
    var hasLightbox = $gallery.hasClass('has-lightbox');

    // Add hover actions container and buttons to each item
    $gallery.find('.gallery-item').each(function () {
      var $item = external_jQuery_default()(this);
      var $img = $item.find('img');
      var imageUrl = $img.attr('src');
      // Basic check for valid URL
      if (imageUrl) {
        // Ensure SVG icons are used here, replacing any dashicons
        var hoverActionsHtml = "\n                    <div class=\"image-hover-actions\">\n                        <button class=\"copy-url-button\" title=\"Copy Image URL\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" width=\"16\" height=\"16\">\n                              <path d=\"M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.871a.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.665l3-3Z\" />\n                              <path d=\"M8.603 17.47a4 4 0 0 1-5.656-5.656l3-3a4 4 0 0 1 5.871.225a.75.75 0 0 1-1.138.977a2.5 2.5 0 0 0-3.665-.142l-3 3a2.5 2.5 0 0 0 3.536 3.536l1.225-1.224a.75.75 0 0 1 1.061 1.06l-1.224 1.224Z\" />\n                            </svg>\n                        </button>\n                        <button class=\"download-image-button\" title=\"Download Image\">\n                           <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" width=\"16\" height=\"16\">\n                              <path fill-rule=\"evenodd\" d=\"M10 3.75a.75.75 0 0 1 .75.75v6.19l1.97-1.97a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l1.97 1.97V4.5a.75.75 0 0 1 .75-.75Zm-4.25 9.75a.75.75 0 0 1 0 1.5h8.5a.75.75 0 0 1 0-1.5h-8.5Z\" clip-rule=\"evenodd\" />\n                            </svg>\n                        </button>\n                    </div>\n                ";
        $item.append(hoverActionsHtml);
      }
    });

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

    // Initialize Hover Actions (Event Delegation)
    initHoverActions($gallery);
  });

  // Create a single lightbox modal element for the entire page if it doesn't exist
  if (external_jQuery_default()('#ai-gallery-lightbox-modal').length === 0) {
    external_jQuery_default()('body').append("\n            <div id=\"ai-gallery-lightbox-modal\" class=\"ai-gallery-lightbox-modal\">\n                <div class=\"modal-content\">\n                    <figure>\n                        <button class=\"close-button\" aria-label=\"Close lightbox\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"20\" height=\"20\">\n                                <path fill-rule=\"evenodd\" d=\"M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z\" clip-rule=\"evenodd\" />\n                            </svg>\n                        </button>\n                        <img src=\"\" alt=\"\">\n                    </figure>\n                </div>\n            </div>\n        ");

    // Close modal functionality (using .visible class)
    var $modal = external_jQuery_default()('#ai-gallery-lightbox-modal');
    $modal.on('click', function (e) {
      if (external_jQuery_default()(e.target).is($modal) || external_jQuery_default()(e.target).closest('.close-button').length) {
        $modal.removeClass('visible');
        setTimeout(function () {
          external_jQuery_default()('body').css('overflow', '');
        }, 250);
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
  console.log("[Lightbox] Initializing for gallery:", $gallery[0]); // Log gallery init

  // Image click handler for lightbox (Revert to using .visible class)
  $gallery.on('click', 'figure', function (e) {
    e.preventDefault();
    console.log("[Lightbox] Figure clicked!"); // Log click event

    var $img = external_jQuery_default()(this).find('img');
    var imageUrl = $img.data('large-src') || $img.attr('src');
    console.log("[Lightbox] Opening lightbox with image URL:", imageUrl);
    if (!imageUrl) {
      console.error("[Lightbox] Error: Could not find image URL for lightbox.");
      return; // Stop if no URL
    }
    var $lightboxModal = external_jQuery_default()('#ai-gallery-lightbox-modal');
    if ($lightboxModal.length === 0) {
      console.error("[Lightbox] Error: Modal element #ai-gallery-lightbox-modal not found in DOM.");
      return; // Stop if modal doesn't exist
    }
    console.log("[Lightbox] Modal element found.");
    var $lightboxImg = $lightboxModal.find('img');
    if ($lightboxImg.length === 0) {
      console.error("[Lightbox] Error: Image tag not found inside modal.");
      return; // Stop if img tag missing
    }
    console.log("[Lightbox] Modal image tag found.");

    // Set image source
    $lightboxImg.attr('src', imageUrl);
    console.log("[Lightbox] Modal image src set to:", imageUrl);

    // Hide body scroll immediately
    external_jQuery_default()('body').css('overflow', 'hidden');
    console.log("[Lightbox] Body overflow hidden.");

    // --- Revert to original code using class --- 
    console.log("[Lightbox] Attempting to add .visible class...");
    requestAnimationFrame(function () {
      $lightboxModal.addClass('visible');
      console.log("[Lightbox] .visible class added.", "Modal visible status:", $lightboxModal.hasClass('visible'));
    });
    // --- End Revert ---
  });

  // Info icon click handler - NOTE: Info icon is rendered by PHP, we only handle click
  $gallery.on('click', '.image-info-icon', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $icon = external_jQuery_default()(this);
    var $img = $icon.closest('.gallery-item').find('img');
    var parameters = $img.attr('data-parameters') || '';
    console.log("Info icon clicked.");
    console.log("Image Element:", $img[0]);
    console.log("Attempting to read data-parameters attribute:", parameters);
    if (parameters && parameters.trim() !== '') {
      displayInfoModal(parameters);
    } else {
      console.log("No parameters found or attribute is empty.");
      displayInfoModal('');
    }
  });
}

// Function to initialize hover actions (Copy URL, Download)
function initHoverActions($gallery) {
  // Copy URL Button Click
  $gallery.on('click', '.copy-url-button', function (e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent lightbox/info modal trigger

    var $button = external_jQuery_default()(this);
    var $img = $button.closest('.gallery-item').find('img');
    var imageUrl = $img.attr('src');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(imageUrl).then(function () {
        console.log('Image URL copied to clipboard!');
        var originalIcon = $button.html();
        // Use a checkmark SVG for success indication
        $button.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" /></svg>');
        setTimeout(function () {
          return $button.html(originalIcon);
        }, 1500);
      }, function (err) {
        console.error('Failed to copy URL: ', err);
        alert('Failed to copy URL.');
      });
    } else {
      alert('Clipboard API not supported in this browser or context.');
    }
  });

  // Download Image Button Click
  $gallery.on('click', '.download-image-button', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $img = external_jQuery_default()(this).closest('.gallery-item').find('img');
    var imageUrl = $img.attr('src');
    var filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1) || 'downloaded-image';

    // Use fetch to get the image as a blob (necessary for cross-origin downloads)
    fetch(imageUrl).then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP error! status: ".concat(response.status));
      }
      return response.blob();
    }).then(function (blob) {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // Set the filename for download
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })["catch"](function (e) {
      console.error('Error downloading image:', e);
      // If fetch fails (e.g., CORS), try direct link as fallback (might open in new tab)
      try {
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = imageUrl;
        a.target = '_blank'; // Open in new tab as fallback
        a.download = filename; // Attempt download attribute
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (fallbackError) {
        console.error('Fallback download attempt failed:', fallbackError);
        alert('Could not download image.');
      }
    });
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