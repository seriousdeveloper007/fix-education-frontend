import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import { useState } from 'react';
import themeConfig from '../../themeConfig';

export class ImageNode extends DecoratorNode {
  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__imageId, node.__key);
  }

  constructor(src, altText = '', width = 'auto', height = 'auto', imageId = null, key) {
    super(key);
    this.__src = src; // Signed URL from GCP
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
    this.__imageId = imageId; // Store image ID for deletion
  }

  createDOM() {
    const div = document.createElement('div');
    div.className = 'editor-image-container';
    div.style.display = 'inline-block';
    div.style.width = '100%';
    div.style.textAlign = 'center';
    div.style.margin = '8px 0';
    return div;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        imageId={this.__imageId}
      />
    );
  }

  static importJSON(serializedNode) {
    const { src, altText, width, height, imageId } = serializedNode;
    const node = $createImageNode({ src, altText, width, height, imageId });
    return node;
  }

  exportJSON() {
    return {
      type: 'image',
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      imageId: this.__imageId,
      version: 1,
    };
  }
}

function ImageComponent({ src, altText, width, height, imageId }) {
  const cfg = themeConfig.app;
  return (
    <div className="editor-image-wrapper" style={{ textAlign: 'center', margin: '12px 0' }}>
      <img
        src={src}
        alt={altText || 'Image'}
        style={{
          maxWidth: '100%',
          width: width === 'auto' ? 'auto' : width,
          height: height === 'auto' ? 'auto' : height,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          display: 'block',
          margin: '0 auto',
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `<span class="${cfg.primarytext}">Failed to load image</span>`;
        }}
      />
    </div>
  );
}

export function $createImageNode({ src, altText = '', width = 'auto', height = 'auto', imageId = null }) {
  return $applyNodeReplacement(new ImageNode(src, altText, width, height, imageId));
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}