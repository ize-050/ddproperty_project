import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';
import Image from 'next/image';

const CoAgentSection = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const store = usePropertyFormStore();
  
  // Get values from store with safe access
  const coAgentAccept = store.formData?.coAgentAccept || false;
  const commissionType = store.formData?.commissionType || 'percent';
  const commissionPercent = store.formData?.commissionPercent || '';
  const commissionAmount = store.formData?.commissionAmount || '';
  const privateNote = store.formData?.privateNote || '';

  // Watch for changes
  const watchCoAgentAccept = watch('coAgentAccept', coAgentAccept);
  const watchCommissionType = watch('commissionType', commissionType);
  const watchCommissionPercent = watch('commissionPercent', commissionPercent);
  const watchCommissionAmount = watch('commissionAmount', commissionAmount);
  const watchPrivateNote = watch('privateNote', privateNote);

  // Handle Co-Agent Accept toggle
  const handleCoAgentToggle = (checked) => {
    store.setCoAgentAccept(checked);
    setValue('coAgentAccept', checked);
    
    // Reset commission values when disabled
    if (!checked) {
      store.setCommissionType('percent');
      store.setCommissionPercent('');
      store.setCommissionAmount('');
      setValue('commissionType', 'percent');
      setValue('commissionPercent', '');
      setValue('commissionAmount', '');
    }
  };

  // Handle commission type change
  const handleCommissionTypeChange = (type) => {
    store.setCommissionType(type);
    setValue('commissionType', type);
    
    // Reset the other commission value
    if (type === 'percent') {
      store.setCommissionAmount('');
      setValue('commissionAmount', '');
    } else {
      store.setCommissionPercent('');
      setValue('commissionPercent', '');
    }
  };

  // Handle commission percent change
  const handleCommissionPercentChange = (value) => {
    store.setCommissionPercent(value);
    setValue('commissionPercent', value);
  };

  // Handle commission amount change
  const handleCommissionAmountChange = (value) => {
    store.setCommissionAmount(value);
    setValue('commissionAmount', value);
  };

  // Handle private note change
  const handlePrivateNoteChange = (value) => {
    store.setPrivateNote(value);
    setValue('privateNote', value);
  };

  // Calculate total commission for percentage
  const calculateTotalCommission = () => {
    const price = watch('price') || 0;
    const percent = watchCommissionPercent || 0;
    return (price * percent / 100).toLocaleString();
  };

  return (
    <section className="form-section co-agent-section">
      {/* Co-Agent Accept Toggle */}
      <div className="section-header">
        <Image 
          src="/images/icons/iconproperty/co-agent.svg" 
          alt="Co-Agent" 
          width={24} 
          height={24} 
          className="section-icon"
        />
        <h2 className="section-title">Co-Agent Accept</h2>
        
        <Controller
          name="coAgentAccept"
          control={control}
          defaultValue={coAgentAccept}
          render={({ field }) => (
            <label className="switch">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  handleCoAgentToggle(e.target.checked);
                }}
              />
              <span className="slider round"></span>
            </label>
          )}
        />
      </div>

      {/* Commission Section - Only show when Co-Agent Accept is enabled */}
      {watchCoAgentAccept && (
        <div className="commission-section">
          {/* Commission Percent Option */}
          <div className={`commission-option ${watchCommissionType === 'percent' ? 'active' : ''}`}>
            <div className="commission-header">
              <label className="commission-radio">
                <input
                  type="radio"
                  name="commissionType"
                  value="percent"
                  checked={watchCommissionType === 'percent'}
                  onChange={() => handleCommissionTypeChange('percent')}
                />
                <span className="radio-checkmark"></span>
                <span className="commission-title">Commission (Percent)</span>
              </label>
            </div>
            
            {watchCommissionType === 'percent' && (
              <div className="commission-content">
                <div className="commission-row">
                  <div className="commission-input-group">
                    <label className="form-label">Commission Rate</label>
                    <div className="input-with-percent">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="5"
                        value={watchCommissionPercent}
                        onChange={(e) => handleCommissionPercentChange(e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="percent-symbol">%</span>
                    </div>
                  </div>
                  
                  <div className="commission-total">
                    <label className="form-label">Total Commission</label>
                    <div className="total-amount">
                      ฿ {calculateTotalCommission()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Commission Specific Amount Option */}
          <div className={`commission-option ${watchCommissionType === 'amount' ? 'active' : ''}`}>
            <div className="commission-header">
              <label className="commission-radio">
                <input
                  type="radio"
                  name="commissionType"
                  value="amount"
                  checked={watchCommissionType === 'amount'}
                  onChange={() => handleCommissionTypeChange('amount')}
                />
                <span className="radio-checkmark"></span>
                <span className="commission-title">Commission (Specific numbers)</span>
              </label>
            </div>
            
            {watchCommissionType === 'amount' && (
              <div className="commission-content">
                <div className="commission-input-group">
                  <label className="form-label">Commission Rate</label>
                  <div className="input-with-currency">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="500000"
                      value={watchCommissionAmount}
                      onChange={(e) => handleCommissionAmountChange(e.target.value)}
                      min="0"
                    />
                    <span className="currency-symbol">THB</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Private Note Section */}
      <div className="private-note-section">
        <div className="private-note-header">
          <Image 
            src="/images/icons/iconproperty/privatenote.svg" 
            alt="Private Note" 
            width={24} 
            height={24} 
            className="section-icon"
          />
          <span className="private-note-label">Private Note</span>
        </div>
        
        <Controller
          name="privateNote"
          control={control}
          defaultValue={privateNote}
          render={({ field }) => (
            <textarea
              className="form-control private-note-textarea"
              rows="6"
              placeholder="Enter your private notes here..."
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
                handlePrivateNoteChange(e.target.value);
              }}
            />
          )}
        />
      </div>
    </section>
  );
};

export default CoAgentSection;
