
import React, { useState, useEffect, useCallback } from 'react';
import { 
  INSTRUCTOR_NAME, 
  MODULES, 
  PRICING,
  BANKING,
  ZALO_GROUP_URL
} from './constants';
import CountdownTimer from './components/CountdownTimer';
import ModuleCard from './components/ModuleCard';

const App: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ txId: string } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'UNPAID' | 'PAID'>('UNPAID');

  // URL Apps Script - QUAN TRỌNG: Cần Deploy phiên bản mới sau khi sửa code App Script
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz08ONSuRvlxGBZWDyy4O-goMOcrXqfB2d-z8O076EBZGX2ueOjRoO850fQmVWvkrv-/exec';

  const generateTxId = () => {
    return `VIBE${Date.now().toString().slice(-6)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const txId = generateTxId();
    try {
      const payload = {
        ...formData,
        amount: PRICING.specialPrice,
        transactionId: txId,
        status: 'UNPAID'
      };
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setSubmittedData({ txId });
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = useCallback(async () => {
    if (!submittedData || paymentStatus === 'PAID') return;
    setCheckingPayment(true);
    try {
      // Gọi hàm doGet của Apps Script
      const response = await fetch(`${SCRIPT_URL}?txId=${submittedData.txId}`);
      const data = await response.json();
      if (data.status === 'PAID') {
        setPaymentStatus('PAID');
      }
    } catch (e) {
      console.warn('Đang đồng bộ dữ liệu thanh toán...');
    } finally {
      setCheckingPayment(false);
    }
  }, [submittedData, paymentStatus]);

  // Polling tự động mỗi 10 giây
  useEffect(() => {
    let intervalId: number;
    if (submittedData && paymentStatus === 'UNPAID') {
      intervalId = window.setInterval(checkPaymentStatus, 10000);
    }
    return () => clearInterval(intervalId);
  }, [submittedData, paymentStatus, checkPaymentStatus]);

  const qrUrl = submittedData 
    ? `https://qr.sepay.vn/img?acc=${BANKING.account}&bank=${BANKING.bank}&amount=${PRICING.numericPrice}&des=${submittedData.txId}&template=${BANKING.template}`
    : '';

  return (
    <div className="min-h-screen bg-white selection:bg-[#0071e3] selection:text-white">
      {/* Navigation */}
      <nav className="apple-glass sticky top-0 z-50 border-b border-[#d2d2d7]/30 h-16 flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center max-w-7xl">
          <div className="text-xl font-bold tracking-tight">VIBE CODING.</div>
          <div className="hidden md:flex items-center gap-10">
             <div className="text-[10px] font-bold text-[#86868b] tracking-widest uppercase">Lớp học bắt đầu sau</div>
             <CountdownTimer />
          </div>
          <a href="#register" className="bg-[#1d1d1f] text-white text-[12px] font-bold px-5 py-2 rounded-full hover:bg-[#424245] transition-all">
            ĐĂNG KÝ
          </a>
        </div>
      </nav>

      <header className="hero-gradient py-24 md:py-40 border-b border-[#f5f5f7]">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <div className="inline-block px-4 py-1 bg-[#f5f5f7] rounded-full text-[10px] font-bold text-[#d70015] mb-10 tracking-[0.2em] uppercase border border-[#d2d2d7]/50">
            Master Class 2025: AI & Automation
          </div>
          <h1 className="text-6xl md:text-9xl font-black mb-10 leading-[0.9] tracking-tight text-[#1d1d1f]">
            AI VIBE CODING <br />
            <span className="text-[#86868b]">& AUTOMATION</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#424245] max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
            Học cách sử dụng Generative AI và Vibe Coding để xây dựng hệ thống tự vận hành toàn bộ doanh nghiệp của bạn.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <a href="#register" className="btn-primary px-10 py-5 rounded-full text-lg font-bold min-w-[200px] shadow-lg">
              ĐĂNG KÝ HỌC NGAY
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-6 py-32">
        <div className="flex flex-col lg:flex-row gap-24">
          <main className="lg:w-2/3 space-y-40">
            <section id="blueprint">
              <div className="mb-16">
                <h2 className="text-5xl font-bold tracking-tight mb-6 uppercase">CHƯƠNG TRÌNH ĐÀO TẠO</h2>
                <div className="h-1.5 w-24 bg-[#1d1d1f]"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {MODULES.map(module => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            </section>
          </main>

          <aside className="lg:w-1/3">
            <div className="lg:sticky lg:top-32" id="register">
              <div className="bg-white border border-[#d2d2d7] rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
                
                {submittedData ? (
                  paymentStatus === 'PAID' ? (
                    // MÀN HÌNH CHÚC MỪNG (SUCCESS)
                    <div className="animate-in zoom-in duration-700 text-center py-6">
                      <div className="text-7xl mb-6">✨</div>
                      <h2 className="text-3xl font-black text-[#1d1d1f] uppercase leading-tight mb-4">XÁC NHẬN THÀNH CÔNG!</h2>
                      <div className="inline-block bg-[#34c759] text-white text-[10px] font-bold px-4 py-1 rounded-full mb-8">
                        ĐÃ THANH TOÁN
                      </div>
                      
                      <div className="bg-[#f5f5f7] rounded-3xl p-8 mb-8 text-left space-y-5 border border-[#d2d2d7]/50">
                        <p className="text-[14px] text-[#1d1d1f] font-medium leading-relaxed">
                          Chào mừng bạn đến với Master Class! Tôi đã nhận được thanh toán cho mã đơn hàng <span className="font-bold underline">{submittedData.txId}</span>.
                        </p>
                        <div className="p-4 bg-white rounded-2xl border border-[#d2d2d7]/30 space-y-3">
                           <p className="text-[12px] text-[#424245] flex items-start gap-2">
                             <span className="text-[#0071e3]">●</span>
                             Tôi vừa gửi cho bạn một <b>Email xác nhận</b> chi tiết.
                           </p>
                           <p className="text-[12px] text-[#424245] flex items-start gap-2">
                             <span className="text-[#0071e3]">●</span>
                             Tôi cũng đã gửi <b>Lời mời kết bạn trên Zalo</b> để hỗ trợ bạn trực tiếp.
                           </p>
                        </div>
                      </div>

                      <a 
                        href={ZALO_GROUP_URL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-[#0068ff] text-white py-6 rounded-2xl font-bold text-lg uppercase tracking-widest shadow-xl flex justify-center items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        VÀO NHÓM ZALO LỚP HỌC
                      </a>
                    </div>
                  ) : (
                    // MÀN HÌNH THANH TOÁN (QR)
                    <div className="animate-in slide-in-from-right duration-700">
                      <div className="text-center mb-8">
                        <div className="text-4xl mb-4">💳</div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] uppercase">QUÉT MÃ THANH TOÁN</h2>
                        <p className="text-[#86868b] text-[10px] font-bold tracking-widest uppercase mt-2">Đơn hàng: {submittedData.txId}</p>
                      </div>

                      <div className="bg-[#f5f5f7] rounded-[2.5rem] p-6 mb-8 text-center border border-[#d2d2d7]/50">
                        <img 
                          src={qrUrl} 
                          alt="QR Thanh Toán" 
                          className="w-full max-w-[220px] mx-auto rounded-2xl shadow-sm mb-6 border-4 border-white"
                        />
                        <div className="space-y-4 text-left px-2">
                          <div className="flex justify-between border-b border-[#d2d2d7]/30 pb-2">
                            <span className="text-[10px] font-bold text-[#86868b] uppercase">Nội dung chuyển khoản</span>
                            <span className="text-[14px] font-black text-[#0071e3] tracking-widest uppercase">{submittedData.txId}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-[10px] font-bold text-[#86868b] uppercase">Số tiền cần trả</span>
                            <span className="text-[18px] font-black text-[#d70015]">{PRICING.specialPrice}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <button 
                          onClick={checkPaymentStatus}
                          disabled={checkingPayment}
                          className="w-full bg-[#1d1d1f] text-white py-5 rounded-2xl font-bold text-[13px] uppercase tracking-widest flex justify-center items-center gap-3 hover:bg-[#424245] transition-all disabled:opacity-50"
                        >
                          {checkingPayment ? (
                             <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          ) : 'XÁC NHẬN ĐÃ CHUYỂN KHOẢN'}
                        </button>

                        <div className="flex items-center justify-center gap-3 py-2">
                          <span className="w-2 h-2 bg-[#0071e3] rounded-full animate-ping"></span>
                          <span className="text-[10px] font-bold text-[#0071e3] uppercase tracking-widest">Đang tự động kiểm tra...</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#86868b] text-center leading-relaxed font-medium mt-6 mb-4">
                        * Hệ thống sẽ tự động chuyển hướng ngay khi nhận được tiền.
                      </p>

                      <button 
                        onClick={() => setSubmittedData(null)}
                        className="w-full text-[11px] font-bold text-[#86868b] hover:text-[#1d1d1f] transition-colors uppercase tracking-widest"
                      >
                        ← Quay lại trang đăng ký
                      </button>
                    </div>
                  )
                ) : (
                  // MÀN HÌNH FORM ĐĂNG KÝ
                  <>
                    <div className="mb-12">
                      <h2 className="text-3xl font-bold tracking-tight text-[#1d1d1f] uppercase">THAM GIA NGAY</h2>
                      <p className="text-[#86868b] text-[11px] font-bold tracking-widest uppercase mt-3">Sở hữu hệ thống AI đỉnh cao</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <input 
                        required disabled={loading} type="text" 
                        className="w-full input-apple rounded-2xl px-6 py-4.5 font-bold text-[#1d1d1f] outline-none" 
                        placeholder="HỌ VÀ TÊN"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                      <input 
                        required disabled={loading} type="tel" 
                        className="w-full input-apple rounded-2xl px-6 py-4.5 font-bold text-[#1d1d1f] outline-none" 
                        placeholder="SỐ ĐIỆN THOẠI"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                      <input 
                        required disabled={loading} type="email" 
                        className="w-full input-apple rounded-2xl px-6 py-4.5 font-bold text-[#1d1d1f] outline-none" 
                        placeholder="EMAIL"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                      
                      <div className="bg-[#1d1d1f] text-white p-8 rounded-[2rem] space-y-4 my-8 shadow-inner">
                        <div className="flex justify-between items-center text-[10px] font-bold opacity-40 tracking-widest uppercase">
                          <span>GIÁ GỐC</span>
                          <span className="line-through">{PRICING.actualValue}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="font-bold uppercase text-[11px] tracking-widest text-[#34c759]">ƯU ĐÃI</span>
                          <div className="text-right">
                             <div className="text-4xl font-bold tracking-tight leading-none">{PRICING.specialPrice}</div>
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit" disabled={loading}
                        className="w-full btn-primary py-6 rounded-2xl font-bold text-lg uppercase tracking-widest shadow-xl flex justify-center items-center gap-3 disabled:opacity-70"
                      >
                         {loading ? (
                           <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                         ) : 'TIẾP TỤC ĐẾN THANH TOÁN'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <footer className="py-24 bg-[#f5f5f7] border-t border-[#d2d2d7]">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-4xl font-bold tracking-tight italic">HUNG NPV.</div>
          <div className="text-[#d1d1d6] font-bold text-[10px] uppercase tracking-widest">
            © 2025 DUHAVA // DESIGNED FOR THE BOLD
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
