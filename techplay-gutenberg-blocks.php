<?php
/**
 * Plugin Name: TechPlay Gutenberg Blocks
 * Description: 다운로드 버튼, 이미지 비교, 레퍼런스 링크, AI 이미지 갤러리 블록을 추가하는 플러그인
 * Version: 1.2.0
 * Author: noxwon
 * License: MIT
 */

if (!defined('ABSPATH')) {
    exit;
}

// Composer Autoloader는 PHPExiftool을 사용하지 않으므로 제거하거나 주석 처리 가능
/*
$composer_autoloader = __DIR__ . '/vendor/autoload.php';
if (file_exists($composer_autoloader)) {
    require_once $composer_autoloader;
}
*/

class TechPlayGutenbergBlocks {
    public function __construct() {
        add_action('init', array($this, 'register_scripts_and_blocks'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('wp_ajax_increment_download_count', array($this, 'handle_download_count'));
        add_action('wp_ajax_nopriv_increment_download_count', array($this, 'handle_download_count'));
        add_action('wp_ajax_secure_download', array($this, 'handle_secure_download'));
        add_action('wp_ajax_nopriv_secure_download', array($this, 'handle_secure_download'));
    }

    public function register_scripts_and_blocks() {
        // 에디터 스크립트 등록
        wp_register_script(
            'techplay-blocks-editor',
            plugins_url('build/index.js', __FILE__),
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
            filemtime(plugin_dir_path(__FILE__) . 'build/index.js'),
            true
        );

        // 공통 스타일 등록 (에디터 + 프론트)
        wp_register_style(
            'techplay-blocks-common-style',
            plugins_url('build/style.css', __FILE__),
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'build/style.css')
        );

        // 에디터 전용 스타일 등록
        wp_register_style(
            'techplay-blocks-editor-style',
            plugins_url('build/index.css', __FILE__),
            array('wp-edit-blocks'),
            filemtime(plugin_dir_path(__FILE__) . 'build/index.css')
        );

        // AI 이미지 갤러리 블록 등록 (block.json 사용)
        register_block_type( plugin_dir_path( __FILE__ ) . 'src/blocks/ai-image-gallery' );

        register_block_type('techplay-gutenberg-blocks/download-button', array(
            'editor_script' => 'techplay-blocks-editor',
            'editor_style'  => 'techplay-blocks-editor-style',
            'style'         => 'techplay-blocks-common-style',
            'render_callback' => array($this, 'render_download_button')
        ));

        register_block_type('techplay-gutenberg-blocks/image-compare', array(
            'editor_script' => 'techplay-blocks-editor',
            'editor_style'  => 'techplay-blocks-editor-style',
            'style'         => 'techplay-blocks-common-style',
            'render_callback' => array($this, 'render_image_compare')
        ));

        register_block_type('techplay-gutenberg-blocks/reference-links', array(
            'editor_script' => 'techplay-blocks-editor',
            'editor_style'  => 'techplay-blocks-editor-style',
            'style'         => 'techplay-blocks-common-style',
            'render_callback' => array($this, 'render_reference_links')
        ));
    }

    public function enqueue_editor_assets() {
        wp_enqueue_script('techplay-blocks-editor');
        wp_enqueue_style('techplay-blocks-editor-style');
        wp_enqueue_style('techplay-blocks-common-style');
    }

    public function enqueue_frontend_assets() {
        error_log('[Frontend Assets] enqueue_frontend_assets function called.');
        
        if (is_singular()) {
            error_log('[Frontend Assets] is_singular() is true.');
            $post = get_post();
            if (!$post) {
                error_log('[Frontend Assets] No post object found.');
                return;
            }

            $content = $post->post_content;
            $blocks = parse_blocks($content);
            
            if (empty($blocks)) {
                error_log('[Frontend Assets] No blocks found after parsing content.');
                return;
            }
            error_log('[Frontend Assets] Found ' . count($blocks) . ' top-level blocks after parsing.');

            // Log actual block names found at the top level
            $found_block_names = array();
            foreach ($blocks as $block) {
                if (isset($block['blockName'])) {
                    $found_block_names[] = $block['blockName'];
                }
            }
            error_log('[Frontend Assets] Top-level block names found: ' . implode(', ', $found_block_names));

            // 공통 스타일 로드
            wp_enqueue_style('techplay-blocks-common-style');
            wp_enqueue_style('dashicons');

            // --- Script Loading --- 

            $load_main_script = false;
            $has_image_compare = false;
            $has_download_button = false;
            $has_reference_links = false;
            $has_ai_gallery = false;

            // Simplified check (Top-level only for now)
            foreach ($blocks as $block) {
                if (isset($block['blockName'])) {
                    $block_name = trim($block['blockName']);
                    error_log("[DEBUG] Checking block: " . $block_name);
                    if ($block_name === 'techplay-blocks/image-compare') {
                        $has_image_compare = true;
                    }
                    if ($block_name === 'techplay-blocks/download-button') {
                        $has_download_button = true;
                    }
                    if ($block_name === 'techplay-blocks/reference-links') {
                        $has_reference_links = true;
                    }
                    if ($block_name === 'techplay-gutenberg-blocks/ai-image-gallery' || $block_name === 'techplay-blocks/ai-image-gallery') {
                        $has_ai_gallery = true;
                    }
                }
                // Note: Inner block check removed for simplification
            }
            
            error_log("[Frontend Assets] Block check results (SIMPLE CHECK, Corrected Names): ImageCompare={$has_image_compare}, DownloadButton={$has_download_button}, ReferenceLinks={$has_reference_links}, AIGallery={$has_ai_gallery}");

            // 1. AI Gallery Frontend Script
            if ($has_ai_gallery) {
                wp_enqueue_script('masonry');
                wp_enqueue_script('imagesloaded');
                wp_enqueue_script(
                    'techplay-ai-gallery-frontend-script',
                    plugins_url('build/ai-image-gallery-frontend.js', __FILE__),
                    array('jquery', 'masonry', 'imagesloaded'),
                    filemtime(plugin_dir_path(__FILE__) . 'build/ai-image-gallery-frontend.js'),
                    true
                );
                error_log('[Conditional Load] Enqueued AI Gallery Frontend Script.');
            }

            // 2. Check if other blocks needing the main script exist
            if ($has_image_compare || $has_download_button || $has_reference_links) {
                $load_main_script = true;
                error_log('[Frontend Assets] $load_main_script set to true.');
            } else {
                error_log('[Frontend Assets] $load_main_script remains false.');
            }
            
            // 3. Enqueue the main script bundle IF NEEDED by blocks other than AI Gallery
            // Note: If frontend logic for these blocks is self-contained and doesn't rely on index.js, 
            //       enqueuing index.js might not be necessary. Re-evaluate based on frontend.js contents.
            if ($load_main_script) {
                 wp_enqueue_script('techplay-blocks-editor');
                 error_log('[Conditional Load] Enqueued main script (techplay-blocks-editor) for frontend block(s).');
            } else {
                error_log('[Conditional Load] Main script (techplay-blocks-editor) NOT enqueued.');
            }

            // 4. Enqueue individual frontend scripts if their corresponding block exists
            if ($has_image_compare) {
                wp_enqueue_script(
                    'techplay-image-compare',
                    plugins_url('build/image-compare.js', __FILE__),
                    array('jquery'),
                    filemtime(plugin_dir_path(__FILE__) . 'build/image-compare.js'),
                    true
                );
                error_log('[Conditional Load] Enqueued Image Compare Frontend Script.');
            }
            
            // Enqueue download button script (Assuming build/download-button.js exists based on webpack config)
            if ($has_download_button) {
                 wp_enqueue_script(
                    'techplay-download-button',
                    plugins_url('build/download-button.js', __FILE__),
                    array('jquery'),
                    filemtime(plugin_dir_path(__FILE__) . 'build/download-button.js'),
                    true
                );
                 error_log('[Conditional Load] Enqueued Download Button Frontend Script.');
                 // Localize script AFTER enqueuing the specific script it needs
                 if (wp_script_is('techplay-download-button', 'registered') || wp_script_is('techplay-download-button', 'enqueued')) {
                     wp_localize_script('techplay-download-button', 'techplayBlocks', array( 
                         'ajaxUrl' => admin_url('admin-ajax.php'),
                         'nonce' => wp_create_nonce('techplay-blocks-nonce')
                     ));
                     error_log('[Localization] Localized data for download button attached to techplay-download-button.');
                 } else {
                     error_log('[Localization Error] Could not localize for download button. Handle techplay-download-button not ready?');
                 }
            }
            
            // Enqueue reference links script (Assuming build/reference-links.js exists based on webpack config)
            if ($has_reference_links) {
                wp_enqueue_script(
                    'techplay-reference-links',
                    plugins_url('build/reference-links.js', __FILE__),
                    array('jquery'),
                    filemtime(plugin_dir_path(__FILE__) . 'build/reference-links.js'),
                    true
                );
                 error_log('[Conditional Load] Enqueued Reference Links Frontend Script.');
            }
        } else {
            error_log('[Frontend Assets] is_singular() is false. Assets not loaded.');
        }
    }

    public function register_rest_routes() {
        register_rest_route('techplay-blocks/v1', '/fetch-site-info', array(
            'methods' => 'POST',
            'callback' => array($this, 'fetch_site_info'),
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
            'args' => array(
                'url' => array(
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'esc_url_raw'
                )
            )
        ));

        register_rest_route('techplay-blocks/v1', '/download-count', array(
            'methods' => 'POST',
            'callback' => array($this, 'update_download_count'),
            'permission_callback' => function() {
                return true;
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

        // Helper closure to ensure HTTPS
        $ensure_https = function($url) {
            if ($url && strpos($url, 'http://') === 0) {
                return str_replace('http://', 'https://', $url);
            }
            return $url;
        };

        $image1_url_raw = isset($attributes['image1']['url']) ? $attributes['image1']['url'] : '';
        $image2_url_raw = isset($attributes['image2']['url']) ? $attributes['image2']['url'] : '';
        
        $image1_url = $ensure_https($image1_url_raw);
        $image2_url = $ensure_https($image2_url_raw);

        // Add error log for debugging
        error_log("[Image Compare Render] Image 1 URL Raw: {$image1_url_raw}, Processed: {$image1_url}");
        error_log("[Image Compare Render] Image 2 URL Raw: {$image2_url_raw}, Processed: {$image2_url}");

        return sprintf(
            '<div class="wp-block-techplay-image-compare">
                <div class="image-compare-container">
                    <img src="%s" alt="%s" class="image-compare-before" />
                    <img src="%s" alt="%s" class="image-compare-after" />
                    <div class="image-compare-separator"></div>
                </div>
            </div>',
            esc_url($image1_url), // Use the processed URL
            esc_attr($attributes['image1']['alt'] ?? ''),
            esc_url($image2_url), // Use the processed URL
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
            'sslverify' => false,
            'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        ));

        if (is_wp_error($response)) {
            return new WP_Error('request_failed', '사이트 정보를 가져오는데 실패했습니다.', array('status' => 500));
        }

        $body = wp_remote_retrieve_body($response);
        
        if (empty($body)) {
            return new WP_Error('empty_response', '사이트로부터 응답을 받지 못했습니다.', array('status' => 500));
        }

        // HTML 파싱
        libxml_use_internal_errors(true);
        $doc = new DOMDocument();
        @$doc->loadHTML(mb_convert_encoding($body, 'HTML-ENTITIES', 'UTF-8'));
        libxml_clear_errors();

        // 타이틀 가져오기
        $title = '';
        $titleTags = $doc->getElementsByTagName('title');
        if ($titleTags->length > 0) {
            $title = trim($titleTags->item(0)->textContent);
        }

        // 파비콘 가져오기
        $favicon = '';
        $links = $doc->getElementsByTagName('link');
        foreach ($links as $link) {
            $rel = $link->getAttribute('rel');
            if (strpos($rel, 'icon') !== false || strpos($rel, 'shortcut icon') !== false) {
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

        // 파비콘이 없는 경우 기본값 설정
        if (empty($favicon)) {
            $favicon = $base_url . '/favicon.ico';
        }

        return array(
            'success' => true,
            'title' => $title ?: $url,
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
                        date_i18n(get_option('date_format')) => $data
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
                    date_i18n(get_option('date_format')) => $download_counts[$file_url]
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
        $today = date_i18n(get_option('date_format'));
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
        $mime_type = $this->get_mime_type($file_path);
        
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

    private function get_mime_type($file_path) {
        $file_ext = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));
        
        $mime_types = array(
            // 이미지
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            
            // 문서
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            
            // 텍스트
            'txt' => 'text/plain',
            'csv' => 'text/csv',
            'md' => 'text/markdown',
            
            // 압축
            'zip' => 'application/zip',
            'rar' => 'application/x-rar-compressed',
            '7z' => 'application/x-7z-compressed',
            
            // 오디오
            'mp3' => 'audio/mpeg',
            'wav' => 'audio/wav',
            'ogg' => 'audio/ogg',
            
            // 비디오
            'mp4' => 'video/mp4',
            'webm' => 'video/webm',
            'avi' => 'video/x-msvideo',
            
            // 기타
            'json' => 'application/json',
            'xml' => 'application/xml'
        );
        
        $mime_type = isset($mime_types[$file_ext]) ? $mime_types[$file_ext] : 'application/octet-stream';
        return $mime_type;
    }
}

/**
 * 이미지(PNG, JPG/JPEG 등)에서 SD 파라미터를 추출하여 메타데이터로 저장하는 함수 (exiftool 직접 호출)
 *
 * @param array $metadata      첨부파일 메타데이터 배열.
 * @param int   $attachment_id 첨부파일 ID.
 * @return array 수정된 메타데이터 배열.
 */
function techplay_extract_image_parameters($metadata, $attachment_id) {
    $file_path = get_attached_file($attachment_id);
    $parameters_text = '';
    error_log("[SD Param Extract - Exiftool] Processing attachment ID: {$attachment_id}, Path: {$file_path}");

    if (!$file_path || !is_file($file_path)) {
        error_log("[SD Param Extract - Exiftool] File path invalid or not a file for ID {$attachment_id}.");
        return $metadata;
    }

    // Check if exec function is available and not disabled for security reasons
    if (!function_exists('exec')) {
        error_log("[SD Param Extract - Exiftool] PHP function 'exec' is not available or disabled. Cannot use exiftool.");
        return $metadata;
    }

    try {
        // Construct the exiftool command
        // -j: Output in JSON format
        // -Parameters, -UserComment, -ImageDescription: Specify tags to extract (add more if needed)
        // -charset utf8: Specify UTF-8 for text output (helps with encoding)
        // escapeshellarg: IMPORTANT for security to prevent command injection
        $escaped_file_path = escapeshellarg($file_path);
        $command = "exiftool -j -Parameters -UserComment -ImageDescription -charset utf8 " . $escaped_file_path;
        error_log("[SD Param Extract - Exiftool] Executing command: {$command}");

        // Execute the command
        // Use shell_exec to capture the full output easily
        $output_json = shell_exec($command);
        
        if ($output_json === null) {
             error_log("[SD Param Extract - Exiftool] shell_exec failed for command. Check PHP error logs and permissions for exiftool.");
             return $metadata;
        }
        
        error_log("[SD Param Extract - Exiftool] Raw JSON output: " . substr($output_json, 0, 500) . "...");

        // exiftool outputs JSON within square brackets if successful
        if (strpos(trim($output_json), '[') === 0) {
            // Parse the JSON output
            $decoded_output = json_decode($output_json, true);

            // Check if JSON decoding was successful and expected structure exists
            if (json_last_error() === JSON_ERROR_NONE && isset($decoded_output[0]) && is_array($decoded_output[0])) {
                $exif_data = $decoded_output[0];
                
                // Find parameters, prioritizing the 'Parameters' tag (often used by A1111 PNG)
                if (!empty($exif_data['Parameters'])) {
                    $parameters_text = $exif_data['Parameters'];
                    error_log("[SD Param Extract - Exiftool] Found parameters in 'Parameters' tag for ID {$attachment_id}.");
                } elseif (!empty($exif_data['UserComment'])) {
                    // Fallback to UserComment (often used by A1111 JPG)
                    $parameters_text = $exif_data['UserComment'];
                    error_log("[SD Param Extract - Exiftool] Found parameters in 'UserComment' tag for ID {$attachment_id}.");
                } elseif (!empty($exif_data['ImageDescription'])) {
                    // Fallback to ImageDescription
                    $parameters_text = $exif_data['ImageDescription'];
                    error_log("[SD Param Extract - Exiftool] Found parameters in 'ImageDescription' tag for ID {$attachment_id}.");
                }

                if (empty($parameters_text)) {
                    error_log("[SD Param Extract - Exiftool] Could not find parameters in expected tags (Parameters, UserComment, ImageDescription) for ID {$attachment_id}.");
                    // Log all available tags for debugging if needed
                    // error_log("[SD Param Extract - Exiftool] All tags found: " . print_r(array_keys($exif_data), true));
                }
            } else {
                error_log("[SD Param Extract - Exiftool] Failed to decode JSON output or invalid structure for ID {$attachment_id}. JSON Error: " . json_last_error_msg());
            }
        } else {
            error_log("[SD Param Extract - Exiftool] Exiftool did not return valid JSON output (doesn't start with '['). Output: " . $output_json);
        }

    } catch (Exception $e) {
        error_log("[SD Param Extract - Exiftool] Exception during exiftool execution for ID {$attachment_id}: " . $e->getMessage());
        return $metadata;
    }

    // --- 메타데이터 저장 (기존 로직 유지) ---
    if (!empty($parameters_text) && is_string($parameters_text)) {
        error_log("[SD Param Extract - Exiftool] Attempting to save parameters for ID {$attachment_id}:");
        error_log(substr($parameters_text, 0, 200) . "..."); // 저장할 내용 일부 로그
        $existing_meta = get_post_meta($attachment_id, '_sd_parameters', true);
        if ($existing_meta !== $parameters_text) { 
            $updated = update_post_meta($attachment_id, '_sd_parameters', $parameters_text);
            if ($updated) {
                error_log("[SD Param Extract - Exiftool] Successfully saved/updated SD parameters for ID {$attachment_id}.");
            } else {
                error_log("[SD Param Extract - Exiftool] Failed to save/update SD parameters for ID {$attachment_id}.");
            }
        } else {
             error_log("[SD Param Extract - Exiftool] SD parameters for ID {$attachment_id} are already up to date.");
        }
    } else {
        error_log("[SD Param Extract - Exiftool] No SD parameters found or extracted to save for ID {$attachment_id}.");
    }

    return $metadata;
}

// 필터 훅 연결 유지
add_filter('wp_generate_attachment_metadata', 'techplay_extract_image_parameters', 10, 2);

new TechPlayGutenbergBlocks(); 