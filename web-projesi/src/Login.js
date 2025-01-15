import React, { useState } from "react";
import "./Style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Adopter verilerini kontrol et
      const adopterResponse = await fetch("http://localhost:1337/api/adopters", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const adopterData = await adopterResponse.json();

      // ShelterManager verilerini kontrol et
      const shelterManagerResponse = await fetch(
        "http://localhost:1337/api/shelter-managers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const shelterManagerData = await shelterManagerResponse.json();

      // Admin verilerini kontrol et
      const adminResponse = await fetch("http://localhost:1337/api/admins", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const adminData = await adminResponse.json();

      // Adopter kontrolü
      const adopter = adopterData.data.find(
        (user) =>
          user.AdopterEmail === email &&
          user.AdopterPassword === password
      );

      if (adopter) {
        // Adopter girişi başarılı
        localStorage.setItem("userRole", "Adopter");
        localStorage.setItem("user", JSON.stringify(adopter));
        setError("");
        setSuccess("Giriş başarılı! Profilinize yönlendiriliyorsunuz.");

        setTimeout(() => {
          window.location.href = "/adopter-dashboard";
        }, 500);
        return;
      }

      // ShelterManager kontrolü
      const shelterManager = shelterManagerData.data.find(
        (user) =>
          user.ShelterManagerEmail === email &&
          user.ShelterManagerPassword === password
      );

      if (shelterManager) {
        // ShelterManager girişi başarılı
        localStorage.setItem("userRole", "ShelterManager"); // Kullanıcı rolünü kaydet
        localStorage.setItem("user", JSON.stringify(shelterManager)); // Kullanıcı bilgilerini kaydet
        setError("");
        setSuccess("Giriş başarılı! Shelter Manager Dashboard'a yönlendiriliyorsunuz.");

        setTimeout(() => {
          window.location.replace("/shelter-dashboard");
        }, 1000);
        return;
      }

      // Admin kontrolü
      const admin = adminData.data.find(
        (user) =>
          user.AdminEmail === email &&
          user.AdminPassword === password
      );

      if (admin) {
        // Admin girişi başarılı
        localStorage.setItem("userRole", "Admin"); // Kullanıcı rolünü kaydet
        localStorage.setItem("user", JSON.stringify(admin)); // Kullanıcı bilgilerini kaydet
        setError("");
        setSuccess("Giriş başarılı! Admin Dashboard'a yönlendiriliyorsunuz.");

        setTimeout(() => {
          window.location.replace("/add-shelter");
        }, 1000);
        return;
      }

      // Hiçbir eşleşme yoksa hata
      setError("E-posta veya şifre hatalı.");
    } catch (err) {
      console.error("Sunucu hatası:", err);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="form-container">
      <h2>Giriş Yap</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleLogin}>
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
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default Login;