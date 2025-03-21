jQuery(document).ready(function($) {
    $('.wp-block-techplay-image-compare').each(function() {
        const container = $(this);
        const compareContainer = container.find('.image-compare-container');
        const separator = container.find('.image-compare-separator');
        const secondImage = container.find('img:nth-child(2)');
        
        let isDragging = false;
        let startX;
        let separatorLeft;

        // 초기 위치 설정 (50%)
        updateImageClip(50);
        
        // 마우스/터치 이벤트
        separator.on('mousedown touchstart', function(e) {
            isDragging = true;
            startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
            separatorLeft = separator.position().left;
            
            container.addClass('dragging');
        });
        
        $(document).on('mousemove touchmove', function(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            const currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
            const diff = currentX - startX;
            const containerWidth = compareContainer.width();
            const newLeft = Math.min(Math.max(0, separatorLeft + diff), containerWidth);
            const percentage = (newLeft / containerWidth) * 100;
            
            updateImageClip(percentage);
        });
        
        $(document).on('mouseup touchend', function() {
            if (!isDragging) return;
            isDragging = false;
            container.removeClass('dragging');
        });
        
        // 이미지 클립 업데이트 함수
        function updateImageClip(percentage) {
            secondImage.css('clip-path', `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`);
            separator.css('left', `${percentage}%`);
        }
        
        // 윈도우 리사이즈 시 위치 조정
        $(window).on('resize', function() {
            const percentage = (separator.position().left / compareContainer.width()) * 100;
            updateImageClip(percentage);
        });
    });
}); 