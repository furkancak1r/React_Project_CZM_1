import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminPanel from "./components/admin/adminPanel/adminPanel";
import HomePageAdmin from "./components/admin/homePage/homePageAdmin"; // Burayı değiştirdim
import HomePage from "./components/user/homePage/HomePage";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/homepage" element={<HomePageAdmin />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
