import './App.css';
import HomePage from './components/homepage/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './utilities/user/Navbar';
import NavbarAdmin from './utilities/admin/navbarAdmin';

function App() {
  const isAdmin = true; // Admin ile giriş yapılıp yapılmadığını belirleyen değişken

  return (
    <div>
      {isAdmin ? <NavbarAdmin /> : <Navbar />}

      <HomePage />
    </div>
  );
}

export default App;
