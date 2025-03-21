import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MediaUpload, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, SelectControl, ButtonGroup } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { ColorPicker } from '@wordpress/components';
import './editor.scss';

registerBlockType('techplay-blocks/download-button', {
    title: __('다운로드 버튼'),
    icon: 'download',
    category: 'common',
    attributes: {
        fileURL: {
            type: 'string',
            default: ''
        },
        buttonText: {
            type: 'string',
            default: '다운로드'
        },
        buttonStyle: {
            type: 'string',
            default: 'default'
        },
        buttonIcon: {
            type: 'string',
            default: 'download'
        },
        fileName: {
            type: 'string',
            default: ''
        },
        alignment: {
            type: 'string',
            default: 'left'
        },
        size: {
            type: 'string',
            default: 'size-default'
        },
        backgroundColor: {
            type: 'string',
            default: '#007bff'
        },
        textColor: {
            type: 'string',
            default: '#ffffff'
        },
        hoverBackgroundColor: {
            type: 'string',
            default: '#0056b3'
        },
        hoverTextColor: {
            type: 'string',
            default: '#ffffff'
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const {
            fileURL,
            buttonText,
            buttonStyle,
            buttonIcon,
            fileName,
            alignment,
            size,
            backgroundColor,
            textColor,
            hoverBackgroundColor,
            hoverTextColor
        } = attributes;

        const blockProps = useBlockProps({
            className: `wp-block-techplay-download-button style-${buttonStyle} ${size}`,
            style: {
                '--button-bg-color': backgroundColor || '#007bff',
                '--button-text-color': textColor || '#ffffff',
                '--button-hover-bg-color': hoverBackgroundColor || '#0056b3',
                '--button-hover-text-color': hoverTextColor || '#ffffff'
            }
        });

        // 정렬 스타일을 직접 적용
        const alignmentStyle = {
            display: 'flex',
            justifyContent: alignment === 'left' ? 'flex-start' : 
                          alignment === 'center' ? 'center' : 'flex-end'
        };

        const onSelectFile = (media) => {
            if (media && media.url) {
                setAttributes({
                    fileURL: media.url,
                    fileName: media.title || media.filename
                });
            }
        };

        const buttonStyles = [
            { label: '기본', value: 'default' },
            { label: '강조', value: 'accent' },
            { label: '라운드', value: 'round' }
        ];

        const buttonIcons = [
            { label: '다운로드', value: 'download' },
            { label: '문서', value: 'document' },
            { label: '파일', value: 'file' },
            { label: 'PDF', value: 'pdf' },
            { label: '압축파일', value: 'archive' }
        ];

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('다운로드 버튼 설정', 'techplay-gutenberg-blocks')}>
                        <div className="components-base-control">
                            <label className="components-base-control__label">
                                {__('파일 URL', 'techplay-gutenberg-blocks')}
                            </label>
                            <div className="components-base-control__field">
                                <input
                                    type="text"
                                    value={fileURL || ''}
                                    onChange={(e) => setAttributes({ fileURL: e.target.value })}
                                    className="components-text-control__input"
                                />
                                <MediaUpload
                                    onSelect={onSelectFile}
                                    allowedTypes={['application']}
                                    render={({ open }) => (
                                        <Button
                                            isSecondary
                                            onClick={open}
                                            style={{ marginTop: '8px' }}
                                        >
                                            {__('파일 선택', 'techplay-gutenberg-blocks')}
                                        </Button>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="components-base-control">
                            <label className="components-base-control__label">
                                {__('버튼 텍스트', 'techplay-gutenberg-blocks')}
                            </label>
                            <div className="components-base-control__field">
                                <input
                                    type="text"
                                    value={buttonText || ''}
                                    onChange={(e) => setAttributes({ buttonText: e.target.value })}
                                    className="components-text-control__input"
                                />
                            </div>
                        </div>

                        <SelectControl
                            label={__('아이콘', 'techplay-gutenberg-blocks')}
                            value={buttonIcon}
                            options={buttonIcons}
                            onChange={(value) => setAttributes({ buttonIcon: value })}
                        />

                        <SelectControl
                            label={__('스타일', 'techplay-gutenberg-blocks')}
                            value={buttonStyle}
                            options={buttonStyles}
                            onChange={(value) => setAttributes({ buttonStyle: value })}
                        />

                        <SelectControl
                            label={__('정렬', 'techplay-gutenberg-blocks')}
                            value={alignment}
                            options={[
                                { label: __('좌측', 'techplay-gutenberg-blocks'), value: 'left' },
                                { label: __('중앙', 'techplay-gutenberg-blocks'), value: 'center' },
                                { label: __('우측', 'techplay-gutenberg-blocks'), value: 'right' }
                            ]}
                            onChange={(value) => setAttributes({ alignment: value })}
                        />

                        <SelectControl
                            label={__('크기', 'techplay-gutenberg-blocks')}
                            value={size}
                            options={[
                                { label: __('매우 작음', 'techplay-gutenberg-blocks'), value: 'size-xs' },
                                { label: __('작음', 'techplay-gutenberg-blocks'), value: 'size-sm' },
                                { label: __('기본', 'techplay-gutenberg-blocks'), value: 'size-default' },
                                { label: __('크게', 'techplay-gutenberg-blocks'), value: 'size-lg' },
                                { label: __('매우 크게', 'techplay-gutenberg-blocks'), value: 'size-xlg' }
                            ]}
                            onChange={(value) => setAttributes({ size: value })}
                        />

                        <div className="button-style-controls">
                            <div className="style-control">
                                <label>배경색</label>
                                <ColorPicker
                                    color={backgroundColor}
                                    onChange={(color) => setAttributes({ backgroundColor: color })}
                                />
                            </div>
                            <div className="style-control">
                                <label>텍스트 색상</label>
                                <ColorPicker
                                    color={textColor}
                                    onChange={(color) => setAttributes({ textColor: color })}
                                />
                            </div>
                            <div className="style-control">
                                <label>호버 배경색</label>
                                <ColorPicker
                                    color={hoverBackgroundColor}
                                    onChange={(color) => setAttributes({ hoverBackgroundColor: color })}
                                />
                            </div>
                            <div className="style-control">
                                <label>호버 텍스트</label>
                                <ColorPicker
                                    color={hoverTextColor}
                                    onChange={(color) => setAttributes({ hoverTextColor: color })}
                                />
                            </div>
                        </div>
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps} style={{ ...blockProps.style, ...alignmentStyle }}>
                    <button
                        className="download-button"
                        data-file={fileURL}
                        data-filename={fileName}
                        data-icon={buttonIcon}
                    >
                        <span className="button-icon">
                            {buttonIcon && <span className={`icon-${buttonIcon}`}></span>}
                        </span>
                        <span className="button-text">{buttonText || __('다운로드', 'techplay-gutenberg-blocks')}</span>
                    </button>
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const {
            fileURL,
            buttonText,
            buttonStyle,
            buttonIcon,
            fileName,
            size,
            backgroundColor,
            textColor,
            hoverBackgroundColor,
            hoverTextColor,
            alignment
        } = attributes;

        const blockClassName = [
            'wp-block-techplay-download-button',
            `style-${buttonStyle}`,
            size
        ].filter(Boolean).join(' ');

        // 정렬 스타일 정의
        const alignmentStyle = {
            display: 'flex',
            justifyContent: alignment === 'left' ? 'flex-start' : 
                          alignment === 'center' ? 'center' : 'flex-end'
        };

        return (
            <div 
                className={blockClassName}
                style={{
                    '--button-bg-color': backgroundColor || '#007bff',
                    '--button-text-color': textColor || '#ffffff',
                    '--button-hover-bg-color': hoverBackgroundColor || '#0056b3',
                    '--button-hover-text-color': hoverTextColor || '#ffffff',
                    ...alignmentStyle
                }}
            >
                <button
                    className="download-button"
                    data-file={fileURL}
                    data-filename={fileName}
                    data-icon={buttonIcon}
                >
                    <span className="button-icon">
                        {buttonIcon && <span className={`icon-${buttonIcon}`}></span>}
                    </span>
                    <span className="button-text">{buttonText || __('다운로드', 'techplay-gutenberg-blocks')}</span>
                </button>
            </div>
        );
    }
});