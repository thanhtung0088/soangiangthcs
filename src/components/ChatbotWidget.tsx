import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';

interface ChatMsg {
  vaiTro: 'user' | 'assistant';
  noiDung: string;
}

const GOI_Y_NHANH = ['Cách soạn KHBD 5512?', 'Làm sao xuất file Word?', 'Tạo trò chơi tương tác thế nào?'];

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { vaiTro: 'assistant', noiDung: 'Chào Thầy/Cô! Mình là trợ lý ảo của Soạn Giảng AI. Thầy/Cô cần hỗ trợ gì ạ?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const noiDung = (text ?? input).trim();
    if (!noiDung) return;
    const lichSu = messages;
    setMessages((prev) => [...prev, { vaiTro: 'user', noiDung }]);
    setInput('');
    setLoading(true);
    try {
      const reply = await chatWithAssistant(
        noiDung,
        lichSu.map((m) => ({ vaiTro: m.vaiTro, noiDung: m.noiDung }))
      );
      setMessages((prev) => [...prev, { vaiTro: 'assistant', noiDung: reply }]);
    } catch (e) {
      setMessages((prev) => [...prev, { vaiTro: 'assistant', noiDung: (e as Error).message || 'Xin lỗi, mình gặp sự cố khi trả lời. Thầy/Cô thử lại giúp mình nhé.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="glass-card rounded-lg w-80 h-96 mb-3 flex flex-col overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-brand to-sky-500 px-4 py-3 flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <p className="text-white font-black text-xs uppercase">Trợ lý ảo</p>
              <p className="text-white/70 text-[10px]">Luôn sẵn sàng hỗ trợ</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/80 hover:text-white">
              <i className="fas fa-chevron-down"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-md text-xs leading-relaxed ${
                  m.vaiTro === 'user' ? 'bg-brand text-white ml-auto' : 'bg-white/80 text-slate-700'
                }`}
              >
                {m.noiDung}
              </div>
            ))}
            {loading && <div className="bg-white/80 text-slate-400 text-xs px-3 py-2 rounded-md w-fit italic">Đang trả lời...</div>}
          </div>

          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {GOI_Y_NHANH.map((g) => (
                <button
                  key={g}
                  onClick={() => handleSend(g)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 rounded-md px-2.5 py-1.5 text-slate-600"
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          <div className="p-2 border-t border-white/40 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi..."
              className="flex-1 bg-white/70 rounded-md px-3 py-2 text-xs"
            />
            <button onClick={() => handleSend()} className="bg-brand text-white w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0">
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-sky-400 shadow-2xl flex items-center justify-center text-3xl animate-float border-4 border-white/50"
        title="Trợ lý ảo"
      >
        🤖
      </button>
    </div>
  );
};

export default ChatbotWidget;
