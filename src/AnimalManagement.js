import React, { useState, useEffect, useRef } from "react";
import "./Style.css";

function AnimalManagement() {
  const [animalName, setAnimalName] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [animalImage, setAnimalImage] = useState(null);
  const [healthStatus, setHealthStatus] = useState("");
  const [color, setColor] = useState("");
  const [shelterId, setShelterId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const animalTypes = ["Kedi", "Köpek"];
  const healthStatuses = ["Sağlıklı", "Hasta", "Tedavi Altında"];
  const colors = ["Siyah", "Beyaz", "Turuncu", "Gri", "Kahverengi", "Çok Renkli"];
  const fileInputRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      fetchUserShelter(user.id);
    } else {
      setError("Barınak bilgisi bulunamadı. Lütfen oturum açın.");
    }
  }, []);

  const fetchUserShelter = async (userId) => {
    try {
      const response = await fetch(
        `http://34.107.58.215:1337/api/shelters?populate=shelter_manager`
      );
      if (!response.ok) {
        throw new Error("Barınak bilgileri alınamadı!");
      }
      const data = await response.json();
      const userShelter = data.data.find(
        (shelter) => shelter.shelter_manager && shelter.shelter_manager.id === userId
      );
      if (userShelter) {
        setShelterId(userShelter.id);
      } else {
        setError("Size ait barınak bulunamadı.");
      }
    } catch (err) {
      console.error("Hata:", err);
      setError("Barınak bilgisi alınırken bir hata oluştu.");
    }
  };

  const handleAnimalSubmit = async (e) => {
    e.preventDefault();

    if (!animalType || !animalAge || !healthStatus || !color || !animalImage) {
      setError("Lütfen tüm alanları doldurun.");
      setSuccess("");
      return;
    }

    if (!shelterId) {
      setError("Barınak bilgisi eksik. Lütfen tekrar oturum açın.");
      setSuccess("");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", animalImage);

      const uploadResponse = await fetch("http://34.107.58.215:1337/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Fotoğraf yüklenirken bir hata oluştu.");
      }

      const uploadResult = await uploadResponse.json();
      const imageId = uploadResult[0]?.id;

      if (!imageId) {
        throw new Error("Fotoğraf yüklenemedi.");
      }

      const payload = {
        data: {
          AnimalName: animalName || null,
          AnimalType: animalType,
          AnimalAge: parseFloat(animalAge),
          HealthStatus: healthStatus,
          Color: color,
          AnimalAdopted: false,
          shelter: shelterId, // Sadece shelter ID'sini göndermek yeterli
          AnimalImage: imageId,
        },
      };

      const animalResponse = await fetch("http://34.107.58.215:1337/api/animals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (animalResponse.ok) {
        const animalResult = await animalResponse.json();
        console.log("Hayvan eklendi:", animalResult);
        setSuccess("Hayvan başarıyla eklendi!");
        setError("");

        setAnimalName("");
        setAnimalType("");
        setAnimalAge("");
        setAnimalImage(null);
        setHealthStatus("");
        setColor("");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const errorResult = await animalResponse.json();
        setError(
          errorResult.error?.message || "Hayvan eklenemedi. Lütfen tekrar deneyin."
        );
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
      <h2>Hayvan Ekle/Güncelle</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleAnimalSubmit}>
        <div className="form-group">
          <label>Hayvan Adı:</label>
          <input
            type="text"
            placeholder="Hayvan adını girin"
            value={animalName}
            onChange={(e) => setAnimalName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Hayvan Türü:</label>
          <select
            value={animalType}
            onChange={(e) => setAnimalType(e.target.value)}
            required
          >
            <option value="">Tür Seçin</option>
            {animalTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Hayvan Yaşı:</label>
          <input
            type="number"
            placeholder="Hayvan yaşını girin"
            value={animalAge}
            onChange={(e) => setAnimalAge(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Sağlık Durumu:</label>
          <select
            value={healthStatus}
            onChange={(e) => setHealthStatus(e.target.value)}
            required
          >
            <option value="">Sağlık Durumu Seçin</option>
            {healthStatuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Renk:</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          >
            <option value="">Renk Seçin</option>
            {colors.map((col, index) => (
              <option key={index} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Hayvan Resmi:</label>
          <input
            type="file"
            ref={fileInputRef} // Dosya seçimi sıfırlamak için ref ekleniyor
            onChange={(e) => setAnimalImage(e.target.files[0])}
            accept="image/*"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Hayvan Ekle
        </button>
      </form>
    </div>
  );
}

export default AnimalManagement;
