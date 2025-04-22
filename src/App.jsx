import AllRoutes from "./components/AllRoutes";
import { useEffect } from 'react';
import './App.css'

function App() {
  useEffect(() => {
    document.title = 'KTPM 2025';
  }, [])
  return (
    <AllRoutes/>
  );
}

export default App
