import React from 'react';

interface DeleteModalProps {
    onDeleteConfirm: () => void;
    onClose: () => void;
    itemName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ onDeleteConfirm, onClose, itemName }) => {
    return (
        <div className="delete-modal">
            <h2>Are you sure you want to delete {itemName}?</h2>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
                <button onClick={onDeleteConfirm} className="delete__button">Delete</button>
                <button onClick={onClose} className="delete__button--cancel">Cancel</button>
            </div>
        </div>
    );
};

export default DeleteModal;