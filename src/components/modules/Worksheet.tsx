import React, { useState } from 'react';
import ModuleShell, { ModuleInput, ModuleSelect } from '../ModuleShell';
import { MON_HOC_THCS } from '../../constants/subjects';
import FileAttach, { AttachedFile } from '../FileAttach';
import { generateWorksheet } from '../../services/geminiService';
import { exportWorksheetToWord, exportWorksheetToPdf } from '../../services/exportService';
import { WorksheetResult } from '../../types';

const Worksheet: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form, setForm] = useState({ subject: 'Toán học', grade: '6', title: '' });
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorksheetResult | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!form.title) return alert('Vui lòng nhập tên bài học');
    setLoading(true);
    setError('');
    try {
      setResult(await generateWorksheet(form, attachments.map((a) => a.file)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleShell
      title="Soạn phiếu học tập"
      accent="worksheet"
      icon="fa-file-lines"
      onBack={onBack}
      loading={loading}
      hasResult={!!result}
      onGenerate={handleGenerate}
      exportButtons={
        result
          ? [
              { label: 'Xuất Word', icon: 'fa-file-word', color: 'bg-blue-600', onClick: () => exportWorksheetToWord(result) },
              { label: 'Xuất PDF', icon: 'fa-file-pdf', color: 'bg-red-600', onClick: () => exportWorksheetToPdf(result) },
            ]
          : []
      }
      formArea={
        <>
          <ModuleSelect value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} options={MON_HOC_THCS} />
          <ModuleInput value={form.grade} onChange={(v) => setForm({ ...form, grade: v })} placeholder="Lớp..." />
          <ModuleInput value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Tên bài học..." />
          <FileAttach files={attachments} onChange={setAttachments} />
        </>
      }
      resultArea={
        error ? (
          <p className="text-red-500 font-bold">{error}</p>
        ) : result ? (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-center uppercase text-worksheet">{result.tenPhieu}</h2>
            <p className="text-center text-sm text-slate-400 font-bold">{result.monHoc} - Lớp {result.lop}</p>
            <p className="text-center text-xs text-slate-400 italic">{result.mucTieuPhieu}</p>
            {result.nhiemVu.map((nv) => (
              <div key={nv.soThuTu} className="border border-slate-100 rounded-md p-4">
                <p className="font-bold">{nv.soThuTu}. <span className="text-worksheet text-xs uppercase font-black">[{nv.hinhThuc}]</span> {nv.yeuCau}</p>
                {nv.khoangTraLoi && <p className="text-xs italic text-slate-400 mt-1">({nv.khoangTraLoi})</p>}
              </div>
            ))}
            {result.phanTuDanhGia && (
              <div className="border-l-4 border-worksheet/30 pl-4">
                <p className="font-black text-xs uppercase text-slate-400 mb-1">Tự đánh giá</p>
                <p className="text-slate-600 text-sm">{result.phanTuDanhGia}</p>
              </div>
            )}
          </div>
        ) : null
      }
    />
  );
};

export default Worksheet;
