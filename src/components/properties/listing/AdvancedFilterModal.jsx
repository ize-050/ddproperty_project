import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import getAllZones from '@/utils/getAllZones';
import useZoneStore from '@/store/useZoneStore';
export default function AdvancedFilterModal({ open, onClose, children }) {
  if (!open) return null;
  useEffect(() => {
    getAllZones().then((res) => {
      console.log("getzone",res)
      useZoneStore.setState({ zones: res });
    });
  }, [open]);
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
