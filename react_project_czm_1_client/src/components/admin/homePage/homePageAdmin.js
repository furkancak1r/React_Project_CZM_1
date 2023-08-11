import React, { useEffect } from "react";
import { Link } from "react-router-dom"; // Eğer projenizde react-router kullanıyorsanız
import NavbarAdmin from "../navbar/navbarAdmin";
import { useNavigate } from "react-router-dom";

function HomePageAdmin() {
  let isLoggedIn = localStorage.getItem("isLoggedIn");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin");
    }
  }, [isLoggedIn]);
  const handleClick = () => {
    localStorage.setItem("isLoggedIn", false);
    navigate("/homepage");
  };
  if (isLoggedIn) {
    return (
      <div>
        <NavbarAdmin />
        <Link to="/">Go to User Page</Link>
        <h5
          onClick={handleClick}
          style={{
           maxWidth: "80px",
            cursor: "pointer",
          }}
        >
          Log out
        </h5>
      </div>
    );
  } else {
    return null;
  }
}

export default HomePageAdmin;
