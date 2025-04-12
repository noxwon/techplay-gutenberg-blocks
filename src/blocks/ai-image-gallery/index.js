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
import './ai-image-gallery';

// SD 파라미터 파싱 함수
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
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const { columns, gap, images, useMasonry, showImageInfo, imageHeight } = attributes;
        const blockProps = useBlockProps({
            className: `wp-block-techplay-gutenberg-blocks-ai-image-gallery columns-${columns} gap-${gap} height-${imageHeight} ${useMasonry ? 'has-masonry' : ''}`
        });

        const onSelectImages = (newImages) => {
            const updatedImages = newImages.map(image => {
                let params = {};
                if (image.description) {
                    try {
                        params = parseSDParameters(image.description);
                    } catch (e) {
                        console.error('Error parsing SD parameters:', e);
                    }
                }

                return {
                    url: image.url,
                    alt: image.alt,
                    id: image.id,
                    ...params
                };
            });

            setAttributes({ images: updatedImages });
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('갤러리 설정', 'techplay-gutenberg-blocks')}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImages}
                                allowedTypes={['image']}
                                multiple
                                gallery
                                value={images.map(img => img.id)}
                                render={({ open }) => (
                                    <Button
                                        onClick={open}
                                        isPrimary
                                    >
                                        {images.length > 0 ? '이미지 편집' : '이미지 추가'}
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
                            label={__('간격', 'techplay-gutenberg-blocks')}
                            value={gap}
                            onChange={(value) => setAttributes({ gap: value })}
                            min={8}
                            max={48}
                        />
                        <RangeControl
                            label={__('이미지 높이', 'techplay-gutenberg-blocks')}
                            value={imageHeight}
                            onChange={(value) => setAttributes({ imageHeight: value })}
                            min={100}
                            max={600}
                        />
                        <ToggleControl
                            label={__('메이슨리 레이아웃', 'techplay-gutenberg-blocks')}
                            checked={useMasonry}
                            onChange={(value) => setAttributes({ useMasonry: value })}
                        />
                        <ToggleControl
                            label={__('이미지 정보 표시', 'techplay-gutenberg-blocks')}
                            checked={showImageInfo}
                            onChange={(value) => setAttributes({ showImageInfo: value })}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    {images.map((image, index) => (
                        <div key={index} className="gallery-item" data-id={image.id}>
                            <figure>
                                <img 
                                    src={image.url} 
                                    alt={image.alt || ''} 
                                    data-prompt={image.prompt || ''}
                                    data-parameters={image.parameters || ''}
                                />
                                {showImageInfo && (
                                    <div className="image-info-icon">
                                        <span className="dashicons dashicons-info"></span>
                                    </div>
                                )}
                            </figure>
                        </div>
                    ))}
                </div>
            </>
        );
    },

    // save 함수를 제거하고 render.php를 사용하도록 변경
    render: ({ attributes }) => {
        // render.php가 자동으로 호출됨
        return null;
    }
}); 