/******/ (() => { // webpackBootstrap
jQuery(document).ready(function ($) {
  $('.wp-block-techplay-image-compare').each(function () {
    var container = $(this);
    var compareContainer = container.find('.image-compare-container');
    var separator = container.find('.image-compare-separator');
    var secondImage = container.find('img:nth-child(2)');
    var isDragging = false;
    var startX;
    var separatorLeft;

    // 초기 위치 설정 (50%)
    updateImageClip(50);

    // 마우스/터치 이벤트
    separator.on('mousedown touchstart', function (e) {
      isDragging = true;
      startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
      separatorLeft = separator.position().left;
      container.addClass('dragging');
    });
    $(document).on('mousemove touchmove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
      var currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
      var diff = currentX - startX;
      var containerWidth = compareContainer.width();
      var newLeft = Math.min(Math.max(0, separatorLeft + diff), containerWidth);
      var percentage = newLeft / containerWidth * 100;
      updateImageClip(percentage);
    });
    $(document).on('mouseup touchend', function () {
      if (!isDragging) return;
      isDragging = false;
      container.removeClass('dragging');
    });

    // 이미지 클립 업데이트 함수
    function updateImageClip(percentage) {
      secondImage.css('clip-path', "polygon(".concat(percentage, "% 0, 100% 0, 100% 100%, ").concat(percentage, "% 100%)"));
      separator.css('left', "".concat(percentage, "%"));
    }

    // 윈도우 리사이즈 시 위치 조정
    $(window).on('resize', function () {
      var percentage = separator.position().left / compareContainer.width() * 100;
      updateImageClip(percentage);
    });
  });
});
/******/ })()
;
//# sourceMappingURL=image-compare.js.map