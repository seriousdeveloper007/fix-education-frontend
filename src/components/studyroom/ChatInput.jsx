import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import TextAreaInput from '../chatroadmap/TextareaInput';

export function ChatInput({ 
  input, 
  attachedImages, 
  onInputChange, 
  onSend, 
  onPaste, 
  onRemoveImage, 
  onReset,
  isDisabled 
}) {
  const handleSend = () => {
    if (input.trim() || attachedImages.length > 0) {
      onSend();
    }
  };

  return (
    <div className="mt-2 pt-1 pr-1 relative">
      {/* Image Preview */}
      {attachedImages.length > 0 && (
        <div className="absolute left-3 bottom-full mb-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="relative w-28 h-20">
            <img
              src={attachedImages[0].url}
              alt="attachment"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => onRemoveImage(0)}
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-black/80 text-white flex items-center justify-center shadow-md"
              title="Remove"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      
      {/* Modified TextAreaInput wrapper */}
      <div onPaste={onPaste}>
        <TextAreaInput
          value={input}
          onChange={onInputChange}
          onSend={handleSend}
          onReset={onReset}
          isDisable={isDisabled}
          prompts={["Paste screenshot or type your doubt..", "Ask about the concept..."]}
        />
      </div>
    </div>
  );
}

ChatInput.propTypes = {
  input: PropTypes.string.isRequired,
  attachedImages: PropTypes.array.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  onPaste: PropTypes.func.isRequired,
  onRemoveImage: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
};