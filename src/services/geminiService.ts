import { GoogleGenAI } from '@google/genai';
import { ApiKeyStore } from '../utils/localStore';
import {
  BaseLessonInput,
  KHBD5512Result,
  SlideDeckResult,
  OutlineResult,
  Test7991Result,
  WorksheetResult,
  InteractiveGameResult,
  VideoScriptResult,
  SKKNResult,
} from '../types';
import {
  promptKHBD5512,
  promptSlidePPT,
  promptOutline,
  promptTest7991,
  promptWorksheet,
  promptGame,
  promptVideoScript,
  promptSKKN,
} from '../prompts/promptTemplates';

// Ưu tiên API key cá nhân do người dùng tự dán vào (lưu trên trình duyệt của họ);
// nếu chưa dán, dùng key mặc định của hệ thống (biến môi trường GEMINI_API_KEY trên Vercel, nếu có).
function getAI(): GoogleGenAI {
  const key = ApiKeyStore.get() || process.env.API_KEY || '';
  if (!key) {
    throw new Error('Chưa có API key. Vui lòng bấm "Kết nối API" ở góc trên và dán API key Gemini của bạn.');
  }
  return new GoogleGenAI({ apiKey: key });
}
const MODEL = 'gemini-2.5-flash';

/** Google hiện đang phát sinh lỗi 401 với các key mới có dạng "AQ...." (thay vì "AIzaSy...")
 * trên API generateContent - đây là lỗi đã biết từ phía Google, chưa có bản vá công khai.
 * Hàm này giúp báo lỗi rõ ràng thay vì chỉ hiện "401" khó hiểu. */
function xuLyLoiGemini(err: unknown, keyDangDung: string): Error {
  const msg = (err as any)?.message || String(err);
  const la401 =
    msg.includes('401') || msg.includes('UNAUTHENTICATED') || msg.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED');

  if (la401 && keyDangDung.startsWith('AQ.')) {
    return new Error(
      'API key dạng "AQ...." đang bị Google từ chối (lỗi đã biết từ phía Google, chưa có bản vá). ' +
        'Vui lòng vào aistudio.google.com/apikey tạo/dùng key dạng cũ "AIzaSy..." rồi kết nối lại.'
    );
  }
  if (la401) {
    return new Error('API key không hợp lệ hoặc đã hết hạn (lỗi 401). Vui lòng kiểm tra lại key đã kết nối.');
  }
  if (msg.includes('429')) {
    return new Error('Đã vượt giới hạn số lượt gọi AI miễn phí trong khoảng thời gian này (lỗi 429). Vui lòng đợi một chút rồi thử lại.');
  }
  return err instanceof Error ? err : new Error(msg);
}

// Các định dạng Gemini đọc trực tiếp được nội dung (ảnh, PDF). Word/PPT vẫn được đính kèm
// theo tên file để AI biết ngữ cảnh, nhưng để AI "đọc" được nội dung Word/PPT, GV nên
// xuất/convert sang PDF trước khi tải lên (ghi rõ trong FileAttach).
const MIME_DOC_DUOC = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = () => reject(new Error('Không đọc được file: ' + file.name));
    reader.readAsDataURL(file);
  });
}

/** Chuyển danh sách File đính kèm thành các "part" gửi kèm prompt cho Gemini. */
async function buildAttachmentParts(files?: File[]) {
  if (!files || !files.length) return [];
  const parts: any[] = [];
  for (const file of files) {
    if (MIME_DOC_DUOC.includes(file.type)) {
      const data = await fileToBase64(file);
      parts.push({ inlineData: { mimeType: file.type, data } });
    } else {
      // Word/PPT: Gemini không đọc trực tiếp được nội dung nhị phân này qua inlineData,
      // nên chỉ đưa tên file vào ngữ cảnh để AI biết GV đã tham khảo tài liệu đó.
      parts.push({ text: `(Giáo viên có đính kèm tài liệu tham khảo: "${file.name}" - vui lòng ưu tiên bám sát tinh thần tài liệu này nếu có thể suy luận từ tên file và ngữ cảnh.)` });
    }
  }
  return parts;
}

/** Gọi Gemini với 1 prompt yêu cầu JSON (+ file đính kèm tuỳ chọn), dọn dẹp code-fence và parse an toàn. */
async function generateJSON<T>(prompt: string, files?: File[]): Promise<T> {
  const attachmentParts = await buildAttachmentParts(files);
  const contents = [{ role: 'user', parts: [{ text: prompt }, ...attachmentParts] }];
  const key = ApiKeyStore.get() || process.env.API_KEY || '';

  let response;
  try {
    response = await getAI().models.generateContent({
      model: MODEL,
      contents,
      config: { responseMimeType: 'application/json' },
    });
  } catch (err) {
    throw xuLyLoiGemini(err, key);
  }

  const raw = response.text ?? '';
  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    throw new Error('AI trả về dữ liệu không hợp lệ. Vui lòng thử lại. Chi tiết: ' + (err as Error).message);
  }
}

/** Tạo ảnh minh hoạ AI cho 1 slide (dùng cho luồng Bài giảng PPT).
 * Dùng model "gemini-2.5-flash-image" (Nano Banana) vì model này CÓ hạn mức miễn phí;
 * model Imagen 3/4 cũ không có gói miễn phí, bắt buộc phải bật billing nên luôn lỗi với tài khoản free. */
export async function generateSlideImage(moTaHinhAnh: string): Promise<string> {
  const key = ApiKeyStore.get() || process.env.API_KEY || '';
  let response;
  try {
    response = await getAI().models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: `Educational illustration, clean and simple, suitable for a middle school (THCS) classroom slide. ${moTaHinhAnh}`,
      config: { responseModalities: ['IMAGE'] },
    });
  } catch (err) {
    throw xuLyLoiGemini(err, key);
  }
  const parts = response.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find((p: any) => p.inlineData?.data);
  if (!imgPart?.inlineData?.data) throw new Error('Không tạo được ảnh minh hoạ. Vui lòng thử lại.');
  const mimeType = imgPart.inlineData.mimeType || 'image/png';
  return `data:${mimeType};base64,${imgPart.inlineData.data}`;
}

/** Trợ lý ảo chat đơn giản (góc dưới bên phải) - trả lời văn bản thuần, không cần JSON. */
export async function chatWithAssistant(message: string, lichSu: { vaiTro: 'user' | 'assistant'; noiDung: string }[]): Promise<string> {
  const contents = [
    ...lichSu.map((h) => ({ role: h.vaiTro === 'user' ? 'user' : 'model', parts: [{ text: h.noiDung }] })),
    { role: 'user', parts: [{ text: message }] },
  ];
  const key = ApiKeyStore.get() || process.env.API_KEY || '';
  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction:
          'Bạn là trợ lý ảo thân thiện của ứng dụng Soạn Giảng AI dành cho giáo viên THCS. Trả lời ngắn gọn, đúng trọng tâm, bằng tiếng Việt, giọng điệu gần gũi. Nếu được hỏi về cách dùng app, hướng dẫn theo các luồng: KHBD 5512, Bài giảng PPT, Đề cương ôn tập, Đề kiểm tra 7991, Phiếu học tập, Trò chơi tương tác, Kịch bản video, Sáng kiến kinh nghiệm.',
      },
    });
    return response.text ?? 'Xin lỗi, tôi chưa thể trả lời ngay lúc này.';
  } catch (err) {
    throw xuLyLoiGemini(err, key);
  }
}

// 1. KHBD 5512
export async function generateLessonPlan(input: BaseLessonInput, files?: File[]): Promise<KHBD5512Result> {
  return generateJSON<KHBD5512Result>(promptKHBD5512(input), files);
}

// 2. Bài giảng trình chiếu PPT
export async function generatePPTLayout(input: BaseLessonInput, soSlide?: number, files?: File[]): Promise<SlideDeckResult> {
  return generateJSON<SlideDeckResult>(promptSlidePPT(input, soSlide), files);
}

// 3. Đề cương ôn tập
export async function generateOutline(input: BaseLessonInput, files?: File[]): Promise<OutlineResult> {
  return generateJSON<OutlineResult>(promptOutline(input), files);
}

// 4. Đề kiểm tra CV 7991
export async function generateTest7991(
  input: { subject: string; grade: string; type: 'Trắc nghiệm' | 'Tự luận' | 'Kết hợp'; soCau?: number },
  files?: File[]
): Promise<Test7991Result> {
  return generateJSON<Test7991Result>(promptTest7991(input), files);
}

// 5. Phiếu học tập
export async function generateWorksheet(input: BaseLessonInput, files?: File[]): Promise<WorksheetResult> {
  return generateJSON<WorksheetResult>(promptWorksheet(input), files);
}

// 6. Trò chơi tương tác
export async function generateGame(input: BaseLessonInput, theLoai?: string, files?: File[]): Promise<InteractiveGameResult> {
  return generateJSON<InteractiveGameResult>(promptGame(input, theLoai), files);
}

// 7. Kịch bản video minh hoạ
export async function generateVideoScript(input: BaseLessonInput, thoiLuongMucTieu?: string, files?: File[]): Promise<VideoScriptResult> {
  return generateJSON<VideoScriptResult>(promptVideoScript(input, thoiLuongMucTieu), files);
}

// 8. Sáng kiến kinh nghiệm
export async function generateSKKN(
  input: {
    tenSangKien: string;
    subject: string;
    grade: string;
    donViCongTac?: string;
    doiTuongApDung?: string;
    namHoc?: string;
    boiCanh?: string;
  },
  files?: File[]
): Promise<SKKNResult> {
  return generateJSON<SKKNResult>(promptSKKN(input), files);
}
