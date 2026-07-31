import React from 'react';

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }> = ({
  title,
  onClose,
  children,
  wide,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
    <div className={`glass-card rounded-lg w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto p-7`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-black text-slate-800 uppercase text-sm tracking-wide">{title}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-md bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-500 flex items-center justify-center">
          <i className="fas fa-xmark"></i>
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
