import React, { useState, useEffect } from "react";
import "./Style.css";

function AdopterAdoptionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseUrl = "http://localhost:1337";

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          setError("Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${baseUrl}/api/adoption-requests?populate[0]=adopter&populate[1]=animal`
        );

        if (!response.ok) {
          throw new Error("Sahiplenme talepleri alınamadı.");
        }

        const data = await response.json();
        console.log("API Response:", data);
        setRequests(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Hata:", err);
        setError("Sahiplenme talepleri alınırken bir hata oluştu.");
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-badge pending";
      case "Approved":
        return "status-badge approved";
      case "Rejected":
        return "status-badge rejected";
      default:
        return "status-badge";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Pending":
        return "Beklemede";
      case "Approved":
        return "Onaylandı";
      case "Rejected":
        return "Reddedildi";
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="adoption-requests">
      <h2>Sahiplenme Taleplerim</h2>

      {requests.length === 0 ? (
        <p className="no-requests">Henüz bir sahiplenme talebiniz bulunmamaktadır.</p>
      ) : (
        <div className="table-container">
          <table className="shelter-table">
            <thead>
              <tr>
                <th>Hayvan Resmi</th>
                <th>Hayvan Adı</th>
                <th>Hayvan Türü</th>
                <th>Renk</th>
                <th>Sağlık Durumu</th>
                <th>Talep Tarihi</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const animal = request.animal || {};
                const imageUrl = animal?.AnimalImage?.url
                  ? `${baseUrl}${animal.AnimalImage.url}`
                  : null;

                return (
                  <tr key={request.id}>
                    <td>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={animal?.AnimalName || "Hayvan Resmi"}
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                      ) : (
                        "Resim Yok"
                      )}
                    </td>
                    <td>{animal?.AnimalName || "İsimsiz"}</td>
                    <td>{animal?.AnimalType || "Bilinmiyor"}</td>
                    <td>{animal?.Color || "Belirtilmemiş"}</td>
                    <td>{animal?.HealthStatus || "Belirtilmemiş"}</td>
                    <td>
                      {request.AdoptionRequestDate
                        ? new Date(request.AdoptionRequestDate).toLocaleDateString("tr-TR")
                        : "Belirtilmemiş"}
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(request.AdoptionRequestStatus)}>
                        {getStatusText(request.AdoptionRequestStatus)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdopterAdoptionRequests;
