import React from 'react';
import './CustomLoadingOverlay.scss';

const CustomLoadingOverlay = ({ active, text, children }) => {
    return (
        <div className="custom-loading-wrapper">
            {active && (
                <div className="custom-loading-overlay">
                    <div className="spinner-box">
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>{text || 'Đang xử lý dữ liệu...'}</span>
                    </div>
                </div>
            )}
            {children}
        </div>
    );
};

export default CustomLoadingOverlay;
