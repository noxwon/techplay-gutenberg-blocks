/**
 * AI 이미지 갤러리 프론트엔드 스크립트
 * Masonry 레이아웃, 라이트박스 및 이미지 정보 표시 기능 구현
 */

document.addEventListener('DOMContentLoaded', function() {
    // 갤러리 요소 찾기
    const galleries = document.querySelectorAll('.wp-block-techplay-gutenberg-blocks-ai-image-gallery');
    
    // 각 갤러리 처리
    if (galleries.length > 0) {
        galleries.forEach(gallery => {
            // Masonry 체크
            if (gallery.classList.contains('has-masonry-layout')) {
                // imagesLoaded 및 Masonry 초기화 (전역 객체 사용)
                if (typeof window.imagesLoaded !== 'undefined' && typeof window.Masonry !== 'undefined') {
                    const imgLoad = window.imagesLoaded(gallery);
                    
                    imgLoad.on('done', function() {
                        new window.Masonry(gallery, {
                            itemSelector: '.gallery-item',
                            percentPosition: true,
                            gutter: parseInt(window.getComputedStyle(gallery).getPropertyValue('--gap')) || 0
                        });
                    });
                }
            }
            
            // 라이트박스와 호버 액션 초기화
            if (gallery.classList.contains('has-lightbox')) {
                initializeLightbox(gallery);
            }
            
            initializeHoverActions(gallery);
        });
    }
    
    // 모달 닫기 핸들러 추가
    const closeButtons = document.querySelectorAll('.ai-gallery-modal .close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.ai-gallery-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
});

// Helper Functions
function parseSDParameters(paramsString, promptString) {
    const result = { positive: promptString || '', negative: '', params: {} };
    if (!paramsString || typeof paramsString !== 'string') return result;

    let lines = paramsString.split('\n');
    let negPromptIndex = -1;
    let paramsIndex = -1;

    // Find indices of Negative prompt and Parameters
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('Negative prompt:')) {
            negPromptIndex = i;
        } else if (lines[i].startsWith('Steps:')) {
            paramsIndex = i;
            break;
        }
    }

    // Extract Positive Prompt
    if (negPromptIndex !== -1) {
        result.positive = lines.slice(0, negPromptIndex).join('\n').trim();
    } else if (paramsIndex !== -1) {
        result.positive = lines.slice(0, paramsIndex).join('\n').trim();
    } else if (!result.positive) {
        result.positive = paramsString.trim(); 
    }

    // Extract Negative Prompt
    if (negPromptIndex !== -1) {
        let endIndex = (paramsIndex !== -1 && paramsIndex > negPromptIndex) ? paramsIndex : lines.length;
        result.negative = lines.slice(negPromptIndex, endIndex).join('\n').substring('Negative prompt:'.length).trim();
    }

    // Extract and Parse Parameters
    if (paramsIndex !== -1) {
        const paramsLines = lines.slice(paramsIndex).join(', ');
        const regex = /(\w+(?:\s+\w+)*?):\s*("[^"\\]*(?:\\.[^"\\]*)*"|[^,]+(?:,\s*(?![A-Za-z\s]+:))?)/g;
        let match;
        while ((match = regex.exec(paramsLines)) !== null) {
            const key = match[1].trim();
            let value = match[2].trim();
            if (value.endsWith(',')) value = value.slice(0, -1).trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (key) result.params[key] = value;
        }
    }

    return result;
}

function displayInfoModal(parameters, prompt) {
    let $modal = jQuery('#ai-gallery-info-modal'); 

    // Create modal if it doesn't exist
    if ($modal.length === 0) {
        jQuery('body').append(`
            <div id="ai-gallery-info-modal" class="ai-image-modal" style="display: none;">
                <div class="modal-content">
                    <button class="close-button" title="Close">&times;</button>
                    <div class="image-meta"></div>
                </div>
            </div>
        `);
        $modal = jQuery('#ai-gallery-info-modal');

        // Attach close handlers
        $modal.on('click', function(e) {
            if (jQuery(e.target).is($modal) || jQuery(e.target).closest('.close-button').length) {
                $modal.fadeOut(300); 
            }
        });
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
    // Display Parameters
    const otherParamsKeys = Object.keys(parsedData.params);
    if (otherParamsKeys.length > 0) {
        html += '<div class="meta-section generation-details-section"><h4>Parameters</h4>';
        otherParamsKeys.forEach(key => {
             html += `<p><strong>${escapeHtml(key)}:</strong> <span>${escapeHtml(parsedData.params[key])}</span></p>`;
        });
        html += '</div>';
    } else if (!parsedData.positive && !parsedData.negative) {
         html += '<div class="meta-section generation-details-section"><h4>Parameters</h4><p>No specific parameters found.</p></div>';
    }
    
    // Display Civitai Resources
    if (parsedData.params['Civitai resources'] && typeof parsedData.params['Civitai resources'] === 'string') {
        try {
            const resources = JSON.parse(parsedData.params['Civitai resources'].replace(/&quot;/g, '"'));
            if (Array.isArray(resources)) {
                 html += `<div class="meta-section civitai-resources-section"><h4>Civitai Resources</h4>`;
                resources.forEach(resource => {
                    html += `<p><strong>Type:</strong> ${escapeHtml(resource.type || 'N/A')}, `;
                    if(resource.modelName && resource.modelVersionName) {
                         html += `<strong>Name:</strong> ${escapeHtml(resource.modelName)} (${escapeHtml(resource.modelVersionName)}), `;
                    } else if (resource.modelName) {
                        html += `<strong>Name:</strong> ${escapeHtml(resource.modelName)}, `;
                    }
                    if(resource.weight !== undefined) {
                        html += `<strong>Weight:</strong> ${escapeHtml(resource.weight)}`;
                    }
                     html += `</p>`;
                });
                 html += `</div>`;
            }
        } catch (e) {
             html += `<div class="meta-section civitai-resources-section"><h4>Civitai Resources (Raw)</h4><pre>${escapeHtml(parsedData.params['Civitai resources'])}</pre></div>`;
        }
    }

    $metaContainer.html(html);
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
            lightboxModal.style.display = 'none';
        });
        lightboxModal.addEventListener('mousedown', (e) => { 
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
        });
    });
}

function initializeHoverActions(galleryElement) {
     const items = galleryElement.querySelectorAll('.gallery-item');

    items.forEach(item => {
        const infoButton = item.querySelector('.image-info-icon');
        const copyButton = item.querySelector('.copy-url-button');
        const downloadButton = item.querySelector('.download-image-button');
        const img = item.querySelector('img');
        
        if (infoButton) {
            infoButton.addEventListener('click', (e) => {
                 e.stopPropagation(); 
                 if (typeof displayInfoModal === 'function') {
                    displayInfoModal(img.dataset.parameters, img.dataset.prompt);
                 }
            });
        }
        
        if (copyButton && img) {
            copyButton.addEventListener('click', (e) => {
                 e.stopPropagation();
                const imageUrl = img.dataset.largeSrc || img.src;
                navigator.clipboard.writeText(imageUrl).then(() => {
                    copyButton.classList.add('copied');
                    setTimeout(() => copyButton.classList.remove('copied'), 1500);
                }).catch(err => {
                    // URL 복사 실패 시 조용히 실패
                });
            });
        }

        if (downloadButton && img) {
            downloadButton.addEventListener('click', (e) => {
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
        }
    });
}