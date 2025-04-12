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
    'masonryEnabled' => false,
    'lightboxEnabled' => true, // Assuming lightbox is an attribute
    'showImageInfo' => true    // Assuming show info is an attribute
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
    // 'wp-block-techplay-gutenberg-blocks-ai-image-gallery', // Removed: get_block_wrapper_attributes handles this
    'columns-' . intval($attributes['columns']),
    'gap-' . intval($attributes['gap']),
    'image-fit-' . esc_attr($attributes['imageFit']),
);
if ($attributes['masonryEnabled']) {
    $wrapper_classes[] = 'has-masonry';
} else {
    // Only add image height class if not using masonry
    $wrapper_classes[] = 'image-height-' . intval($attributes['imageHeight']);
}
if ($attributes['lightboxEnabled']) {
    $wrapper_classes[] = 'has-lightbox'; // Add class if lightbox is enabled
}

$wrapper_attributes_string = get_block_wrapper_attributes(array('class' => implode(' ', $wrapper_classes)));
error_log("[AI Gallery Render] Wrapper attributes string: " . $wrapper_attributes_string);

?>

<div <?php echo $wrapper_attributes_string; ?>>
	<?php 
	error_log("[AI Gallery Render] Starting image loop...");
	foreach ($attributes['images'] as $index => $image) :
		error_log("[AI Gallery Render] Processing image index: {$index}");
		// Ensure image data is valid
		$image_url = isset($image['url']) ? esc_url($image['url']) : '';
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

		if (empty($image_url)) {
			error_log("[AI Gallery Render] Image index {$index} skipped: No URL.");
			continue; // Skip if no URL
		}
		error_log("[AI Gallery Render] Image index {$index} URL: {$image_url}");
		// Log the parameters before assigning to data attribute
		error_log("[AI Gallery Render] Image index {$index} Parameters RAW (from meta): " . $image_params_raw);
		error_log("[AI Gallery Render] Image index {$index} Parameters Escaped: " . $image_params_esc); // Log escaped value
		?>
		<div class="gallery-item" data-id="<?php echo $image_id; ?>">
			<figure>
				<img src="<?php echo $image_url; ?>"
					 alt="<?php echo $image_prompt; ?>"
					 data-prompt="<?php echo $image_prompt; ?>"
					 data-parameters="<?php echo $image_params_esc; ?>"
					 <?php 
					 // Apply aspect-ratio style ONLY for masonry and if dimensions are valid
					 if ($attributes['masonryEnabled'] && $image_width && $image_height && $image_height > 0) {
						 $aspect_ratio_style = sprintf('style="aspect-ratio: %d/%d;"', $image_width, $image_height);
						 echo $aspect_ratio_style;
						 error_log("[AI Gallery Render] Image index {$index}: Applied aspect-ratio style: {$aspect_ratio_style}");
					 }
					 ?>
					 decoding="async"
					 loading="lazy">
				<?php if ($attributes['showImageInfo']): // Conditionally show info icon ?>
				<div class="image-info-icon">
					<span class="dashicons dashicons-info"></span>
				</div>
				<?php endif; ?>
			</figure>
		</div>
	<?php endforeach; 
	error_log("[AI Gallery Render] Finished image loop.");
	?>
</div>
<?php
error_log("[AI Gallery Render] Finished render.php successfully.");
// --- DEBUGGING END --- 