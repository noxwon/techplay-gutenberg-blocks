/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, Button, ToggleControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import './editor.scss';
import './style.scss';

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
        imageFit: {
            type: 'string',
            default: 'cover'
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
        
        // CSS 클래스 생성 - 더 명시적이고 일관된 방식으로
        const blockClasses = [
            'wp-block-techplay-gutenberg-blocks-ai-image-gallery',
            `columns-${columns}`, // 항상 클래스로 열 수 전달
            useMasonry ? 'has-masonry-layout' : '',
            lightboxEnabled ? 'has-lightbox' : '',
            showImageInfo ? 'show-image-info' : '',
            !useMasonry ? `image-height-${imageHeight}` : '', // 고정 높이 클래스 추가
            `image-fit-${attributes.imageFit || 'cover'}` // 이미지 맞춤 클래스 추가
        ].filter(Boolean).join(' ');
        
        // 더 완전한 CSS 변수 세트
        const blockStyles = {
            '--columns': columns,
            '--gap': `${gap}px`,
            '--image-height': `${imageHeight}px` // 항상 이미지 높이 변수 포함
        };
        
        const blockProps = useBlockProps({
            className: blockClasses,
            style: blockStyles
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
                                label={__('메이슨리 레이아웃 (index.js)', 'techplay-gutenberg-blocks')}
                                checked={useMasonry}
                                onChange={(value) => {
                                    // 속성 업데이트
                                    setAttributes({ useMasonry: value });
                                }}
                            />
                            
                            {/* Masonry 디버그 정보 표시 */}
                            <div style={{ 
                                marginTop: '10px', 
                                marginBottom: '10px', 
                                padding: '10px', 
                                backgroundColor: useMasonry ? '#e6f7ff' : '#fff1f0',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}>
                                <p><strong>INDEX.JS - Masonry 디버그 정보:</strong></p>
                                <p>현재 useMasonry 값: {String(useMasonry)}</p>
                                <p>타입: {typeof useMasonry}</p>
                                <p>현재 시간: {new Date().toLocaleTimeString()}</p>
                            </div>
                             <ToggleControl
                                label={__('라이트박스 활성화', 'techplay-gutenberg-blocks')}
                                checked={lightboxEnabled}
                                onChange={(value) => setAttributes({ lightboxEnabled: value })}
                            />

                            {/* Masonry가 비활성화된 경우에만 이미지 높이와 맞춤 설정 표시 */}
                            {!useMasonry && (
                                <>
                                    <div style={{ 
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                        padding: '8px',
                                        backgroundColor: '#e6ffed',
                                        borderRadius: '4px'
                                    }}>
                                        <p><strong>Masonry가 꺼져 있어 추가 설정이 활성화되었습니다.</strong></p>
                                    </div>
                                    
                                    <RangeControl
                                        label={__('이미지 높이 (px)', 'techplay-gutenberg-blocks')}
                                        value={imageHeight}
                                        onChange={(value) => setAttributes({ imageHeight: value })}
                                        min={100}
                                        max={1000}
                                        step={10}
                                    />
                                    
                                    {/* 이미지 맞춤 방식 선택 (커버 또는 컨테인) */}
                                    <SelectControl
                                        label={__('이미지 맞춤', 'techplay-gutenberg-blocks')}
                                        value={attributes.imageFit || 'cover'} // 속성에서 값 가져오기
                                        options={[
                                            { label: __('꽉 채우기', 'techplay-gutenberg-blocks'), value: 'cover' },
                                            { label: __('원본 비율', 'techplay-gutenberg-blocks'), value: 'contain' }
                                        ]}
                                        onChange={(value) => {
                                            // imageFit 속성 업데이트
                                            setAttributes({ imageFit: value });
                                        }}
                                    />
                                </>
                             )}

                            <ToggleControl
                                label={__('이미지 정보 표시', 'techplay-gutenberg-blocks')}
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