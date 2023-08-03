import './App.css';
import HomePage from './components/homepage/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/homepage/utilities/Navbar';
function App() {
  return (
    <div>
      <Navbar />

      <HomePage />

    </div>
  );
}

export default App;
