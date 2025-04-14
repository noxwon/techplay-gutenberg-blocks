import $ from 'jquery';

console.log('[AI Gallery Frontend] Script Parsed (Top Level)');

// import $ from 'jquery'; // <-- jQuery 주석 유지
// import Masonry from 'masonry-layout'; // <-- Masonry
// import imagesLoaded from 'imagesloaded'; // <-- imagesLoaded

console.log('[AI Gallery Frontend] Reached Global Scope Test Point 1'); // <-- 전역 스코프 로그 추가

// --- DOMContentLoaded 리스너 전체 라인 단위 주석 해제 ---
document.addEventListener('DOMContentLoaded', function() {
    console.log('[AI Gallery Frontend] Script Loaded');

    const galleries = document.querySelectorAll('.wp-block-techplay-gutenberg-blocks-ai-image-gallery');
    console.log(`[AI Gallery Frontend] Found ${galleries.length} gallery elements.`);

    galleries.forEach((galleryElement, index) => {
        console.log(`[AI Gallery Frontend] Loop ${index}: Processing gallery element:`, galleryElement);
        
        try { // Start error handling block
            const isMasonryEnabled = galleryElement.classList.contains('has-masonry-layout'); 
            console.log(`[Masonry Check] Is Masonry enabled for this gallery?`, isMasonryEnabled);

            if (isMasonryEnabled) {
                console.log('[Masonry Check] Initializing Masonry for:', galleryElement);
                
                imagesLoaded(galleryElement, function(instance) {
                    console.log('[imagesLoaded] All images loaded for gallery:', galleryElement, 'Instance:', instance);
                    
                    // Check again if Masonry is still enabled (state might change)
                     if (galleryElement.classList.contains('has-masonry-layout')) {
                         const msnry = new Masonry(galleryElement, {
                             itemSelector: '.gallery-item',
                             percentPosition: true,
                             gutter: parseInt(getComputedStyle(galleryElement).getPropertyValue('--gap'), 10) || 0 
                         });
                         console.log('[Masonry Init] Masonry instance created (WITH gutter option):', msnry);
                         
                         msnry.layout(); 
                         console.log('[Masonry Init] Masonry layout forced.');
                     } else {
                         console.log('[imagesLoaded] Masonry was disabled before initialization could complete.', galleryElement);
                     }
                });

            } else {
                 console.log('[Masonry Check] Masonry not enabled for gallery (no .has-masonry-layout class found in JS).', galleryElement);
            }
            
            // Initialize Lightbox and Hover Actions regardless of masonry state (if applicable)
            // Make sure these functions exist and are uncommented below
            if (typeof initializeLightbox === 'function') {
                initializeLightbox(galleryElement);
                 console.log(`[Init Functions] Called initializeLightbox for gallery ${index}`);
            }
            if (typeof initializeHoverActions === 'function') {
                initializeHoverActions(galleryElement);
                 console.log(`[Init Functions] Called initializeHoverActions for gallery ${index}`);
            }
            
        } catch (error) {
            console.error('[AI Gallery Frontend] Error processing gallery:', galleryElement, error);
            // Continue to the next gallery even if one fails
        }
    });

    // Initialize Info Modal Close handlers separately ONCE after loop
    if (typeof initializeInfoModalCloseHandlers === 'function') {
        initializeInfoModalCloseHandlers();
    }

    console.log('[AI Gallery Frontend] Finished processing all galleries.');
});
// --- DOMContentLoaded 리스너 전체 라인 단위 주석 끝 ---

console.log('[AI Gallery Frontend] Reached Global Scope Test Point 2'); // <-- 전역 스코프 로그 추가

// --- Helper Functions --- 
// Remove comments from all function definitions below

// Function to parse SD parameters (Revised v5 - Attempt to fix parsing)
function parseSDParameters(paramsString, promptString) {
    const result = { positive: promptString || '', negative: '', params: {} };
    if (!paramsString || typeof paramsString !== 'string') {
        // If paramsString is empty but promptString exists, use it as positive
        return result;
    }

    // Normalize potential JSON embedded data
    try {
        // Handle escaped quotes common in data attributes
        const potentialJson = paramsString.replace(/&quot;/g, '"');
        if (potentialJson.trim().startsWith('{') && potentialJson.trim().endsWith('}')) {
            const jsonData = JSON.parse(potentialJson);
            result.positive = jsonData.prompt || result.positive;
            result.negative = jsonData.negativePrompt || '';
            result.params = jsonData; // Put the whole parsed object in params for now
            // Remove keys we handled separately
            delete result.params.prompt;
            delete result.params.negativePrompt;
            console.log("[Parser] Parsed parameters as JSON:", result);
            return result;
        } 
    } catch (e) {
        console.warn("[Parser] Failed to parse parameters as JSON, falling back to text:", e);
    }
    
    // --- Text Parsing Fallback --- 
    const lines = paramsString.split('\n');
    let currentKey = 'positive'; // Start with positive prompt unless already provided
    let parametersPart = '';

    if (result.positive) { // If prompt came from data-prompt
        currentKey = 'params';
    }

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        if (trimmedLine.startsWith('Negative prompt:')) {
            result.negative = trimmedLine.substring('Negative prompt:'.length).trim();
            currentKey = 'negative';
        } else if (trimmedLine.includes(':') && trimmedLine.match(/^Steps: \d+, Sampler: .+/)) {
            parametersPart = trimmedLine; // Assume this is the start of key-value pairs
            currentKey = 'params';
        } else {
            if (currentKey === 'negative') {
                result.negative += ' ' + trimmedLine;
            } else if (currentKey === 'positive') {
                result.positive += (result.positive ? '\n' : '') + trimmedLine;
            } else if (currentKey === 'params') {
                 parametersPart += ', ' + trimmedLine; // Append to parameters string
            }
        }
    });
    
    // Parse the key-value string
    if (parametersPart) {
        // Match key: value pairs, handling potential commas in values but not keys
        const regex = /(\w+(?:\s+\w+)*?):\s*("[^"\\]*(?:\\.[^"\\]*)*"|[^,]+(?:,\s*(?![A-Za-z\s]+:))?)/g;
        let match;
        while ((match = regex.exec(parametersPart)) !== null) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove trailing comma if present
            if (value.endsWith(',')) {
                value = value.slice(0, -1).trim();
            }
            // Remove surrounding quotes if value is a quoted string
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            result.params[key] = value;
        }
    }

    result.positive = result.positive.trim();
    result.negative = result.negative.trim();

    console.log("[Parser] Parsed as Text (v5):", result);
    return result;
}

// Function to display info modal (Adjust HTML generation)
function displayInfoModal(parameters, prompt) {
    let $modal = $('#ai-gallery-info-modal'); 

    // Create modal if it doesn't exist
    if ($modal.length === 0) {
        console.log('[Info Modal] Creating modal element.');
        $('body').append(`
            <div id="ai-gallery-info-modal" class="ai-image-modal" style="display: none;">
                <div class="modal-content">
                    <button class="close-button" title="Close">&times;</button>
                    <div class="image-meta"></div>
                </div>
            </div>
        `);
        $modal = $('#ai-gallery-info-modal'); // Re-select the modal

        // Attach close handlers only when creating the modal
        $modal.on('click', function(e) {
            if ($(e.target).is($modal) || $(e.target).closest('.close-button').length) {
                console.log('[Info Modal Close] Closing via click.');
                $modal.fadeOut(300); 
            }
        });
        console.log('[Info Modal] Close handlers attached.');
    }

    const $metaContainer = $modal.find('.image-meta');
    let html = '<h3>Image Generation Details</h3>';

    const parsedData = parseSDParameters(parameters, prompt);

    // Display Positive Prompt
    if (parsedData.positive) {
        html += `<div class="meta-section"><h4>Positive Prompt</h4><div class="prompt-box positive"><p>${escapeHtml(parsedData.positive)}</p></div></div>`;
    } 
    // Display Negative Prompt
    if (parsedData.negative) {
        html += `<div class="meta-section"><h4>Negative Prompt</h4><div class="prompt-box negative"><p>${escapeHtml(parsedData.negative)}</p></div></div>`;
    }
    // Display Other Parameters
    const otherParamsKeys = Object.keys(parsedData.params);
    if (otherParamsKeys.length > 0) {
        html += '<div class="meta-section generation-details-section"><h4>Parameters</h4>';
        otherParamsKeys.forEach(key => {
             // Ensure we don't re-display prompt/negative prompt if they ended up in params
             if (key.toLowerCase() !== 'prompt' && key.toLowerCase() !== 'negative prompt') {
                 html += `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(parsedData.params[key])}</p>`;
             }
        });
        html += '</div>';
    } else if (!parsedData.positive && !parsedData.negative) {
         html += '<div class="meta-section generation-details-section"><h4>Parameters</h4><p>No specific parameters found.</p></div>';
    }
    
    // Display Civitai Resources (assuming parsedData.params contains this key)
    if (parsedData.params['Civitai resources'] && typeof parsedData.params['Civitai resources'] === 'string') { // Check if it's a string needing parsing
        try {
            const resources = JSON.parse(parsedData.params['Civitai resources'].replace(/&quot;/g, '"')); // Handle escaped quotes
            if (Array.isArray(resources)) {
                 html += `<div class="meta-section civitai-resources-section"><h4>Civitai Resources</h4>`;
                resources.forEach(resource => {
                    html += `<p><strong>Type:</strong> ${escapeHtml(resource.type || 'N/A')}, `;
                    if(resource.modelName && resource.modelVersionName) {
                         html += `<strong>Name:</strong> ${escapeHtml(resource.modelName)} (${escapeHtml(resource.modelVersionName)}), `;
                    } else if (resource.modelName) {
                        html += `<strong>Name:</strong> ${escapeHtml(resource.modelName)}, `;
                    }
                    if(resource.weight !== undefined) { // Check for undefined explicitly
                        html += `<strong>Weight:</strong> ${escapeHtml(resource.weight)}`;
                    }
                     html += `</p>`;
                });
                 html += `</div>`;
            }
        } catch (e) {
            console.error("Error parsing Civitai resources:", e);
             // Optionally display the raw string if parsing fails
             html += `<div class="meta-section civitai-resources-section"><h4>Civitai Resources (Raw)</h4><pre>${escapeHtml(parsedData.params['Civitai resources'])}</pre></div>`;
        }
    }

    $metaContainer.html(html);
    console.log("[displayInfoModal] HTML set. Fading in...");
    $modal.css('display', 'flex').hide().fadeIn(300);
}

function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe; 
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function initializeLightbox(galleryElement) {
    if (!galleryElement.classList.contains('has-lightbox')) return;

    let lightboxModal = document.getElementById('ai-gallery-lightbox-modal');
    if (!lightboxModal) {
        lightboxModal = document.createElement('div');
        lightboxModal.id = 'ai-gallery-lightbox-modal';
        lightboxModal.innerHTML = `
            <div class="modal-content">
                <figure>
                    <img src="" alt="" id="lightbox-image">
                </figure>
                <button class="close-button" title="Close lightbox">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                     </svg>
                </button>
            </div>
        `;
        lightboxModal.querySelector('.close-button').addEventListener('mousedown', (e) => { 
            e.stopPropagation(); 
            console.log('[Listener Debug] Lightbox CLOSE BUTTON mousedown!'); 
            lightboxModal.style.display = 'none';
        });
        lightboxModal.addEventListener('mousedown', (e) => { 
            console.log('[Listener Debug] Lightbox OVERLAY mousedown (target, modal): ', e.target, lightboxModal);
            if (e.target === lightboxModal) { 
                lightboxModal.style.display = 'none';
            }
        });
        document.body.appendChild(lightboxModal);
    }

    const lightboxImage = lightboxModal.querySelector('#lightbox-image');

    galleryElement.querySelectorAll('.gallery-item img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            
            const largeSrc = e.target.dataset.largeSrc || e.target.src;
            const altText = e.target.alt || '';
            lightboxImage.src = largeSrc;
            lightboxImage.alt = altText;
            lightboxModal.style.display = 'flex';
            console.log('[Lightbox] Image clicked, opening via style.');
        });
    });
}

// NEW function to setup info modal close handlers ONCE
function initializeInfoModalCloseHandlers() {
    const infoModal = document.getElementById('ai-gallery-info-modal');
    if (infoModal && !infoModal.dataset.closeHandlerAttached) {
        console.log('[Info Modal] Attaching close handlers.');
        const closeButton = infoModal.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('mousedown', (e) => { 
                e.stopPropagation(); 
                console.log('[Listener Debug] Info Modal CLOSE BUTTON mousedown!'); 
                infoModal.style.display = 'none'; 
            });
        }
        infoModal.addEventListener('mousedown', (e) => { 
            console.log('[Listener Debug] Info Modal OVERLAY mousedown (target, modal): ', e.target, infoModal);
            if (e.target === infoModal) {
                infoModal.style.display = 'none';
            }
        });
        infoModal.dataset.closeHandlerAttached = 'true'; 
    } else if (infoModal) {
         console.log('[Info Modal] Close handlers already attached.');
    } else {
         console.error('[Info Modal] Cannot attach close handlers, modal not found.');
    }
}

function initializeHoverActions(galleryElement) {
     console.log('[Hover Actions] Initializing for gallery:', galleryElement);
     const items = galleryElement.querySelectorAll('.gallery-item');
     console.log(`[Hover Actions] Found ${items.length} items`);

    items.forEach((item, itemIndex) => {
        const infoButton = item.querySelector('.image-info-icon');
        const copyButton = item.querySelector('.copy-url-button');
        const downloadButton = item.querySelector('.download-image-button');
        const img = item.querySelector('img');
        
        // Log found elements for debugging
        console.log(`[Hover Actions] Item ${itemIndex}: InfoBtn:`, infoButton, `CopyBtn:`, copyButton, `DlBtn:`, downloadButton, `Img:`, img);

        if (infoButton) {
             console.log(`[Hover Actions] Item ${itemIndex}: Adding click listener to infoButton`);
            infoButton.addEventListener('click', (e) => {
                 console.log(`[Hover Actions] Item ${itemIndex}: Info button clicked!`);
                 e.stopPropagation(); 
                 if (typeof displayInfoModal === 'function') {
                    displayInfoModal(img.dataset.parameters, img.dataset.prompt);
                 } else {
                     console.error('displayInfoModal function not found!');
                 }
            });
        } else {
            console.log(`[Hover Actions] Item ${itemIndex}: Info button not found.`);
        }
        
        if (copyButton && img) {
             console.log(`[Hover Actions] Item ${itemIndex}: Adding click listener to copyButton`);
            copyButton.addEventListener('click', (e) => {
                 console.log(`[Hover Actions] Item ${itemIndex}: Copy button clicked!`);
                 e.stopPropagation();
                const imageUrl = img.dataset.largeSrc || img.src;
                navigator.clipboard.writeText(imageUrl).then(() => {
                    copyButton.classList.add('copied');
                    setTimeout(() => copyButton.classList.remove('copied'), 1500);
                }).catch(err => {
                    console.error('Failed to copy URL: ', err);
                });
            });
        } else {
             console.log(`[Hover Actions] Item ${itemIndex}: Copy button or image not found.`);
        }

        if (downloadButton && img) {
             console.log(`[Hover Actions] Item ${itemIndex}: Adding click listener to downloadButton`);
            downloadButton.addEventListener('click', (e) => {
                 console.log(`[Hover Actions] Item ${itemIndex}: Download button clicked!`);
                 e.stopPropagation();
                const imageUrl = img.dataset.largeSrc || img.src;
                const link = document.createElement('a');
                link.href = imageUrl;
                const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1).split('?')[0] || 'download.jpg';
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        } else {
            console.log(`[Hover Actions] Item ${itemIndex}: Download button or image not found.`);
        }
    });
}
// Ensure functions are defined before being called
// --- Helper Functions --- 