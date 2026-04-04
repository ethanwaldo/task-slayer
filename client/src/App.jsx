import {
  BrowserRouter as Router,
  Routes, Route, Navigate
} from 'react-router-dom';
import ClassPage from "./ClassPage";

function InsideRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/class" replace />} />
        <Route path="/class" element={<ClassPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <InsideRouter />
    </Router>
  );
}

export default App;