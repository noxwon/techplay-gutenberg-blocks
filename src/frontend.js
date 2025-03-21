(function($) {
    'use strict';

    $(document).ready(function() {
        $('.wp-block-techplay-download-button .download-button').on('click', function(e) {
            e.preventDefault();
            
            const button = $(this);
            const fileUrl = button.data('file');
            const fileName = button.data('filename');

            if (!fileUrl) {
                return;
            }

            // 다운로드 카운트 증가
            $.ajax({
                url: techplayBlocks.ajaxUrl,
                method: 'POST',
                data: {
                    action: 'increment_download_count',
                    nonce: techplayBlocks.nonce,
                    file_url: fileUrl
                },
                success: function(response) {
                    if (response.success) {
                        // 파일 다운로드 실행
                        const link = document.createElement('a');
                        link.href = fileUrl;
                        link.download = fileName || '';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }
            });
        });
    });
})(jQuery); 