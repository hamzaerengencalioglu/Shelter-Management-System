import React, { useState, useEffect } from "react";
import "./Style.css";

function AnimalList() {
  const [animals, setAnimals] = useState([]);
  const [shelterId, setShelterId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const baseUrl = "http://localhost:1337";

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

  useEffect(() => {
    const fetchUserShelter = async (userId) => {
      try {
        const response = await fetch(`${baseUrl}/api/shelters?populate=shelter_manager`);
        if (!response.ok) {
          throw new Error("Barınak bilgileri alınamadı!");
        }
        const data = await response.json();
        const userShelter = data.data.find(
          (shelter) =>
            shelter.shelter_manager && shelter.shelter_manager.id === userId
        );
        if (userShelter) {
          setShelterId(userShelter.id);
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

    const fetchAnimals = async (shelterId) => {
      try {
        let url = `${baseUrl}/api/animals?populate=*&filters[shelter][id][$eq]=${shelterId}`;

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

    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        setError("Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }

      await fetchUserShelter(user.id);
      if (shelterId) {
        await fetchAnimals(shelterId);
      }
    };

    fetchData();
  }, [shelterId, nameFilter, typeFilter, ageFilter, healthFilter, colorFilter]);

  // Filtreleri sıfırla
  const handleFilterReset = () => {
    setNameFilter("");
    setTypeFilter("");
    setAgeFilter("");
    setHealthFilter("");
    setColorFilter("");
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="animal-list">
      <h2>Barınaktaki Hayvanlar</h2>

      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            placeholder="İsme göre ara"
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
            placeholder="Yaş"
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
            </tr>
          </thead>
          <tbody>
            {animals.map((animal) => {
              const imageUrl = animal.AnimalImage?.url
                ? `${baseUrl}${animal.AnimalImage.url}`
                : null;

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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnimalList;
