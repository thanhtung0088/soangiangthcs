import React, { useRef } from 'react';

export interface AttachedFile {
  file: File;
  id: string;
}

interface FileAttachProps {
  files: AttachedFile[];
  onChange: (files: AttachedFile[]) => void;
  maxFiles?: number;
  label?: string;
}

const ICON_BY_EXT: Record<string, string> = {
  pdf: 'fa-file-pdf text-red-500',
  doc: 'fa-file-word text-blue-500',
  docx: 'fa-file-word text-blue-500',
  ppt: 'fa-file-powerpoint text-orange-500',
  pptx: 'fa-file-powerpoint text-orange-500',
  png: 'fa-file-image text-purple-500',
  jpg: 'fa-file-image text-purple-500',
  jpeg: 'fa-file-image text-purple-500',
  webp: 'fa-file-image text-purple-500',
};

const getIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  return ICON_BY_EXT[ext] || 'fa-file text-slate-400';
};

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileAttach: React.FC<FileAttachProps> = ({ files, onChange, maxFiles = 8, label = 'Tài liệu tham khảo đính kèm' }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    const conNhoLai = maxFiles - files.length;
    if (conNhoLai <= 0) {
      alert(`Chỉ được đính kèm tối đa ${maxFiles} file.`);
      e.target.value = '';
      return;
    }

    const themVao = picked.slice(0, conNhoLai).map((f) => ({ file: f, id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}` }));
    onChange([...files, ...themVao]);
    e.target.value = '';
  };

  const handleRemove = (id: string) => {
    onChange(files.filter((f) => f.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={files.length >= maxFiles}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-brand text-white text-sm font-black disabled:opacity-40"
          title={`Tải lên tối đa ${maxFiles} file`}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
        onChange={handlePick}
        className="hidden"
      />
      <p className="text-[10px] text-slate-300 font-medium mb-3">
        Ảnh, Word, PDF, PowerPoint - tối đa {maxFiles} file. AI sẽ tham khảo nội dung các file này khi soạn.
      </p>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-3 bg-slate-50 rounded-md px-4 py-3">
              <i className={`fas ${getIcon(f.file.name)}`}></i>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-700 truncate">{f.file.name}</p>
                <p className="text-[10px] text-slate-400">{formatSize(f.file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(f.id)}
                className="w-6 h-6 flex items-center justify-center rounded-md bg-slate-200 hover:bg-red-100 hover:text-red-600 text-slate-500 text-[11px] font-black"
                title="Xoá file"
              >
                <i className="fas fa-xmark"></i>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileAttach;
