import React, { useState } from 'react';
import ModuleShell, { ModuleInput, ModuleSelect } from '../ModuleShell';
import { MON_HOC_THCS } from '../../constants/subjects';
import FileAttach, { AttachedFile } from '../FileAttach';
import { generateTest7991 } from '../../services/geminiService';
import { exportTest7991ToWord, exportTest7991ToPdf } from '../../services/exportService';
import { Test7991Result } from '../../types';

const Test7991: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form, setForm] = useState<{ subject: string; grade: string; type: 'Trắc nghiệm' | 'Tự luận' | 'Kết hợp'; soCau: string }>({
    subject: 'Toán học',
    grade: '6',
    type: 'Kết hợp',
    soCau: '10',
  });
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Test7991Result | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      setResult(await generateTest7991({ ...form, soCau: Number(form.soCau) || undefined }, attachments.map((a) => a.file)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleShell
      title="Đề kiểm tra theo CV 7991"
      accent="test"
      icon="fa-file-circle-check"
      onBack={onBack}
      loading={loading}
      hasResult={!!result}
      onGenerate={handleGenerate}
      exportButtons={
        result
          ? [
              { label: 'Xuất Word (đủ ma trận)', icon: 'fa-file-word', color: 'bg-blue-600', onClick: () => exportTest7991ToWord(result) },
              { label: 'Xuất PDF (đề thi)', icon: 'fa-file-pdf', color: 'bg-red-600', onClick: () => exportTest7991ToPdf(result) },
            ]
          : []
      }
      formArea={
        <>
          <ModuleSelect value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} options={MON_HOC_THCS} />
          <ModuleInput value={form.grade} onChange={(v) => setForm({ ...form, grade: v })} placeholder="Lớp..." />
          <ModuleSelect
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v as any })}
            options={['Trắc nghiệm', 'Tự luận', 'Kết hợp']}
          />
          <ModuleInput value={form.soCau} onChange={(v) => setForm({ ...form, soCau: v })} placeholder="Số câu (VD: 10)..." />
          <FileAttach files={attachments} onChange={setAttachments} />
        </>
      }
      resultArea={
        error ? (
          <p className="text-red-500 font-bold">{error}</p>
        ) : result ? (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-center uppercase text-test">
              {result.monHoc} - Lớp {result.lop} - {result.thoiGianLamBai}
            </h2>
            <div>
              <p className="font-black uppercase text-sm mb-2">Ma trận đề</p>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-test/10">
                    <th className="border p-2 text-left">Chủ đề</th>
                    <th className="border p-2">NB</th>
                    <th className="border p-2">TH</th>
                    <th className="border p-2">VD</th>
                    <th className="border p-2">VDC</th>
                  </tr>
                </thead>
                <tbody>
                  {result.maTran.map((m, i) => (
                    <tr key={i}>
                      <td className="border p-2">{m.chuDe}</td>
                      <td className="border p-2 text-center">{m.nhanBiet}</td>
                      <td className="border p-2 text-center">{m.thongHieu}</td>
                      <td className="border p-2 text-center">{m.vanDungThap}</td>
                      <td className="border p-2 text-center">{m.vanDungCao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <p className="font-black uppercase text-sm mb-2">Đề bài</p>
              {result.deBai.map((c) => (
                <div key={c.soCau} className="mb-3">
                  <p className="font-bold">
                    Câu {c.soCau} ({c.mucDo} - {c.diem}đ): {c.noiDung}
                  </p>
                  {c.luaChon?.map((lc, i) => (
                    <p key={i} className="pl-4 text-slate-600">
                      {String.fromCharCode(65 + i)}. {lc}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : null
      }
    />
  );
};

export default Test7991;
