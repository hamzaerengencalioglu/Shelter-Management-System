import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import ShelterDashboard from "./ShelterDashboard";
import AnimalManagement from "./AnimalManagement";
import AnimalList from "./AnimalList";
import AnimalSearch from "./AnimalSearch";
import AdoptionRequests from "./ShelterAdoptionRequests"; // Yeni bileşeni ekleyin
import AdopterAdoptionRequests from './AdopterAdoptionRequests';
import AdopterDashboard from './AdopterDashboard';
import AdminDashboard from "./AdminDashboard";
import AddShelter from "./AddShelter";
import AddShelterManager from "./AddShelterManager";
import "./Style.css";

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setUserRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul className="navbar">
              {!userRole && (
                <>
                  <li>
                    <Link to="/search">Hayvan Ara</Link>
                  </li>
                  <li>
                    <Link to="/register">Kayıt Ol</Link>
                  </li>
                  <li>
                    <Link to="/login">Giriş Yap</Link>
                  </li>
                </>
              )}

              {userRole === "Adopter" && (
                <>
                  <li>
                    <Link to="/adopter-dashboard">Profilim</Link>
                  </li>
                  <li>
                    <Link to="/search">Hayvan Ara</Link>
                  </li>
                  <li>
                    <Link to="/adoption-requests">Sahiplenme Taleplerim</Link>
                  </li>
                </>
              )}

              {userRole === "ShelterManager" && (
                <>
                  <li>
                    <Link to="/shelter-dashboard">Barınak Yönetimi</Link>
                  </li>
                  <li>
                    <Link to="/animal-management">Hayvan Ekle</Link>
                  </li>
                  <li>
                    <Link to="/animal-list">Hayvanları Görüntüle</Link>
                  </li>
                  <li>
                    <Link to="/adoption-requests">Gelen Talepler</Link> {/* Yeni Menü */}
                  </li>
                </>
              )}

              {userRole === "Admin" && (
                <>
                  <li>
                    <Link to="/add-shelter">Barınak Ekle</Link>
                  </li>
                  <li>
                    <Link to="/add-shelter-manager">Yetkili Ekle</Link>
                  </li>
                </>
              )}

              {userRole && (
                <li>
                  <Link to="/" onClick={handleLogout}>
                    Çıkış Yap
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<AnimalSearch baseUrl="http://localhost:1337" />} />

            {userRole === "ShelterManager" ? (
              <>
                <Route path="/shelter-dashboard" element={<ShelterDashboard />} />
                <Route path="/animal-management" element={<AnimalManagement />} />
                <Route path="/animal-list" element={<AnimalList />} />
                <Route path="/adoption-requests" element={<AdoptionRequests baseUrl="http://localhost:1337" />} /> {/* Yeni rota */}
                <Route path="/" element={<Navigate to="/shelter-dashboard" replace />} />
              </>
            ) : userRole === "Adopter" ? (
              <>
                <Route path="/adopter-dashboard" element={<AdopterDashboard />} />
                <Route path="/" element={<Navigate to="/adopter-dashboard" replace />} />
                <Route path="/adoption-requests" element={<AdopterAdoptionRequests />} />
              </>
            ) : userRole === "Admin" ? (
              <>
                
                <Route path="/add-shelter" element={<AddShelter />} />
                <Route path="/add-shelter-manager" element={<AddShelterManager />} />
                <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/search" replace />} />
                <Route path="/shelter-dashboard" element={<Navigate to="/search" replace />} />
                <Route path="/animal-management" element={<Navigate to="/search" replace />} />
                <Route path="/animal-list" element={<Navigate to="/search" replace />} />
                <Route path="/dashboard" element={<Navigate to="/search" replace />} />
              </>
            )}

            <Route path="*" element={<Navigate to="/search" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;