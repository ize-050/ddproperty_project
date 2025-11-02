import React from 'react';
import LanguageSwitcher from '../LanguageSwitcher';
import CurrencySwitcher from '../CurrencySwitcher';

const MobileSidebarSettings = () => {
  return (
    <div className="mobile-sidebar-settings">
      <div className="settings-section">
        <h6 className="settings-title">Settings</h6>
        
        <div className="settings-item">
          <div className="settings-label">
            <i className="fas fa-globe me-2"></i>
            Language
          </div>
          <div className="settings-control">
            <LanguageSwitcher />
          </div>
        </div>
        
        <div className="settings-item">
          <div className="settings-label">
            <i className="fas fa-dollar-sign me-2"></i>
            Currency
          </div>
          <div className="settings-control">
            <CurrencySwitcher />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebarSettings;
