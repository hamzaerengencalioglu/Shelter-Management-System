import React, { useState, useEffect } from "react";
import "./Style.css";

function ShelterAdoptionRequests({ baseUrl }) {
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [shelterId, setShelterId] = useState(null);

  useEffect(() => {
    const fetchUserShelter = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          setError("Kullanıcı bilgisi bulunamadı!");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${baseUrl}/api/shelters?populate=shelter_manager`
        );
        if (!response.ok) {
          throw new Error("Barınak bilgileri alınamadı!");
        }

        const data = await response.json();
        const userShelter = data.data.find(
          (shelter) =>
            shelter.shelter_manager && shelter.shelter_manager.id === user.id
        );

        if (userShelter) {
          setShelterId(userShelter.id);
          fetchAdoptionRequests(userShelter.id);
        } else {
          setError("Size ait barınak bulunamadı.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Hata:", err);
        setError("Barınak bilgisi alınırken bir hata oluştu.");
        setLoading(false);
      }
    };

    fetchUserShelter();
  }, [baseUrl]);

  const fetchAdoptionRequests = async (shelterIdParam) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/adoption-requests?populate[animal][populate][shelter]=true&populate[adopter]=true`
      );

      if (!response.ok) {
        throw new Error("Talepler alınamadı.");
      }

      const data = await response.json();

      const filteredRequests = data.data.filter(
        (request) => request.animal?.shelter?.id === shelterIdParam
      );

      const formattedRequests = filteredRequests.map((item) => ({
        id: item.id,
        documentId: item.documentId, // `documentId` kullanımı
        AdoptionRequestStatus: item.AdoptionRequestStatus || "Beklemede",
        AdoptionRequestDate: item.AdoptionRequestDate || "Bilinmiyor",
        animal: item.animal,
        adopter: item.adopter,
      }));

      setAdoptionRequests(formattedRequests);
      setLoading(false);
    } catch (err) {
      console.error("Talepler alınırken bir hata oluştu:", err);
      setError("Talepler alınırken bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  const updateRequestStatus = async (documentId, status) => {
    try {
      const response = await fetch(`${baseUrl}/api/adoption-requests/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            AdoptionRequestStatus: status,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Talep güncellenemedi. HTTP Kodu: ${response.status}, Mesaj: ${
            errorData?.error?.message || "Bilinmeyen hata"
          }`
        );
      }

      setAdoptionRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.documentId === documentId
            ? { ...request, AdoptionRequestStatus: status }
            : request
        )
      );

      setSuccess("Talep durumu başarıyla güncellendi.");
    } catch (err) {
      console.error("Talep durumu güncellenirken bir hata oluştu:", err);
      alert(`Talep durumu güncellenirken bir hata oluştu: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="adoption-requests">
      <h2>Gelen Sahiplenme Talepleri</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {adoptionRequests.length === 0 ? (
        <p className="no-requests">Henüz bir sahiplenme talebi bulunmamaktadır.</p>
      ) : (
        <div className="table-container">
          <table className="shelter-table">
            <thead>
              <tr>
                <th>Hayvan Adı</th>
                <th>Hayvan Türü</th>
                <th>Hayvan Yaşı</th>
                <th>Sağlık Durumu</th>
                <th>Renk</th>
                <th>Talep Durumu</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {adoptionRequests.map((request) => {
                const animal = request.animal || {};
                return (
                  <tr key={request.id}>
                    <td>{animal.AnimalName || "Bilinmiyor"}</td>
                    <td>{animal.AnimalType || "Bilinmiyor"}</td>
                    <td>{animal.AnimalAge || "Bilinmiyor"}</td>
                    <td>{animal.HealthStatus || "Bilinmiyor"}</td>
                    <td>{animal.Color || "Bilinmiyor"}</td>
                    <td>
                      <span className={`status-badge ${request.AdoptionRequestStatus?.toLowerCase()}`}>
                        {request.AdoptionRequestStatus}
                      </span>
                    </td>
                    <td className="button-group">
                      <button
                        className="approve-button"
                        onClick={() => updateRequestStatus(request.documentId, "Approved")}
                        disabled={request.AdoptionRequestStatus === "Approved"}
                      >
                        Onayla
                      </button>
                      <button
                        className="deny-button"
                        onClick={() => updateRequestStatus(request.documentId, "Denied")}
                        disabled={request.AdoptionRequestStatus === "Denied"}
                      >
                        Reddet
                      </button>
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

export default ShelterAdoptionRequests;
