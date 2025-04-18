jQuery(document).ready(function($) {
    $('.download-button').on('click', function(e) {
        e.preventDefault();
        
        const button = $(this);
        const fileUrl = button.data('file');
        const fileName = button.data('filename');
        
        // 파일 확장자 확인
        const fileExt = fileUrl.split('.').pop().toLowerCase();
        
        if (fileExt === 'pdf') {
            // PDF 파일인 경우 새 창에서 열기
            window.open(fileUrl, '_blank');
        } else {
            // 다른 파일은 AJAX를 통해 다운로드
            $.ajax({
                url: techplayBlocks.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'secure_download',
                    nonce: techplayBlocks.nonce,
                    file_url: fileUrl
                },
                xhrFields: {
                    responseType: 'blob'
                },
                success: function(response) {
                    // Blob URL 생성
                    const blob = new Blob([response], { type: response.type });
                    const url = window.URL.createObjectURL(blob);
                    
                    // 다운로드 링크 생성 및 클릭
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileName || fileUrl.split('/').pop();
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Blob URL 해제
                    window.URL.revokeObjectURL(url);
                }
            });
        }
        
        // 다운로드 카운트 증가
        $.ajax({
            url: techplayBlocks.ajaxUrl,
            type: 'POST',
            data: {
                action: 'increment_download_count',
                nonce: techplayBlocks.nonce,
                file_url: fileUrl
            }
        });
    });
}); 