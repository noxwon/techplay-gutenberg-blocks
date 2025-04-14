import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MediaUpload, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';

registerBlockType('techplay-blocks/image-compare', {
    title: __('이미지 비교'),
    icon: 'images-alt2',
    category: 'common',
    keywords: ['이미지', '비교', 'compare'],
    attributes: {
        image1: {
            type: 'object',
            default: null
        },
        image2: {
            type: 'object',
            default: null
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const { image1, image2 } = attributes;

        // Helper function to ensure HTTPS
        const ensureHttps = (url) => {
            if (url && url.startsWith('http://')) {
                return url.replace('http://', 'https://');
            }
            return url;
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('이미지 설정')}>
                        <div className="image-compare-upload">
                            <p>첫 번째 이미지</p>
                            <MediaUpload
                                onSelect={(media) => {
                                    setAttributes({ image1: media });
                                }}
                                allowedTypes={['image']}
                                render={({ open }) => (
                                    <Button 
                                        onClick={open}
                                        isPrimary
                                    >
                                        {image1 ? '이미지 변경' : '이미지 선택'}
                                    </Button>
                                )}
                            />
                        </div>
                        <div className="image-compare-upload">
                            <p>두 번째 이미지</p>
                            <MediaUpload
                                onSelect={(media) => {
                                    setAttributes({ image2: media });
                                }}
                                allowedTypes={['image']}
                                render={({ open }) => (
                                    <Button 
                                        onClick={open}
                                        isPrimary
                                    >
                                        {image2 ? '이미지 변경' : '이미지 선택'}
                                    </Button>
                                )}
                            />
                        </div>
                    </PanelBody>
                </InspectorControls>
                <div className="wp-block-techplay-image-compare">
                    {image1 && image2 ? (
                        <div className="image-compare-container">
                            <img src={ensureHttps(image1.url)} alt={image1.alt || ''} />
                            <div className="image-compare-separator"></div>
                            <img src={ensureHttps(image2.url)} alt={image2.alt || ''} />
                        </div>
                    ) : (
                        <p>이미지를 선택해주세요.</p>
                    )}
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const { image1, image2 } = attributes;
        
        if (!image1 || !image2) {
            return null;
        }

        // Helper function to ensure HTTPS (can be defined outside or passed)
        const ensureHttps = (url) => {
            if (url && url.startsWith('http://')) {
                return url.replace('http://', 'https://');
            }
            return url;
        };

        return (
            <div className="wp-block-techplay-image-compare">
                <div className="image-compare-container">
                    <img src={ensureHttps(image1.url)} alt={image1.alt || ''} className="image-compare-before"/>
                    <img src={ensureHttps(image2.url)} alt={image2.alt || ''} className="image-compare-after"/>
                    <div className="image-compare-separator"></div>
                </div>
            </div>
        );
    }
}); 
