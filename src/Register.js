import React, { useState } from "react";
import "./Style.css"; // CSS dosyasını dahil ettik

function Register() {
  const [namesurname, setNameSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Telefon numarasını otomatik formatlama
  const formatPhoneNumber = (value) => {
    // Sadece sayıları al
    const digits = value.replace(/\D/g, "");

    // Format 0000-000-0000
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }
    if (digits.length > 7) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return formatted.slice(0, 13); // En fazla 14 karakter (0000-000-0000)
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Telefon numarası formatını kontrol et
    const phoneRegex = /^\d{4}-\d{3}-\d{4}$/; // 0000-000-0000 formatı
    if (!phoneRegex.test(phoneNumber)) {
      setError("Telefon numarası formatı geçersiz. Lütfen 05xx-xxx-xxxx formatında girin.");
      return;
    }

    // Şifre formatını kontrol et
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{10,}$/; // En az bir büyük harf ve bir özel karakter, minimum 10 karakter
    if (!passwordRegex.test(password)) {
      setError("Şifre en az 10 karakter olmalı, bir büyük harf ve bir özel karakter içermelidir.");
      return;
    }

    try {
      const response = await fetch("http://34.107.58.215:1337/api/adopters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer   a697420bc4c68aeee6345f62e7e6fa10503a83d71385c708536f7f7a14c94c0c838473a9807ab970b77d4be657f314f302bfea24c60269a0776b563bdb12ea6fc6d1f93910a85febc3f832d83b7161500037ea275c012afc70d00ee72869bd2c26b1fa0e4085536851d460bbf2f23993352bfca64896f8255a327a1a664bb009`, 
        },
        body: JSON.stringify({
          data: {
            AdopterNameSurname: namesurname,
            AdopterEmail: email,
            AdopterPhoneNumber: phoneNumber,
            AdopterPassword: password,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
        setError("");
        setNameSurname("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
      } else {
        // Sunucudan dönen hata mesajını kontrol edin
        if (data.error?.message.includes("must be unique")) {
          setError("Bu telefon numarasıyla kayıtlı bir kullanıcı bulunmaktadır.");
        } else {
          setError(data.error?.message || "Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.");
        }
        setSuccess("");
      }
    } catch (err) {
      console.error("Sunucu hatası:", err);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setSuccess("");
    }
  };

  return (
    <div className="form-container">
      <h2>Kayıt Ol</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Ad Soyad:</label>
          <input
            type="text"
            placeholder="Adınızı girin"
            value={namesurname}
            onChange={(e) => setNameSurname(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>E-posta:</label>
          <input
            type="email"
            placeholder="E-posta adresinizi girin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Telefon Numarası:</label>
          <input
            type="tel"
            placeholder="Telefon numaranızı 05 ile başlayacak şekilde girin"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label>Şifre:</label>
          <input
            type="password"
            placeholder="Şifrenizi girin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Kayıt Ol
        </button>
      </form>
    </div>
  );
}

export default Register;
