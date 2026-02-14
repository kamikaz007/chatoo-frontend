import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    script.onload = () => {
      if (window.Pi) {
        window.Pi.init({ version: "2.0", sandbox: true });
      }
    };
    document.head.appendChild(script);
  }, []);

  const login = async () => {
    try {
      const auth = await window.Pi.authenticate(['username', 'payments'], (p) => {});
      setUser(auth.user);
    } catch (e) {
      alert("Please open this link inside Pi Browser");
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
        onCancel: () => console.log("Payment Cancelled"),
        onError: (e) => alert("Payment Error: " + e.message)
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
        <button onClick={login} style={{ padding: '15px 40px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
          Login with Pi
        </button>
      ) : (
        <div>
          <p>Welcome, {user.username}</p>
          <button onClick={handlePay} style={{ padding: '15px 40px', backgroundColor: '#25d366', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
            Pay 0.1 Pi
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

