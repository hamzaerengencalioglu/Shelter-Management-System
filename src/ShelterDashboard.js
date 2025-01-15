import React, { useState, useEffect } from "react";
import "./Style.css";

function ShelterDashboard() {
  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    capacity: "",
  });

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          console.error("Giriş yapan kullanıcı bilgisi bulunamadı!");
          return;
        }

        const url = "http://34.107.58.215:1337/api/shelters?populate=shelter_manager";

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Barınak bilgileri alınamadı!");
        }

        const data = await response.json();
        const filteredShelters = data.data.filter(
          (shelter) =>
            shelter.shelter_manager &&
            shelter.shelter_manager.id === user.id
        );

        setShelters(filteredShelters);
      } catch (error) {
        console.error("Barınak bilgileri alınamadı:", error);
      }
    };

    fetchShelters();
  }, []);

  const handleEdit = (shelter) => {
    setSelectedShelter(shelter);
    setFormData({
      name: shelter.ShelterName,
      address: shelter.ShelterLocation,
      phone: shelter.ShelterContactNumber,
      capacity: shelter.ShelterCapacity,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://34.107.58.215:1337/api/shelters/${selectedShelter.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ShelterName: formData.name,
            ShelterLocation: formData.address,
            ShelterContactNumber: formData.phone,
            ShelterCapacity: formData.capacity,
          }),
        }
      );

      if (response.ok) {
        setShelters((prevShelters) =>
          prevShelters.map((shelter) =>
            shelter.id === selectedShelter.id
              ? { ...shelter, attributes: { ...formData } }
              : shelter
          )
        );
        setSelectedShelter(null);
        alert("Barınak bilgileri başarıyla güncellendi!");
      } else {
        alert("Güncelleme sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.error("Barınak bilgileri güncellenemedi:", error);
    }
  };

  return (
    <div className="shelter-dashboard">
      <h1 className="dashboard-title">Barınak Yönetim Paneli</h1>
      {shelters.length === 0 ? (
        <p className="no-shelter-message">Yükleniyor veya hiçbir barınak bulunamadı...</p>
      ) : (
        <div className="table-container">
          <table className="shelter-table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Adres</th>
                <th>Telefon</th>
                <th>Kapasite</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {shelters.map((shelter) => (
                <tr key={shelter.id}>
                  <td>{shelter.ShelterName}</td>
                  <td>{shelter.ShelterLocation}</td>
                  <td>{shelter.ShelterContactNumber}</td>
                  <td>{shelter.ShelterCapacity}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(shelter)}
                    >
                      Düzenle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedShelter && (
        <div className="edit-form-container">
          <h2>{selectedShelter.ShelterName} için Bilgileri Güncelle</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Ad:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Adres:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Telefon:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Kapasite:</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="submit-button">
                Güncelle
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setSelectedShelter(null)}
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

export default ShelterDashboard;
