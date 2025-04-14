<?php
/**
 * AI 이미지 갤러리 블록의 프론트엔드 렌더링을 위한 템플릿
 *
 * @package Techplay_Gutenberg_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// --- DEBUGGING START ---
error_log("[AI Gallery Render] Starting render.php");

// Ensure attributes are available
if (!isset($attributes)) {
    error_log("[AI Gallery Render] Error: \$attributes variable not set.");
    return ''; // Or handle error
}
error_log("[AI Gallery Render] Attributes received: " . print_r($attributes, true));

// Default attribute values
$defaults = array(
    'images' => array(),
    'columns' => 3,
    'gap' => 16,
    'imageHeight' => 300,
    'imageFit' => 'cover',
    'useMasonry' => false,
    'lightboxEnabled' => true, 
    'showImageInfo' => true    
);

// Merge defaults with provided attributes
$attributes = wp_parse_args($attributes, $defaults);
error_log("[AI Gallery Render] Attributes after merging defaults: " . print_r($attributes, true));

// Exit early if no images
if (empty($attributes['images'])) {
    error_log("[AI Gallery Render] No images found. Exiting.");
    return '';
}
error_log("[AI Gallery Render] Found " . count($attributes['images']) . " images.");

// Prepare wrapper attributes
$wrapper_classes = array(
    'wp-block-techplay-gutenberg-blocks-ai-image-gallery', // 블록 기본 클래스 추가
    'columns-' . intval($attributes['columns']),
    'image-fit-' . esc_attr($attributes['imageFit']),
);

// 명시적인 클래스 할당
if (isset($attributes['useMasonry']) && $attributes['useMasonry'] === true) {
    $wrapper_classes[] = 'has-masonry-layout';
    error_log("[AI Gallery Render] useMasonry is TRUE, adding has-masonry-layout class");
} else {
    $wrapper_classes[] = 'image-height-' . intval($attributes['imageHeight']);
    error_log("[AI Gallery Render] useMasonry is FALSE, adding image-height-" . intval($attributes['imageHeight']) . " class");
}

if ($attributes['lightboxEnabled']) {
    $wrapper_classes[] = 'has-lightbox';
}

if ($attributes['showImageInfo']) {
    $wrapper_classes[] = 'show-image-info';
}

// 명시적이고 완전한 CSS 변수 세트
$inline_styles = sprintf(
    '--columns: %d; --gap: %dpx; --image-height: %dpx;',
    intval($attributes['columns']),
    intval($attributes['gap']),
    intval($attributes['imageHeight'])
);

$wrapper_attributes_string = get_block_wrapper_attributes(array(
    'class' => implode(' ', $wrapper_classes),
    'style' => $inline_styles
));
error_log("[AI Gallery Render] Wrapper attributes string: " . $wrapper_attributes_string);

?>

<div <?php echo $wrapper_attributes_string; ?>>
	<?php 
	error_log("[AI Gallery Render] Starting image loop...");
	foreach ($attributes['images'] as $index => $image) :
		error_log("[AI Gallery Render] Processing image index: {$index}");
		// Ensure image data is valid
		$image_url = isset($image['url']) ? esc_url(str_replace('http://', 'https://', $image['url'])) : '';
		$image_id = isset($image['id']) ? esc_attr($image['id']) : '';
		$image_prompt = isset($image['prompt']) ? esc_attr($image['prompt']) : '';
		// Get parameters from post meta
		$image_params_raw = '';
		if (!empty($image_id)) {
			$image_params_raw = get_post_meta(intval($image_id), '_sd_parameters', true);
		}
		$image_params_esc = esc_attr($image_params_raw);
		$image_width = isset($image['width']) && is_numeric($image['width']) ? intval($image['width']) : null;
		$image_height = isset($image['height']) && is_numeric($image['height']) ? intval($image['height']) : null;

		// Get 'large' size image URL if lightbox is enabled
		$large_image_url = '';
		if ($attributes['lightboxEnabled'] && !empty($image_id)) {
			$large_image_data = wp_get_attachment_image_src(intval($image_id), 'large', false);
			if ($large_image_data) {
				$large_image_url = esc_url(str_replace('http://', 'https://', $large_image_data[0]));
				error_log("[AI Gallery Render] Image index {$index}: Found large image URL: {$large_image_url}");
			} else {
				error_log("[AI Gallery Render] Image index {$index}: Could not find large image URL, falling back to original: {$image_url}");
			}
		}
		// Use original URL as fallback if large URL not found or lightbox disabled
		$lightbox_src = !empty($large_image_url) ? $large_image_url : $image_url;

		if (empty($image_url)) {
			error_log("[AI Gallery Render] Image index {$index} skipped: No URL.");
			continue; // Skip if no URL
		}
		error_log("[AI Gallery Render] Image index {$index} Thumb URL: {$image_url}");
		error_log("[AI Gallery Render] Image index {$index} Lightbox URL: {$lightbox_src}");
		// Log the parameters before assigning to data attribute
		error_log("[AI Gallery Render] Image index {$index} Parameters RAW (from meta): " . $image_params_raw);
		error_log("[AI Gallery Render] Image index {$index} Parameters Escaped: " . $image_params_esc); // Log escaped value
		?>
		<div class="gallery-item" data-id="<?php echo $image_id; ?>">
			<figure>
				<img src="<?php echo $image_url; ?>"
					 data-large-src="<?php echo $lightbox_src; ?>"
					 alt="<?php echo $image_prompt; ?>"
					 data-prompt="<?php echo $image_prompt; ?>"
					 data-parameters="<?php echo $image_params_esc; ?>"
					 decoding="async"
					 loading="lazy">
				<?php if ($attributes['showImageInfo']): ?>
				<button class="image-info-icon" title="Show image info">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
					  <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
					</svg>
				</button>
				<?php endif; ?>
			</figure>
            
            <?php // Ensure hover action buttons HTML is present ?>
            <div class="image-hover-actions">
                <button class="copy-url-button" title="Copy Image URL">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.871a.75.75 0 0 0 .977-1.138a2.5 2.5 0 0 1-.142-3.665l3-3Z"></path>
                      <path d="M8.603 17.47a4 4 0 0 1-5.656-5.656l3-3a4 4 0 0 1 5.871.225a.75.75 0 0 1-1.138.977a2.5 2.5 0 0 0-3.665-.142l-3 3a2.5 2.5 0 0 0 3.536 3.536l1.225-1.224a.75.75 0 0 1 1.061 1.06l-1.224 1.224Z"></path>
                    </svg>
                </button>
                <button class="download-image-button" title="Download Image">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path fill-rule="evenodd" d="M10 3.75a.75.75 0 0 1 .75.75v6.19l1.97-1.97a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l1.97 1.97V4.5a.75.75 0 0 1 .75-.75Zm-4.25 9.75a.75.75 0 0 1 0 1.5h8.5a.75.75 0 0 1 0-1.5h-8.5Z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
		</div>
	<?php endforeach; 
	error_log("[AI Gallery Render] Finished image loop.");
	?>
</div>
<?php
error_log("[AI Gallery Render] Finished render.php successfully.");
// --- DEBUGGING END --- 