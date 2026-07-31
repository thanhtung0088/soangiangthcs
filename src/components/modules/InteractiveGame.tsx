import React, { useState } from 'react';
import ModuleShell, { ModuleInput, ModuleSelect } from '../ModuleShell';
import { MON_HOC_THCS } from '../../constants/subjects';
import FileAttach, { AttachedFile } from '../FileAttach';
import { generateGame } from '../../services/geminiService';
import { exportGameToWord } from '../../services/exportService';
import { InteractiveGameResult } from '../../types';

const THE_LOAI = ['Ai là triệu phú', 'Rung chuông vàng', 'Ô chữ bí mật', 'Vòng quay may mắn', 'Đường lên đỉnh Olympia (rút gọn)'];

const InteractiveGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form, setForm] = useState({ subject: 'Toán học', grade: '6', title: '', theLoai: THE_LOAI[0] });
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InteractiveGameResult | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!form.title) return alert('Vui lòng nhập tên bài học');
    setLoading(true);
    setError('');
    try {
      setResult(await generateGame(form, form.theLoai, attachments.map((a) => a.file)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleShell
      title="Soạn trò chơi tương tác"
      accent="game"
      icon="fa-gamepad"
      onBack={onBack}
      loading={loading}
      hasResult={!!result}
      onGenerate={handleGenerate}
      exportButtons={result ? [{ label: 'Xuất Word', icon: 'fa-file-word', color: 'bg-blue-600', onClick: () => exportGameToWord(result) }] : []}
      formArea={
        <>
          <ModuleSelect value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} options={MON_HOC_THCS} />
          <ModuleInput value={form.grade} onChange={(v) => setForm({ ...form, grade: v })} placeholder="Lớp..." />
          <ModuleInput value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Tên bài học..." />
          <ModuleSelect value={form.theLoai} onChange={(v) => setForm({ ...form, theLoai: v })} options={THE_LOAI} />
          <FileAttach files={attachments} onChange={setAttachments} />
        </>
      }
      resultArea={
        error ? (
          <p className="text-red-500 font-bold">{error}</p>
        ) : result ? (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-center uppercase text-game">{result.tenTroChoi}</h2>
            <p className="text-center text-xs text-slate-400 font-bold uppercase">{result.hinhThucToChuc}</p>
            <p className="text-slate-600 italic">{result.mucTieuHocTap}</p>
            <p className="text-slate-600">{result.cachChoi}</p>
            {result.dungCuChuanBi.length > 0 && (
              <p className="text-sm text-slate-500"><b>Dụng cụ:</b> {result.dungCuChuanBi.join(', ')}</p>
            )}
            <p className="text-sm text-slate-500"><b>Tính điểm:</b> {result.cachTinhDiemVaTraoThuong}</p>
            {result.cauHoi.map((c, i) => (
              <div key={i} className="border border-slate-100 rounded-md p-4">
                <p className="font-bold">Câu {i + 1}: {c.cauHoi}</p>
                <p className="text-green-600 text-sm font-bold mt-1">Đáp án đúng: {c.dapAnDung}</p>
                {c.dapAnNhieu?.length ? <p className="text-slate-400 text-sm">Đáp án nhiễu: {c.dapAnNhieu.join(', ')}</p> : null}
                {c.goiY && <p className="text-slate-400 text-sm italic">Gợi ý: {c.goiY}</p>}
              </div>
            ))}
          </div>
        ) : null
      }
    />
  );
};

export default InteractiveGame;
