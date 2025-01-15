import React, { useState, useEffect } from "react";
import "./Style.css";

function AddShelterManager() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    shelterId: "",
  });
  const [shelters, setShelters] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    try {
      const response = await fetch("http://localhost:1337/api/shelters");
      if (!response.ok) {
        throw new Error("Barınaklar alınamadı");
      }
      const data = await response.json();
      setShelters(data.data || []);
    } catch (err) {
      console.error("Hata:", err);
      setError("Barınaklar alınırken bir hata oluştu");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:1337/api/shelter-managers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            ShelterManagerName: formData.name,
            ShelterManagerEmail: formData.email,
            ShelterManagerPassword: formData.password,
            shelter: formData.shelterId,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Yetkili eklenirken bir hata oluştu");
      }

      setSuccess("Barınak yetkilisi başarıyla eklendi!");
      setFormData({ name: "", email: "", password: "", shelterId: "" });
      setError("");
    } catch (err) {
      setError("Yetkili eklenirken bir hata oluştu: " + err.message);
      setSuccess("");
    }
  };

  return (
    <div className="form-container">
      <h2>Barınak Yetkilisi Ekle</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ad Soyad:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>E-posta:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Şifre:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Barınak:</label>
          <select
            value={formData.shelterId}
            onChange={(e) => setFormData({ ...formData, shelterId: e.target.value })}
            required
          >
            <option value="">Barınak Seçin</option>
            {shelters.map((shelter) => (
              <option key={shelter.id} value={shelter.id}>
                {shelter.ShelterName || "İsimsiz Barınak"}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">
          Yetkili Ekle
        </button>
      </form>
    </div>
  );
}

export default AddShelterManager; 