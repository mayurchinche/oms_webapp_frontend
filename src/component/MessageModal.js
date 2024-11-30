import React from 'react';
import './MessageModal.css'; // For custom styles

const MessageModal = ({ isOpen, message, onClose }) => {
  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body">
            <p className="message-content">{message}</p>
            {!message.includes('Adding material...') && (
              <button className="btn btn-danger" onClick={onClose}>Close</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;