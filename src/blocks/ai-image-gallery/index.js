/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, Button, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import './editor.scss';
import './style.scss';
// import './ai-image-gallery'; // Consider if this import is necessary in edit context

// SD 파라미터 파싱 함수 (Keep if needed for edit view, otherwise remove)
function parseSDParameters(description) {
    const params = {};
    const regex = /(\w+):\s*([^,\n]+)/g;
    let match;

    while ((match = regex.exec(description)) !== null) {
        params[match[1]] = match[2].trim();
    }

    return params;
}

registerBlockType('techplay-gutenberg-blocks/ai-image-gallery', {
    title: __('AI 이미지 갤러리', 'techplay-gutenberg-blocks'),
    icon: 'format-gallery',
    category: 'common',
    attributes: {
        images: {
            type: 'array',
            default: []
        },
        columns: {
            type: 'number',
            default: 3
        },
        gap: {
            type: 'number',
            default: 16
        },
        imageHeight: {
            type: 'number',
            default: 300
        },
        useMasonry: {
            type: 'boolean',
            default: false
        },
        showImageInfo: {
            type: 'boolean',
            default: true
        },
        lightboxEnabled: {
             type: 'boolean',
             default: true
        }
    },

    edit: ({ attributes, setAttributes, isSelected }) => {
        const { columns, gap, images, useMasonry, showImageInfo, imageHeight, lightboxEnabled } = attributes;
        const blockProps = useBlockProps({
            className: [
                'wp-block-techplay-gutenberg-blocks-ai-image-gallery',
                `columns-${columns}`,
                `gap-${gap}`,
                useMasonry ? 'has-masonry-layout' : '',
                lightboxEnabled ? 'has-lightbox' : ''
            ].filter(Boolean).join(' '),
            style: {
                '--columns': columns,
                '--gap': `${gap}px`
            }
        });

        const onSelectImages = (newImages) => {
            const updatedImages = newImages.map(image => ({
                    url: image.url,
                alt: image.alt || image.caption || '',
                    id: image.id,
                width: image.width,
                height: image.height
            }));
            setAttributes({ images: updatedImages });
        };

        const removeImage = (indexToRemove) => {
            const newImages = images.filter((_, index) => index !== indexToRemove);
            setAttributes({ images: newImages });
        };

        console.log("[Edit - Full Code] Function called. isSelected:", isSelected);

        return (
            <>
                { isSelected && (
                    <InspectorControls key="inspector-full">
                    <PanelBody title={__('갤러리 설정', 'techplay-gutenberg-blocks')}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImages}
                                allowedTypes={['image']}
                                multiple
                                gallery
                                value={images.map(img => img.id)}
                                render={({ open }) => (
                                        <Button onClick={open} isPrimary>
                                            {images.length > 0 ? __('이미지 편집', 'techplay-gutenberg-blocks') : __('이미지 추가', 'techplay-gutenberg-blocks')}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                        <RangeControl
                            label={__('열 수', 'techplay-gutenberg-blocks')}
                                value={Number(columns)}
                                onChange={(value) => setAttributes({ columns: Number(value) })}
                            min={1}
                            max={6}
                        />
                        <RangeControl
                                label={__('간격 (px)', 'techplay-gutenberg-blocks')}
                            value={gap}
                            onChange={(value) => setAttributes({ gap: value })}
                                min={0}
                            max={48}
                        />
                            <ToggleControl
                                label={__('메이슨리 레이아웃', 'techplay-gutenberg-blocks')}
                                checked={useMasonry}
                                onChange={(value) => setAttributes({ useMasonry: value })}
                            />
                             <ToggleControl
                                label={__('라이트박스 활성화', 'techplay-gutenberg-blocks')}
                                checked={lightboxEnabled}
                                onChange={(value) => setAttributes({ lightboxEnabled: value })}
                            />
                            <ToggleControl
                                label={__('이미지 정보 표시 (프론트엔드)', 'techplay-gutenberg-blocks')}
                                checked={showImageInfo}
                                onChange={(value) => setAttributes({ showImageInfo: value })}
                            />
                    </PanelBody>
                </InspectorControls>
                )}
                <div {...blockProps}>
                    {images.map((image, index) => (
                        <div key={image.id || index} className="gallery-item" data-id={image.id}>
                            <figure>
                                <img 
                                    src={image.url} 
                                    alt={image.alt || ''} 
                                />
                                { isSelected && ( 
                                    <Button 
                                        className="remove-image-button"
                                        icon="no-alt"
                                        label={__('Remove image', 'techplay-gutenberg-blocks')}
                                        onClick={() => removeImage(index)}
                                    />
                                )}
                            </figure>
                        </div>
                    ))}
                    { images.length === 0 && isSelected && (
                         <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImages}
                                allowedTypes={['image']}
                                multiple
                                gallery
                                render={({ open }) => (
                                     <Button className="add-images-placeholder" onClick={open} isSecondary>
                                         {__('갤러리에 이미지 추가', 'techplay-gutenberg-blocks')}
                                     </Button>
                                )}
                            />
                        </MediaUploadCheck>
                    )}
                </div>
            </>
        );
    },

    save: () => null, // Use dynamic rendering (render.php)
}); 