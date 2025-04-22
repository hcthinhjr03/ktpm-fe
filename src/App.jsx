import AllRoutes from "./components/AllRoutes";
import { useEffect } from 'react';
import './App.css'

function App() {
  useEffect(() => {
    document.title = 'Internet Of Things';
  }, [])
  return (
    <AllRoutes/>
  );
}

export default App
