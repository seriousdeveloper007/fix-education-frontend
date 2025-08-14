import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import { useState } from 'react';

export class ImageNode extends DecoratorNode {
  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__imageId,
      node.__key
    );
  }

  constructor(src, altText = '', width = 'auto', height = 'auto', imageId = null, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
    this.__imageId = imageId;
  }

  createDOM() {
    const div = document.createElement('div');
    div.className = 'editor-image-container';
    div.style.display = 'block';
    div.style.width = '100%';
    div.style.textAlign = 'center';
    div.style.margin = '12px 0';
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

  // Critical: Proper JSON serialization
  static importJSON(serializedNode) {
    const { src, altText, width, height, imageId } = serializedNode;
    return $createImageNode({
      src,
      altText: altText || '',
      width: width || 'auto',
      height: height || 'auto',
      imageId: imageId || null,
    });
  }

  // Critical: Proper JSON export
  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      imageId: this.__imageId,
    };
  }
}

function ImageComponent({ src, altText, width, height, imageId }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div 
      className="editor-image-wrapper" 
      style={{ 
        textAlign: 'center', 
        margin: '16px 0',
        position: 'relative',
      }}
    >
      {imageLoading && !imageError && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#9CA3AF',
            fontSize: '14px',
          }}
        >
          Loading image...
        </div>
      )}
      
      {imageError ? (
        <div 
          style={{
            padding: '20px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            color: '#DC2626',
            fontSize: '14px',
          }}
        >
          Failed to load image
        </div>
      ) : (
        <img
          src={src}
          alt={altText || 'Pasted image'}
          style={{
            maxWidth: '100%',
            width: width === 'auto' ? 'auto' : width,
            height: height === 'auto' ? 'auto' : height,
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: imageLoading ? 'none' : 'block',
            margin: '0 auto',
          }}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
        />
      )}
    </div>
  );
}

export function $createImageNode({ src, altText = '', width = 'auto', height = 'auto', imageId = null }) {
  return $applyNodeReplacement(new ImageNode(src, altText, width, height, imageId));
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}