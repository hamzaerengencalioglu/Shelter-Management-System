import React, { useState, useEffect } from "react";
import "./Style.css";

function AnimalSearch({ baseUrl }) {
  const [animals, setAnimals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [adoptionSuccess, setAdoptionSuccess] = useState("");
  const [adoptionError, setAdoptionError] = useState("");

  // Filtre state'leri
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [healthFilter, setHealthFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");

  // Sabit değerler
  const animalTypes = ["Kedi", "Köpek"];
  const healthStatuses = ["Sağlıklı", "Hasta", "Tedavi Altında"];
  const colors = ["Siyah", "Beyaz", "Turuncu", "Gri", "Kahverengi", "Çok Renkli"];

  // Resim URL'sini getiren yardımcı fonksiyon
  const getAnimalImageUrl = (animal) => {
    return animal.AnimalImage?.url ? `${baseUrl}${animal.AnimalImage.url}` : null;
  };

  // Tüm hayvanları getir (sadece talep yok olanlar)
  const fetchAnimals = async () => {
    try {
      let url = `${baseUrl}/api/animals?populate=*&filters[AnimalAdopted][$eq]=false`;

      if (nameFilter) {
        url += `&filters[AnimalName][$containsi]=${nameFilter}`;
      }
      if (typeFilter) {
        url += `&filters[AnimalType][$eq]=${typeFilter}`;
      }
      if (ageFilter) {
        url += `&filters[AnimalAge][$eq]=${ageFilter}`;
      }
      if (healthFilter) {
        url += `&filters[HealthStatus][$eq]=${healthFilter}`;
      }
      if (colorFilter) {
        url += `&filters[Color][$eq]=${colorFilter}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Hayvan bilgileri alınamadı.");
      }
      const data = await response.json();
      setAnimals(data.data);
      setLoading(false);
    } catch (err) {
      console.error("Hata:", err);
      setError("Hayvan bilgileri alınırken bir hata oluştu.");
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde hayvanları getir
  useEffect(() => {
    fetchAnimals();
  }, [nameFilter, typeFilter, ageFilter, healthFilter, colorFilter]);

  // Filtreleri sıfırlama
  const handleFilterReset = () => {
    setNameFilter("");
    setTypeFilter("");
    setAgeFilter("");
    setHealthFilter("");
    setColorFilter("");
  };

  const handleAdoptionRequest = async (animalId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        setAdoptionError("Sahiplenme talebi oluşturmak için giriş yapmalısınız!");
        return;
      }

      const response = await fetch(
        `${baseUrl}/api/adoption-requests?filters[adopter][id][$eq]=${user.id}&filters[animal][id][$eq]=${animalId}`
      );

      if (!response.ok) {
        throw new Error("Sahiplenme talebi kontrol edilemedi.");
      }

      const existingRequests = await response.json();
      if (existingRequests.data.length > 0) {
        setAdoptionError("Bu hayvan için zaten bir sahiplenme talebiniz var.");
        return;
      }

      const adoptionResponse = await fetch(`${baseUrl}/api/adoption-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            animal: animalId,
            adopter: user.id,
            AdoptionRequestStatus: "Pending",
            AdoptionRequestDate: new Date().toISOString(),
          },
        }),
      });

      if (!adoptionResponse.ok) {
        throw new Error("Sahiplenme talebi oluşturulamadı.");
      }

      setAdoptionSuccess("Sahiplenme talebiniz başarıyla oluşturuldu!");
      setAdoptionError("");

      fetchAnimals();
    } catch (err) {
      console.error("Hata:", err);
      setAdoptionError("Sahiplenme talebi oluşturulurken bir hata oluştu.");
      setAdoptionSuccess("");
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="animal-search">
      <h2>Sahiplenilebilir Hayvanlar</h2>

      {adoptionSuccess && <p className="success-message">{adoptionSuccess}</p>}
      {adoptionError && <p className="error-message">{adoptionError}</p>}

      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Hayvan adına göre ara"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">Tüm Türler</option>
            {animalTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Yaşa göre ara"
            value={ageFilter}
            min="0"
            onChange={(e) => setAgeFilter(e.target.value)}
          />
          <select value={healthFilter} onChange={(e) => setHealthFilter(e.target.value)}>
            <option value="">Tüm Sağlık Durumları</option>
            {healthStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select value={colorFilter} onChange={(e) => setColorFilter(e.target.value)}>
            <option value="">Tüm Renkler</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
          <button onClick={handleFilterReset} className="reset-button">
            Filtreleri Sıfırla
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="shelter-table">
          <thead>
            <tr>
              <th>Resim</th>
              <th>Ad</th>
              <th>Tür</th>
              <th>Yaş</th>
              <th>Sağlık Durumu</th>
              <th>Renk</th>
              <th>Barınak Adı</th>
              <th>Barınak Adresi</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {animals.map((animal) => {
              const imageUrl = getAnimalImageUrl(animal);
              const shelterName = animal.shelter?.ShelterName || "Barınak Adı Yok";
              const shelterLocation = animal.shelter?.ShelterLocation || "Adres Yok";

              return (
                <tr key={animal.id}>
                  <td>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={animal.AnimalName || "Hayvan Resmi"}
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    ) : (
                      "Resim Yok"
                    )}
                  </td>
                  <td>{animal.AnimalName || "İsimsiz"}</td>
                  <td>{animal.AnimalType}</td>
                  <td>{animal.AnimalAge}</td>
                  <td>{animal.HealthStatus}</td>
                  <td>{animal.Color}</td>
                  <td>{shelterName}</td>
                  <td>{shelterLocation}</td>
                  <td>
                    <button
                      className="adopt-button"
                      onClick={() => handleAdoptionRequest(animal.id)}
                    >
                      Sahiplen
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnimalSearch;
