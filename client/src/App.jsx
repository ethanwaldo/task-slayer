import {
  BrowserRouter as Router,
  Routes, Route, Navigate
} from 'react-router-dom';
import Profile from "./Profile";

function InsideRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/profile" replace />} />
        <Route path="/profile" element={<Profile />} />
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