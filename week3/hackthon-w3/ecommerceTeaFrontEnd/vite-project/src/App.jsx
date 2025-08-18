import {
   
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AddTaskPage from "./pages/AddTaskPage";
import Navbar from "./components/Navbar";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import CollectionsPage from "./pages/CollectionsPage";
import Footer from "./components/Footer";


function App() {
  const {isAuthenticated, setIsAuthenticated} = useAuth()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      {/* <Router> */}
      {/* {isAuthenticated && <Navbar />} */}
      <Navbar />
      <Routes>
        <Route path="/" element={<CollectionsPage />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />
        <Route
          path="/signUp"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/addTask"
          element={isAuthenticated ? <AddTaskPage /> : <Navigate to="/login" />}
        />
      </Routes>
      {/* </Router> */}
      <Footer />
    </>
  );
}

export default App;
