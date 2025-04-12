/******/ (() => { // webpackBootstrap
jQuery(document).ready(function ($) {
  // 레퍼런스 링크 아이템에 호버 효과 추가
  $('.reference-link-item').hover(function () {
    $(this).addClass('hover');
  }, function () {
    $(this).removeClass('hover');
  });

  // 링크 클릭 시 새 창에서 열기
  $('.reference-link-item a').on('click', function (e) {
    e.preventDefault();
    window.open($(this).attr('href'), '_blank');
  });
});
/******/ })()
;
//# sourceMappingURL=reference-links.js.map