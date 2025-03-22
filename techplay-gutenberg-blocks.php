<?php
/**
 * Plugin Name: TechPlay Gutenberg Blocks
 * Description: 다운로드 버튼, 이미지 비교, 레퍼런스 링크 블록을 추가하는 플러그인
 * Version: 1.0.0
 * Author: noxwon
 */

if (!defined('ABSPATH')) {
    exit;
}

class TechPlayGutenbergBlocks {
    public function __construct() {
        add_action('init', array($this, 'register_blocks'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('wp_ajax_increment_download_count', array($this, 'handle_download_count'));
        add_action('wp_ajax_nopriv_increment_download_count', array($this, 'handle_download_count'));
        add_action('wp_ajax_secure_download', array($this, 'handle_secure_download'));
        add_action('wp_ajax_nopriv_secure_download', array($this, 'handle_secure_download'));
    }

    public function register_blocks() {
        register_block_type('techplay-blocks/download-button', array(
            'editor_script' => 'techplay-blocks-editor',
            'editor_style'  => 'techplay-blocks-editor-style',
            'style'         => 'techplay-blocks-style',
            'render_callback' => array($this, 'render_download_button')
        ));

        register_block_type('techplay-blocks/image-compare', array(
            'editor_script' => 'techplay-blocks-editor',
            'editor_style'  => 'techplay-blocks-editor-style',
            'style'         => 'techplay-blocks-style',
            'render_callback' => array($this, 'render_image_compare')
        ));

        register_block_type('techplay-blocks/reference-links', array(
            'editor_script' => 'techplay-blocks-editor',
            'editor_style'  => 'techplay-blocks-editor-style',
            'style'         => 'techplay-blocks-style',
            'render_callback' => array($this, 'render_reference_links')
        ));
    }

    public function enqueue_editor_assets() {
        wp_enqueue_script(
            'techplay-blocks-editor',
            plugins_url('build/index.js', __FILE__),
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n')
        );

        wp_enqueue_style(
            'techplay-blocks-editor-style',
            plugins_url('build/editor.css', __FILE__)
        );
    }

    public function enqueue_frontend_assets() {
        if (is_singular()) {
            $post = get_post();
            if (!has_blocks($post->post_content)) {
                return;
            }

            // 공통 스타일 로드
            wp_enqueue_style(
                'techplay-blocks-style',
                plugins_url('build/style.css', __FILE__),
                array(),
                filemtime(plugin_dir_path(__FILE__) . 'build/style.css')
            );
            
            // jQuery 의존성 추가
            wp_enqueue_script('jquery');
            
            if (has_block('techplay-blocks/download-button', $post)) {
                wp_enqueue_script(
                    'techplay-download-button',
                    plugins_url('build/download-button.js', __FILE__),
                    array('jquery'),
                    filemtime(plugin_dir_path(__FILE__) . 'build/download-button.js'),
                    true
                );
                
                // nonce와 ajaxUrl 추가
                wp_localize_script('techplay-download-button', 'techplayBlocks', array(
                    'ajaxUrl' => admin_url('admin-ajax.php'),
                    'nonce' => wp_create_nonce('techplay-blocks-nonce')
                ));
            }
            
            if (has_block('techplay-blocks/image-compare', $post)) {
                wp_enqueue_script(
                    'techplay-image-compare',
                    plugins_url('build/image-compare.js', __FILE__),
                    array('jquery'),
                    filemtime(plugin_dir_path(__FILE__) . 'build/image-compare.js'),
                    true
                );
            }
            
            if (has_block('techplay-blocks/reference-links', $post)) {
                wp_enqueue_script(
                    'techplay-reference-links',
                    plugins_url('build/reference-links.js', __FILE__),
                    array('jquery'),
                    filemtime(plugin_dir_path(__FILE__) . 'build/reference-links.js'),
                    true
                );
            }
        }
    }

    public function register_rest_routes() {
        register_rest_route('techplay-blocks/v1', '/download-count', array(
            'methods' => 'POST',
            'callback' => array($this, 'update_download_count'),
            'permission_callback' => function() {
                return true;
            }
        ));

        register_rest_route('techplay-blocks/v1', '/fetch-site-info', array(
            'methods' => 'POST',
            'callback' => array($this, 'fetch_site_info'),
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            }
        ));
    }

    public function add_admin_menu() {
        add_menu_page(
            '다운로드 통계',
            'TechPlay 블록',
            'manage_options',
            'techplay-blocks',
            array($this, 'render_admin_page'),
            'dashicons-chart-bar'
        );
    }

    public function render_download_button($attributes) {
        $fileURL = isset($attributes['fileURL']) ? $attributes['fileURL'] : '';
        $buttonText = isset($attributes['buttonText']) ? $attributes['buttonText'] : '다운로드';
        $buttonStyle = isset($attributes['buttonStyle']) ? $attributes['buttonStyle'] : 'default';
        $buttonIcon = isset($attributes['buttonIcon']) ? $attributes['buttonIcon'] : 'download';
        $fileName = isset($attributes['fileName']) ? $attributes['fileName'] : '';
        $alignment = isset($attributes['alignment']) ? $attributes['alignment'] : 'left';
        $size = isset($attributes['size']) ? $attributes['size'] : 'size-default';
        $backgroundColor = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : '#007bff';
        $textColor = isset($attributes['textColor']) ? $attributes['textColor'] : '#ffffff';
        $hoverBackgroundColor = isset($attributes['hoverBackgroundColor']) ? $attributes['hoverBackgroundColor'] : '#0056b3';
        $hoverTextColor = isset($attributes['hoverTextColor']) ? $attributes['hoverTextColor'] : '#ffffff';

        $blockClassName = [
            'wp-block-techplay-download-button',
            "style-{$buttonStyle}",
            $size
        ];
        $blockClassName = implode(' ', array_filter($blockClassName));

        $alignmentStyle = [
            'display' => 'flex',
            'justify-content' => $alignment === 'left' ? 'flex-start' : 
                               ($alignment === 'center' ? 'center' : 'flex-end')
        ];

        $style = array_merge([
            '--button-bg-color' => $backgroundColor,
            '--button-text-color' => $textColor,
            '--button-hover-bg-color' => $hoverBackgroundColor,
            '--button-hover-text-color' => $hoverTextColor
        ], $alignmentStyle);

        $styleString = '';
        foreach ($style as $property => $value) {
            $styleString .= "$property: $value; ";
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr($blockClassName); ?>" style="<?php echo esc_attr($styleString); ?>">
            <button class="download-button" data-file="<?php echo esc_url($fileURL); ?>" data-filename="<?php echo esc_attr($fileName); ?>" data-icon="<?php echo esc_attr($buttonIcon); ?>">
                <span class="button-icon">
                    <?php if ($buttonIcon) : ?>
                        <span class="icon-<?php echo esc_attr($buttonIcon); ?>"></span>
                    <?php endif; ?>
                </span>
                <span class="button-text"><?php echo esc_html($buttonText); ?></span>
            </button>
        </div>
        <?php
        return ob_get_clean();
    }

    public function render_image_compare($attributes) {
        if (empty($attributes['image1']) || empty($attributes['image2'])) {
            return '';
        }

        return sprintf(
            '<div class="wp-block-techplay-image-compare">
                <div class="image-compare-container">
                    <img src="%s" alt="%s" class="image-compare-before" />
                    <img src="%s" alt="%s" class="image-compare-after" />
                    <div class="image-compare-separator"></div>
                </div>
            </div>',
            esc_url($attributes['image1']['url']),
            esc_attr($attributes['image1']['alt'] ?? ''),
            esc_url($attributes['image2']['url']),
            esc_attr($attributes['image2']['alt'] ?? '')
        );
    }

    public function render_reference_links($attributes) {
        if (empty($attributes['links'])) {
            return '';
        }

        $showIcon = isset($attributes['showIcon']) ? $attributes['showIcon'] : true;
        $fontSize = isset($attributes['fontSize']) ? $attributes['fontSize'] : 'inherit';
        $fontSizeUnit = isset($attributes['fontSizeUnit']) ? $attributes['fontSizeUnit'] : 'px';

        $style = sprintf(
            'style="--reference-link-font-size: %s; --reference-link-icon-size: %s;"',
            $fontSize === 'inherit' ? 'inherit' : $fontSize . $fontSizeUnit,
            $fontSize === 'inherit' ? '1em' : $fontSize . $fontSizeUnit
        );

        $output = sprintf(
            '<div class="wp-block-techplay-reference-links" %s>',
            $style
        );
        
        foreach ($attributes['links'] as $link) {
            $favicon = '';
            if ($showIcon) {
                $favicon = !empty($link['favicon']) ? sprintf(
                    '<img src="%s" alt="" class="reference-link-favicon" />',
                    esc_url($link['favicon'])
                ) : sprintf(
                    '<span class="reference-link-favicon default-icon" data-icon="external"></span>'
                );
            }
            
            $output .= sprintf(
                '<div class="reference-link-item">
                    <a href="%s" target="_blank" rel="noopener noreferrer">
                        %s
                        <span class="reference-link-title">%s</span>
                    </a>
                </div>',
                esc_url($link['url']),
                $favicon,
                esc_html($link['title'] ?: $link['url'])
            );
        }
        
        $output .= '</div>';
        return $output;
    }

    public function update_download_count($request) {
        if (!wp_verify_nonce($request['nonce'], 'techplay-blocks-nonce')) {
            return new WP_Error('invalid_nonce', '잘못된 요청입니다.', array('status' => 403));
        }

        $file_url = sanitize_text_field($request['file_url']);
        
        $download_counts = get_option('techplay_download_counts', array());
        if (!isset($download_counts[$file_url])) {
            $download_counts[$file_url] = 0;
        }
        $download_counts[$file_url]++;
        update_option('techplay_download_counts', $download_counts);

        return array(
            'success' => true,
            'count' => $download_counts[$file_url]
        );
    }

    public function fetch_site_info($request) {
        $url = $request->get_param('url');
        
        if (empty($url)) {
            return new WP_Error('invalid_url', '유효하지 않은 URL입니다.', array('status' => 400));
        }

        // 사이트 정보 가져오기
        $response = wp_remote_get($url, array(
            'timeout' => 10,
            'sslverify' => false
        ));

        if (is_wp_error($response)) {
            return new WP_Error('request_failed', '사이트 정보를 가져오는데 실패했습니다.', array('status' => 500));
        }

        $body = wp_remote_retrieve_body($response);
        
        // HTML 파싱
        libxml_use_internal_errors(true);
        $doc = new DOMDocument();
        @$doc->loadHTML($body);
        libxml_clear_errors();

        // 타이틀 가져오기
        $title = '';
        $titleTags = $doc->getElementsByTagName('title');
        if ($titleTags->length > 0) {
            $title = $titleTags->item(0)->textContent;
        }

        // 파비콘 가져오기
        $favicon = '';
        $links = $doc->getElementsByTagName('link');
        foreach ($links as $link) {
            $rel = $link->getAttribute('rel');
            if (strpos($rel, 'icon') !== false) {
                $favicon = $link->getAttribute('href');
                break;
            }
        }

        // 상대 경로를 절대 경로로 변환
        if ($favicon && strpos($favicon, 'http') !== 0) {
            $parsed_url = parse_url($url);
            $base_url = $parsed_url['scheme'] . '://' . $parsed_url['host'];
            
            if (strpos($favicon, '//') === 0) {
                $favicon = $parsed_url['scheme'] . ':' . $favicon;
            } elseif (strpos($favicon, '/') === 0) {
                $favicon = $base_url . $favicon;
            } else {
                $favicon = $base_url . '/' . $favicon;
            }
        }

        return array(
            'success' => true,
            'title' => $title,
            'favicon' => $favicon
        );
    }

    public function render_admin_page() {
        $download_counts = get_option('techplay_download_counts', array());
        
        // 기존 데이터를 새로운 형식으로 변환
        $converted = false;
        foreach ($download_counts as $file_url => $data) {
            if (is_int($data)) {
                $download_counts[$file_url] = array(
                    'total' => $data,
                    'daily' => array(
                        date('Y-m-d') => $data
                    )
                );
                $converted = true;
            }
        }
        
        if ($converted) {
            update_option('techplay_download_counts', $download_counts);
        }
        
        echo '<div class="wrap">';
        echo '<h1>다운로드 통계</h1>';
        
        // 전체 통계 테이블
        echo '<h2>전체 통계</h2>';
        echo '<table class="wp-list-table widefat fixed striped">';
        echo '<thead><tr><th>파일</th><th>총 다운로드 횟수</th></tr></thead>';
        echo '<tbody>';
        
        foreach ($download_counts as $file_url => $data) {
            printf(
                '<tr><td>%s</td><td>%d</td></tr>',
                esc_html($file_url),
                intval($data['total'])
            );
        }
        
        echo '</tbody></table>';
        
        // 날짜별 통계 테이블
        echo '<h2>날짜별 통계</h2>';
        echo '<table class="wp-list-table widefat fixed striped">';
        echo '<thead><tr><th>파일</th><th>날짜</th><th>다운로드 횟수</th></tr></thead>';
        echo '<tbody>';
        
        foreach ($download_counts as $file_url => $data) {
            if (isset($data['daily'])) {
                foreach ($data['daily'] as $date => $count) {
                    printf(
                        '<tr><td>%s</td><td>%s</td><td>%d</td></tr>',
                        esc_html($file_url),
                        esc_html($date),
                        intval($count)
                    );
                }
            }
        }
        
        echo '</tbody></table>';
        
        // 통계 초기화 버튼
        echo '<form method="post" action="">';
        wp_nonce_field('reset_download_stats', 'reset_stats_nonce');
        echo '<p class="submit">';
        echo '<input type="submit" name="reset_stats" class="button button-secondary" value="통계 초기화" onclick="return confirm(\'정말로 통계를 초기화하시겠습니까?\');">';
        echo '</p>';
        echo '</form>';
        
        echo '</div>';
        
        // 통계 초기화 처리
        if (isset($_POST['reset_stats']) && check_admin_referer('reset_download_stats', 'reset_stats_nonce')) {
            update_option('techplay_download_counts', array());
            echo '<div class="notice notice-success"><p>통계가 초기화되었습니다.</p></div>';
        }
    }

    public function handle_download_count() {
        check_ajax_referer('techplay-blocks-nonce', 'nonce');
        
        $file_url = sanitize_text_field($_POST['file_url']);
        if (empty($file_url)) {
            wp_send_json_error('Invalid file URL');
        }
        
        // 다운로드 카운트 증가
        $download_counts = get_option('techplay_download_counts', array());
        
        // 기존 데이터가 정수인 경우 새로운 형식으로 변환
        if (isset($download_counts[$file_url]) && is_int($download_counts[$file_url])) {
            $download_counts[$file_url] = array(
                'total' => $download_counts[$file_url],
                'daily' => array(
                    date('Y-m-d') => $download_counts[$file_url]
                )
            );
        }
        
        if (!isset($download_counts[$file_url])) {
            $download_counts[$file_url] = array(
                'total' => 0,
                'daily' => array()
            );
        }
        
        // 전체 카운트 증가
        $download_counts[$file_url]['total']++;
        
        // 날짜별 카운트 증가
        $today = date('Y-m-d');
        if (!isset($download_counts[$file_url]['daily'][$today])) {
            $download_counts[$file_url]['daily'][$today] = 0;
        }
        $download_counts[$file_url]['daily'][$today]++;
        
        update_option('techplay_download_counts', $download_counts);
        
        wp_send_json_success(array(
            'count' => $download_counts[$file_url]['total']
        ));
    }

    public function handle_secure_download() {
        check_ajax_referer('techplay-blocks-nonce', 'nonce');
        
        $file_url = sanitize_text_field($_POST['file_url']);
        if (empty($file_url)) {
            wp_send_json_error('Invalid file URL');
        }
        
        // 외부 URL인 경우
        if (strpos($file_url, 'http') === 0 && strpos($file_url, site_url()) !== 0) {
            $response = wp_remote_get($file_url);
            if (is_wp_error($response)) {
                wp_send_json_error('Failed to fetch external file');
            }
            
            $content_type = wp_remote_retrieve_header($response, 'content-type');
            $file_content = wp_remote_retrieve_body($response);
            
            header('Content-Type: ' . $content_type);
            header('Content-Disposition: attachment; filename="' . basename($file_url) . '"');
            header('Content-Length: ' . strlen($file_content));
            header('Cache-Control: no-cache');
            header('Pragma: no-cache');
            header('X-Content-Type-Options: nosniff');
            header('Content-Transfer-Encoding: binary');
            
            echo $file_content;
            exit;
        }
        
        // 내부 파일인 경우
        $upload_dir = wp_upload_dir();
        $file_path = str_replace($upload_dir['baseurl'], $upload_dir['basedir'], $file_url);
        
        if (!file_exists($file_path)) {
            wp_send_json_error('File not found');
        }
        
        // 파일 확장자 확인
        $file_ext = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));
        
        // MIME 타입 설정
        $mime_types = array(
            'zip' => 'application/zip',
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt' => 'text/plain',
            'csv' => 'text/csv',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'html' => 'text/html'
        );
        
        $mime_type = isset($mime_types[$file_ext]) ? $mime_types[$file_ext] : 'application/octet-stream';
        
        // 파일 다운로드 헤더 설정
        header('Content-Type: ' . $mime_type);
        header('Content-Disposition: attachment; filename="' . basename($file_path) . '"');
        header('Content-Length: ' . filesize($file_path));
        header('Cache-Control: no-cache');
        header('Pragma: no-cache');
        header('X-Content-Type-Options: nosniff');
        header('Content-Transfer-Encoding: binary');
        
        if (ob_get_level()) {
            ob_end_clean();
        }
        
        readfile($file_path);
        exit;
    }
}

new TechPlayGutenbergBlocks(); 