import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    if (window.Pi) {
      // تأكد من وجود sandbox: true للاختبار
      window.Pi.init({ version: "1.5", sandbox: true });
    }
  }, []);

  const createPayment = async () => {
    console.log("بداية عملية الدفع...");

    // البيانات المرسلة لشبكة Pi
    const paymentData = {
      amount: 0.1,
      memo: "Stage 10 Test",
      metadata: { orderId: "12345" }
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId) => {
        console.log("تم استلام PaymentId، جاري الإرسال للباكيند...");
        // هذا هو السطر الذي يجب أن يظهر في سجلات Render
        return fetch('https://chatoo-backend1.onrender.com/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        return fetch('https://chatoo-backend1.onrender.com/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, txid })
        });
      },
      onCancel: (paymentId) => { console.log("تم إلغاء الدفع"); },
      onError: (error, payment) => { console.error("خطأ في الدفع:", error); }
    };

    window.Pi.createPayment(paymentData, callbacks);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Chatoo App - Stage 10 ✅</h1>
      <button 
        onClick={createPayment} 
        style={{ padding: '20px', backgroundColor: '#FFD700', borderRadius: '10px', fontSize: '18px' }}
      >
        إجراء عملية دفع تجريبية
      </button>
    </div>
  );
};

export default App;

