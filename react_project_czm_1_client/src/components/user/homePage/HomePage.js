import React from "react";
import Navbar from "../navbar/navbar";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "false") {
      // /admin'e yönlendir
      navigate("/admin");
    } else {
      // /admin/homepage'e yönlendir
      navigate("/admin/homepage");
    }
  };

  return (
    <div>
      <Navbar />
      <h5 onClick={handleClick}>
        Go to Admin Page
      </h5>
    </div>
  );
}

export default HomePage;
