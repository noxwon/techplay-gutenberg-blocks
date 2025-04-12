import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';

registerBlockType('techplay-gutenberg-blocks/ai-image-gallery', {
    title: 'AI 이미지 갤러리',
    icon: 'format-gallery',
    category: 'media',
    supports: {
        align: ['wide', 'full']
    },
    attributes: {
        columns: {
            type: 'number',
            default: 3
        },
        gap: {
            type: 'number',
            default: 16
        },
        images: {
            type: 'array',
            default: []
        },
        lightboxEnabled: {
            type: 'boolean',
            default: true
        },
        masonryEnabled: {
            type: 'boolean',
            default: true
        },
        imageFit: {
            type: 'string',
            default: 'cover'
        },
        imageHeight: {
            type: 'number',
            default: 300
        },
        showImageInfo: {
            type: 'boolean',
            default: true,
        },
    },

    edit: function(props) {
        const { attributes, setAttributes } = props;
        const { columns, gap, images, lightboxEnabled, masonryEnabled, imageFit, imageHeight, showImageInfo } = attributes;
        const galleryRef = useRef(null);

        const blockProps = useBlockProps({
            className: `wp-block-techplay-gutenberg-blocks-ai-image-gallery${masonryEnabled ? ' has-masonry' : ''} columns-${columns} gap-${gap} image-height-${imageHeight} image-fit-${imageFit}`
        });

        useEffect(() => {
            if (galleryRef.current && images.length > 0) {
                const imgs = galleryRef.current.querySelectorAll('img');
                imgs.forEach(img => {
                    if (!img.complete) {
                        img.addEventListener('load', () => {
                            // 이미지가 로드되면 레이아웃 업데이트
                            if (masonryEnabled) {
                                img.style.height = 'auto';
                            }
                        });
                    } else if (masonryEnabled) {
                        img.style.height = 'auto';
                    }
                });
            }
        }, [images, masonryEnabled]);

        const onSelectImages = (selectedImages) => {
            const newImages = selectedImages.map(image => ({
                url: image.url,
                prompt: image.alt || '',
                parameters: image.description || '',
                id: image.id,
                width: image.width,
                height: image.height
            }));
            setAttributes({ images: newImages });
        };

        const removeImage = (index) => {
            const newImages = [...images];
            newImages.splice(index, 1);
            setAttributes({ images: newImages });
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title="레이아웃 설정">
                        <RangeControl
                            label="열 수"
                            value={columns}
                            onChange={(value) => setAttributes({ columns: value })}
                            min={1}
                            max={8}
                        />
                        <RangeControl
                            label="간격"
                            value={gap}
                            onChange={(value) => setAttributes({ gap: value })}
                            min={0}
                            max={50}
                        />
                        <ToggleControl
                            label="Masonry 레이아웃"
                            help={masonryEnabled ? '이미지 높이를 자동으로 조정합니다.' : '모든 이미지를 동일한 높이로 표시합니다.'}
                            checked={masonryEnabled}
                            onChange={(value) => setAttributes({ masonryEnabled: value })}
                        />
                        {!masonryEnabled && (
                            <>
                                <RangeControl
                                    label="이미지 높이"
                                    value={imageHeight}
                                    onChange={(value) => setAttributes({ imageHeight: value })}
                                    min={100}
                                    max={1000}
                                    step={10}
                                />
                                <SelectControl
                                    label="이미지 맞춤"
                                    value={imageFit}
                                    options={[
                                        { label: '꽉 채우기', value: 'cover' },
                                        { label: '원본 비율', value: 'contain' }
                                    ]}
                                    onChange={(value) => setAttributes({ imageFit: value })}
                                />
                            </>
                        )}
                        <ToggleControl
                            label="이미지 정보 아이콘 표시"
                            checked={showImageInfo}
                            onChange={(value) => setAttributes({ showImageInfo: value })}
                        />
                    </PanelBody>
                    <PanelBody title="라이트박스">
                        <ToggleControl
                            label="라이트박스 활성화"
                            checked={lightboxEnabled}
                            onChange={(value) => setAttributes({ lightboxEnabled: value })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps} ref={galleryRef}>
                    {images.map((image, index) => (
                        <div key={index} className="gallery-item" data-id={image.id}>
                            <figure>
                                <img 
                                    src={image.url} 
                                    alt={image.prompt || ''} 
                                    data-prompt={image.prompt || ''}
                                    data-parameters={image.parameters || ''}
                                />
                                <div className="image-info-icon">
                                    <span className="dashicons dashicons-info"></span>
                                </div>
                                <Button 
                                    isDestructive
                                    onClick={() => removeImage(index)}
                                    className="remove-image-button"
                                >
                                    삭제
                                </Button>
                            </figure>
                        </div>
                    ))}
                </div>

                <MediaUploadCheck>
                    <MediaUpload
                        onSelect={onSelectImages}
                        allowedTypes={['image']}
                        multiple={true}
                        gallery={true}
                        value={images.map(img => img.id)}
                        render={({ open }) => (
                            <Button
                                isPrimary
                                onClick={open}
                                style={{ marginTop: '20px' }}
                            >
                                이미지 추가
                            </Button>
                        )}
                    />
                </MediaUploadCheck>
            </>
        );
    },

    save: function(props) {
        // Dynamic block, rendering is handled by PHP.
        return null;
    }
}); 