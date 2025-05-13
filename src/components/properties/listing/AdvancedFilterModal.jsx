
"use client"
import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import getAllZones from '@/utils/getAllZones';
import useZoneStore from '@/store/useZoneStore';
export default function AdvancedFilterModal({ open, onClose, children }) {
  useEffect(() => {
    if (open) {
      getAllZones().then((res) => {
        console.log("getzone",res)
        useZoneStore.setState({ zones: res });
      });
    }
  }, [open]);
  
  if (!open) return null;
  return (
    <div className="advanced-modal-overlay">
      <div className="advanced-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <FiX size={28} />
        </button>
        {children}
      </div>
    </div>
  );
}
