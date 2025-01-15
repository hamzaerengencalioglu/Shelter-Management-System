import React from "react";
import { Link } from "react-router-dom";
import "./Style.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h2>Admin Paneli</h2>
      <div className="admin-menu">
        <Link to="/add-shelter" className="admin-menu-item">
          Barınak Ekle
        </Link>
        <Link to="/add-shelter-manager" className="admin-menu-item">
          Barınak Yetkilisi Ekle
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard; 