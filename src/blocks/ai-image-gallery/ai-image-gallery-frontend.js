import $ from 'jquery';

// Initialize Masonry and Lightbox
$(document).ready(function() {
    const galleries = $('.wp-block-techplay-gutenberg-blocks-ai-image-gallery');

    galleries.each(function() {
        const $gallery = $(this);
        const isMasonry = $gallery.hasClass('has-masonry');
        const hasLightbox = $gallery.hasClass('has-lightbox');

        // Initialize Masonry if enabled
        if (isMasonry && typeof Masonry !== 'undefined') {
            const masonryInstance = new Masonry(this, {
                itemSelector: '.gallery-item',
                columnWidth: '.gallery-item', 
                percentPosition: true,
                gutter: parseInt($gallery.css('gap')) || 16
            });

            // Ensure images are loaded before layout
            imagesLoaded(this).on('progress', function() {
                masonryInstance.layout();
            });
        }

        // Initialize Lightbox if enabled
        if (hasLightbox) {
            initLightbox($gallery);
        }
    });

    // Create a single lightbox modal element for the entire page if it doesn't exist
    if ($('#ai-gallery-lightbox-modal').length === 0) {
        $('body').append(`
            <div id="ai-gallery-lightbox-modal" class="ai-gallery-lightbox-modal" style="display: none;">
                <div class="modal-content">
                    <figure>
                        <span class="close-button">&times;</span>
                        <img src="" alt="">
                    </figure>
                </div>
            </div>
        `);

        // Close modal functionality
        const $modal = $('#ai-gallery-lightbox-modal');
        $modal.on('click', function(e) {
            // Close if clicking on background or close button
            if ($(e.target).is($modal) || $(e.target).is('.close-button')) {
                $modal.fadeOut();
            }
        });
    }

    // Create a single info modal element if it doesn't exist
    if ($('#ai-gallery-info-modal').length === 0) {
        $('body').append(`
            <div id="ai-gallery-info-modal" class="ai-image-modal" style="display: none;">
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <div class="image-meta">
                        <!-- Content will be populated by JS -->
                    </div>
                </div>
            </div>
        `);
        // Close info modal functionality
        const $infoModal = $('#ai-gallery-info-modal');
        $infoModal.on('click', function(e) {
            if ($(e.target).is($infoModal) || $(e.target).is('.close-button')) {
                $infoModal.fadeOut();
            }
        });
    }
});

function initLightbox($gallery) {
    // Image click handler for lightbox
    $gallery.on('click', '.gallery-item > figure > img', function(e) { 
        e.preventDefault();
        e.stopPropagation();

        const $img = $(this);
        const imageUrl = $img.attr('src');
        const altText = $img.attr('alt') || 'Gallery image';

        const $modal = $('#ai-gallery-lightbox-modal');
        const $modalImg = $modal.find('img');

        // Reset image source and hide modal initially
        $modalImg.attr('src', '').attr('alt', '');
        $modal.hide(); // Hide completely initially

        // Preload image
        const tempImg = new Image();
        tempImg.onload = function() {
            // Set modal image source and alt *after* loaded
            $modalImg.attr('src', imageUrl).attr('alt', altText);
            // Show the lightbox modal *after* image is loaded
            $modal.fadeIn(); 
        };
        tempImg.onerror = function() {
            // Handle image loading error (optional)
            console.error("Error loading image for lightbox:", imageUrl);
            // Optionally show an error message or close the modal
            $modal.hide(); // Or $modal.fadeOut();
        };
        tempImg.src = imageUrl; // Start loading
    });

    // Info icon click handler
    $gallery.on('click', '.image-info-icon', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const $icon = $(this);
        const $img = $icon.closest('.gallery-item').find('img');
        // Try reading the attribute directly
        const parameters = $img.attr('data-parameters') || ''; 
        
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
    const result = { positive: '', negative: '', params: {} };
    if (!paramsString || typeof paramsString !== 'string') return result;

    const lines = paramsString.split('\n');
    let positiveLines = [];
    let paramLinesStartIndex = -1;
    let negativePromptLineIndex = -1;

    // First pass: Identify parameter start and negative prompt line
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (paramLinesStartIndex === -1 && line.match(/^\s*\w+\s*:.+/)) {
            paramLinesStartIndex = i;
        }
        if (line.startsWith('Negative prompt:')) {
            negativePromptLineIndex = i;
        }
    }

    // Determine positive prompt lines
    let positiveEndIndex = lines.length; // Default to end if no params/negative found
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
        const paramString = lines.slice(paramLinesStartIndex).join(' ').trim(); // Join remaining lines
        console.log("Parameter string part for parsing:", paramString);

        // Split by comma, looking ahead for "Key:" pattern more carefully
        // This regex is still imperfect for complex values with commas, but better
        const paramParts = paramString.split(/,(?=\s*(?:\w+\s*):\s*)/);
        console.log("Split param parts:", paramParts);

        paramParts.forEach(part => {
            const parts = part.trim().split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let value = parts.slice(1).join(':').trim(); // Join back potential colons
                
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
    const $modal = $('#ai-gallery-info-modal');
    const $metaContainer = $modal.find('.image-meta');
    let html = '<h3>Image Generation Details</h3>';

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
    const parsedData = parseSDParameters(parameters);
    console.log("[displayInfoModal] Parsing complete. Parsed data:", parsedData);

    // Positive Prompt
    if (parsedData.positive) {
        html += `
            <div class="meta-section">
                <h4>Positive Prompt</h4>
                <div class="prompt-box positive">
                    <p>${parsedData.positive.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                </div>
            </div>
        `;
    }

    // Negative Prompt
    if (parsedData.negative) {
        html += `
            <div class="meta-section">
                <h4>Negative Prompt</h4>
                <div class="prompt-box negative">
                     <p>${parsedData.negative.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                </div>
            </div>
        `;
    }

    // Other Parameters
    const otherParamsKeys = Object.keys(parsedData.params);
    if (otherParamsKeys.length > 0) {
        html += '<div class="meta-section"><h4>Parameters</h4>';
        otherParamsKeys.forEach(key => {
            const value = parsedData.params[key];
            html += `<p><strong>${key.replace(/</g, "&lt;").replace(/>/g, "&gt;")}:</strong> ${value.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
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