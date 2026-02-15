import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ContentPage from "./pages/ContentPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:id" element={<ContentPage />} />
    </Routes>
  );
}

export default App;
