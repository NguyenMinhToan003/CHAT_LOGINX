import React, { useState } from 'react';
import { CircularProgress } from "@mui/material";
import "./DiaLog.css"

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-overlay" onClick={onClose}>
      <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-header">
          <h3>Xác nhận xóa</h3>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="confirmation-content">
          <div className="confirmation-icon">
            <i className="fas fa-trash-alt"></i>
          </div>
          <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
          <p className="confirmation-subtext">Hành động này không thể hoàn tác.</p>
        </div>
        <div className="confirmation-actions">
          <button className="cancel-button" onClick={onClose} disabled={isLoading}>
            Hủy
          </button>
          <button className="confirm-button" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <CircularProgress size={16} color="inherit" />
                <span className="loading-text">Đang xóa...</span>
              </>
            ) : (
              'Xóa bài viết'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;