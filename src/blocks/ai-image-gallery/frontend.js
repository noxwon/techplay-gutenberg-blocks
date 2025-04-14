jQuery(document).ready(function($) {
    const initAiGallery = () => {
        // 라이트박스 HTML 추가
        if ($('.ai-gallery-lightbox').length === 0) {
            $('body').append(`
                <div class="ai-gallery-lightbox">
                    <button class="close-btn">&times;</button>
                    <img src="" alt="" />
                </div>
            `);
        }

        const $lightbox = $('.ai-gallery-lightbox');
        const $lightboxImg = $lightbox.find('img');

        // 이미지 로드 완료 시 애니메이션
        $lightboxImg.on('load', function() {
            $(this).addClass('loaded');
        });

        // 이미지 정보 아이콘 클릭 이벤트
        $('.wp-block-techplay-blocks-ai-image-gallery').on('click', '.image-info-icon', function(e) {
            e.stopPropagation();
            const $info = $(this).siblings('.image-info');
            $('.image-info').not($info).removeClass('show');
            $info.toggleClass('show');
        });

        // 이미지 클릭 시 라이트박스 표시
        $('.wp-block-techplay-blocks-ai-image-gallery.has-lightbox').on('click', '.gallery-item', function(e) {
            if (!$(e.target).hasClass('image-info-icon') && !$(e.target).closest('.image-info').length) {
                const $img = $(this).find('img');
                const imgSrc = $img.attr('src');
                const imgAlt = $img.attr('alt');
                
                $lightboxImg.removeClass('loaded').attr({
                    'src': imgSrc,
                    'alt': imgAlt
                });
                $lightbox.addClass('show');
            }
        });

        // 라이트박스 닫기
        const closeLightbox = () => {
            $lightbox.removeClass('show');
            setTimeout(() => {
                $lightboxImg.removeClass('loaded');
            }, 300);
        };

        $lightbox.on('click', '.close-btn', closeLightbox);

        // ESC 키로 라이트박스 닫기
        $(document).on('keyup', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        // 라이트박스 외부 클릭 시 닫기
        $lightbox.on('click', function(e) {
            if ($(e.target).hasClass('ai-gallery-lightbox')) {
                closeLightbox();
            }
        });

        // 이미지 정보 외부 클릭 시 닫기
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.image-info').length && !$(e.target).hasClass('image-info-icon')) {
                $('.image-info').removeClass('show');
            }
        });

        // 이미지 로드 최적화
        $('.wp-block-techplay-blocks-ai-image-gallery .gallery-item img').each(function() {
            const $img = $(this);
            if (this.complete) {
                $img.addClass('loaded');
            } else {
                $img.on('load', function() {
                    $(this).addClass('loaded');
                });
            }
        });
    };

    // 초기화
    initAiGallery();

    // Gutenberg 블록 변경 시 재초기화
    if (window.wp && wp.data && wp.data.subscribe) {
        let debounceTimer;
        wp.data.subscribe(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(initAiGallery, 300);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // 라이트박스 기능
    const galleries = document.querySelectorAll('.wp-block-techplay-gutenberg-blocks-ai-image-gallery.has-lightbox');
    
    galleries.forEach(gallery => {
        const items = gallery.querySelectorAll('figure.wp-block-image');
        
        items.forEach(item => {
            item.addEventListener('click', function(e) {
                if (e.target.closest('.image-info-icon')) return;
                
                const img = this.querySelector('img');
                const prompt = img.dataset.prompt || '';
                const parameters = img.dataset.parameters || '';
                
                const lightbox = document.createElement('div');
                lightbox.className = 'ai-gallery-lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <img src="${img.src}" alt="${img.alt}">
                        <div class="lightbox-info">
                            <h3>AI 이미지 정보</h3>
                            <p><strong>프롬프트:</strong> ${prompt}</p>
                            <p><strong>파라미터:</strong> ${parameters}</p>
                        </div>
                        <button class="lightbox-close">&times;</button>
                    </div>
                `;
                
                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';
                
                lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                });
                
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) {
                        lightbox.remove();
                        document.body.style.overflow = '';
                    }
                });
            });
        });
    });
}); 