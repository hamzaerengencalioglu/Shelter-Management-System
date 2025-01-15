import React, { useState, useEffect } from "react";
import "./Style.css";

function AdopterDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    AdopterNameSurname: "",
    AdopterEmail: "",
    AdopterPhoneNumber: "",
  });
  const [success, setSuccess] = useState("");
  const baseUrl = "http://localhost:1337";

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.documentId) {
        setError("Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }

      // documentId kullanılarak kullanıcı bilgileri getiriliyor
      const response = await fetch(`${baseUrl}/api/adopters?populate=*&filters[documentId][$eq]=${user.documentId}`);
      if (!response.ok) {
        throw new Error("Kullanıcı bilgileri alınamadı.");
      }

      const data = await response.json();
      if (data.data.length > 0) {
        const userInfo = data.data[0];
        setUserData(userInfo);
        setEditFormData({
          AdopterNameSurname: userInfo.AdopterNameSurname || "",
          AdopterEmail: userInfo.AdopterEmail || "",
          AdopterPhoneNumber: userInfo.AdopterPhoneNumber || "",
        });
      } else {
        setError("Kullanıcı bilgileri bulunamadı.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Hata:", err);
      setError("Kullanıcı bilgileri alınırken bir hata oluştu.");
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.documentId) {
        throw new Error("Kullanıcı bulunamadı.");
      }

      // documentId kullanılarak PUT isteği yapılıyor
      const response = await fetch(`${baseUrl}/api/adopters/${user.documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: editFormData,
        }),
      });

      if (!response.ok) {
        throw new Error("Bilgiler güncellenirken bir hata oluştu.");
      }

      setSuccess("Bilgileriniz başarıyla güncellendi!");
      setIsEditing(false);
      fetchUserData(); // Güncel bilgileri yeniden yükle

      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      setError("Bilgiler güncellenirken bir hata oluştu.");
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="shelter-dashboard">
      <h2 className="dashboard-title">Kullanıcı Profili</h2>
      {success && <div className="success-message">{success}</div>}

      {!isEditing ? (
        <>
          <div className="table-container">
            <table className="shelter-table">
              <thead>
                <tr>
                  <th colSpan="2">Kişisel Bilgiler</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Ad Soyad:</strong></td>
                  <td>{userData.AdopterNameSurname || "Belirtilmemiş"}</td>
                </tr>
                <tr>
                  <td><strong>E-posta:</strong></td>
                  <td>{userData.AdopterEmail || "Belirtilmemiş"}</td>
                </tr>
                <tr>
                  <td><strong>Telefon:</strong></td>
                  <td>{userData.AdopterPhoneNumber || "Belirtilmemiş"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="button-group">
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Bilgileri Düzenle
            </button>
          </div>
        </>
      ) : (
        <div className="edit-form-container">
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label>Ad Soyad:</label>
              <input
                type="text"
                value={editFormData.AdopterNameSurname}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  AdopterNameSurname: e.target.value,
                })}
                required
              />
            </div>
            <div className="form-group">
              <label>E-posta:</label>
              <input
                type="email"
                value={editFormData.AdopterEmail}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  AdopterEmail: e.target.value,
                })}
                required
              />
            </div>
            <div className="form-group">
              <label>Telefon:</label>
              <input
                type="tel"
                value={editFormData.AdopterPhoneNumber}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  AdopterPhoneNumber: e.target.value,
                })}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="submit-button">
                Kaydet
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdopterDashboard;
