import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, SelectControl, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

registerBlockType('techplay-blocks/reference-links', {
    title: __('레퍼런스 링크'),
    icon: 'admin-links',
    category: 'common',
    keywords: ['레퍼런스', '링크', 'reference'],
    attributes: {
        links: {
            type: 'array',
            default: []
        },
        showIcon: {
            type: 'boolean',
            default: true
        },
        fontSize: {
            type: 'string',
            default: 'inherit'
        },
        fontSizeUnit: {
            type: 'string',
            default: 'px'
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const { links, showIcon, fontSize, fontSizeUnit } = attributes;
        const [isLoading, setIsLoading] = useState(false);
        const blockProps = useBlockProps({
            style: {
                '--reference-link-font-size': fontSize === 'inherit' ? 'inherit' : `${fontSize}${fontSizeUnit}`,
                '--reference-link-icon-size': fontSize === 'inherit' ? '1em' : `${fontSize}${fontSizeUnit}`
            }
        });

        const addLink = () => {
            setAttributes({
                links: [...links, { url: '', title: '', favicon: '' }]
            });
        };

        const updateLink = async (index, field, value) => {
            const newLinks = [...links];
            newLinks[index] = { ...newLinks[index], [field]: value };

            // URL이 변경되었고, 유효한 URL인 경우 타이틀과 파비콘을 가져옵니다
            if (field === 'url' && value && isValidUrl(value)) {
                setIsLoading(true);
                try {
                    const response = await apiFetch({
                        path: '/techplay-blocks/v1/fetch-site-info',
                        method: 'POST',
                        data: { url: value }
                    }).catch(error => {
                        console.error('API 호출 실패:', error);
                        throw error;
                    });

                    if (response && response.success) {
                        newLinks[index] = {
                            ...newLinks[index],
                            title: response.title || value,
                            favicon: response.favicon || ''
                        };
                    } else {
                        console.error('API 응답 실패:', response);
                    }
                } catch (error) {
                    console.error('사이트 정보 가져오기 실패:', error);
                } finally {
                    setIsLoading(false);
                }
            }

            setAttributes({ links: newLinks });
        };

        const removeLink = (index) => {
            const newLinks = links.filter((_, i) => i !== index);
            setAttributes({ links: newLinks });
        };

        const isValidUrl = (string) => {
            try {
                const url = new URL(string);
                return url.protocol === 'http:' || url.protocol === 'https:';
            } catch (_) {
                return false;
            }
        };

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title="설정">
                        <ToggleControl
                            label="아이콘 표시"
                            checked={showIcon}
                            onChange={(value) => setAttributes({ showIcon: value })}
                        />
                        <div className="components-base-control">
                            <label className="components-base-control__label">폰트 크기</label>
                            <div className="components-flex components-flex--nowrap">
                                <div className="components-flex__item">
                                    <TextControl
                                        type="number"
                                        value={fontSize}
                                        onChange={(value) => setAttributes({ fontSize: value })}
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                                <div className="components-flex__item">
                                    <SelectControl
                                        value={fontSizeUnit}
                                        options={[
                                            { label: 'px', value: 'px' },
                                            { label: 'em', value: 'em' },
                                            { label: 'rem', value: 'rem' },
                                            { label: 'pt', value: 'pt' }
                                        ]}
                                        onChange={(value) => setAttributes({ fontSizeUnit: value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </InspectorControls>
                <div className="reference-links-editor">
                    {links.map((link, index) => (
                        <div key={index} className="reference-link-item">
                            <div className="components-flex components-flex--nowrap">
                                <div className="components-flex__item">
                                    <TextControl
                                        placeholder="URL"
                                        value={link.url}
                                        onChange={(value) => updateLink(index, 'url', value)}
                                    />
                                </div>
                                <div className="components-flex__item">
                                    <TextControl
                                        placeholder="제목"
                                        value={link.title}
                                        onChange={(value) => updateLink(index, 'title', value)}
                                    />
                                </div>
                                <div className="components-flex__item">
                                    <Button
                                        isDestructive
                                        onClick={() => removeLink(index)}
                                    >
                                        삭제
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="secondary"
                        onClick={addLink}
                        disabled={isLoading}
                    >
                        {isLoading ? '로딩 중...' : '링크 추가'}
                    </Button>
                </div>
            </div>
        );
    },

    save: ({ attributes }) => {
        const { links, showIcon, fontSize, fontSizeUnit } = attributes;
        const blockProps = useBlockProps.save({
            style: {
                '--reference-link-font-size': fontSize === 'inherit' ? 'inherit' : `${fontSize}${fontSizeUnit}`,
                '--reference-link-icon-size': fontSize === 'inherit' ? '1em' : `${fontSize}${fontSizeUnit}`
            }
        });

        return (
            <div {...blockProps}>
                {links.map((link, index) => (
                    <div key={index} className="reference-link-item">
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {showIcon && (
                                <span className="reference-link-favicon default-icon" data-icon="external"></span>
                            )}
                            <span className="reference-link-title">{link.title || link.url}</span>
                        </a>
                    </div>
                ))}
            </div>
        );
    }
}); 