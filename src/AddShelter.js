import React, { useState } from "react";
import "./Style.css";

function AddShelter() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contactNumber: "",
    capacity: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://34.107.58.215:1337/api/shelters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            ShelterName: formData.name,
            ShelterLocation: formData.location,
            ShelterContactNumber: formData.contactNumber,
            ShelterCapacity: parseInt(formData.capacity),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Barınak eklenirken bir hata oluştu");
      }

      setSuccess("Barınak başarıyla eklendi!");
      setFormData({ name: "", location: "", contactNumber: "", capacity: "" });
      setError("");
    } catch (err) {
      setError("Barınak eklenirken bir hata oluştu: " + err.message);
      setSuccess("");
    }
  };

  return (
    <div className="form-container">
      <h2>Barınak Ekle</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Barınak Adı:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Adres:</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Telefon:</label>
          <input
            type="tel"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Kapasite:</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Barınak Ekle
        </button>
      </form>
    </div>
  );
}

export default AddShelter; 