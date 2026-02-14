import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    if (window.Pi) {
      window.Pi.init({ version: "1.5", sandbox: true });
    }
  }, []);

  const createPayment = async () => {
    const paymentData = {
      amount: 1, // تجريبي
      memo: "اختبار المرحلة 10",
      metadata: { orderId: "123" }
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId) => {
        fetch('https://chatoo-backend1.onrender.com/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        fetch('https://chatoo-backend1.onrender.com/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, txid })
        });
        alert("🎉 تمت المعاملة بنجاح!");
      },
      onCancel: (paymentId) => { console.log("Canceled", paymentId); },
      onError: (error, payment) => { console.error("Error", error); }
    };

    window.Pi.createPayment(paymentData, callbacks);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Chatoo App - Stage 10 ✅</h1>
      <button onClick={createPayment} style={{ padding: '20px', backgroundColor: '#FFD700', borderRadius: '10px', fontWeight: 'bold' }}>
        تجربة دفع (Stage 10 Test)
      </button>
    </div>
  );
};

export default App;

