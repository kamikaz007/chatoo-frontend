import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    script.onload = () => {
      if (window.Pi) {
        // التأكد من تهيئة المكتبة فور تحميل السكريبت
        window.Pi.init({ version: "2.0", sandbox: true });
        console.log("Pi SDK loaded successfully");
      }
    };
    document.head.appendChild(script);
  }, []);

  const login = async () => {
    try {
      // فحص إضافي للتأكد من وجود المكتبة قبل تنفيذ الدالة
      if (!window.Pi) {
        alert("جاري تحميل مكتبة Pi... يرجى الانتظار ثواني ثم المحاولة مرة أخرى.");
        return;
      }
      const auth = await window.Pi.authenticate(['username', 'payments'], (p) => {
        console.log("Authentication in progress...", p);
      });
      setUser(auth.user);
    } catch (e) {
      // رسالة تنبيه واضحة في حال تعذر الدخول
      alert("خطأ في تسجيل الدخول: تأكد من فتح الرابط داخل Pi Browser حصراً.");
    }
  };

  const handlePay = async () => {
    try {
      await window.Pi.createPayment({
        amount: 0.1,
        memo: "Chatoo Test Payment",
        metadata: { id: Date.now() }
      }, {
        onReadyForServerApproval: (id) => fetch('https://chatoo-backend.onrender.com/approve', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ paymentId: id })
        }),
        onReadyForServerCompletion: (id, tx) => fetch('https://chatoo-backend.onrender.com/complete', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ paymentId: id, txid: tx })
        }),
        onCancel: () => console.log("تم إلغاء الدفع"),
        onError: (e) => alert("خطأ في الدفع: " + e.message)
      });
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#0b101b', height: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1 style={{ border: '2px solid #ffc107', padding: '10px 30px', borderRadius: '15px', marginBottom: '30px' }}>
        CHA<span style={{ color: '#ffc107' }}>TOO</span>
      </h1>

      {!user ? (
        <div>
          <p style={{ marginBottom: '20px' }}>يجب تسجيل الدخول أولاً للمتابعة</p>
          <button 
            onClick={login} 
            style={{ padding: '15px 40px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            تسجيل الدخول بواسطة Pi
          </button>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>أهلاً بك، <span style={{ color: '#ffc107' }}>{user.username}</span></p>
          <button 
            onClick={handlePay} 
            style={{ padding: '15px 40px', backgroundColor: '#25d366', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            دفع 0.1 Pi للاستمرار
          </button>
        </div>
      )}
    </div>
  );
}

// تصدير واحد فقط لتجنب خطأ Build في Render
export default App;

