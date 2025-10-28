import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/loadingSpinner/LoadingSpinner.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import { useUserStore } from "./stores/useUserStore.js";

function App() {
  const {user, checkAuth, checkingAuth} = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return <LoadingSpinner/>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Background Gradient*/}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className='absolute top-0 left-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top, rgba(16,185,129,0.3)_0%, rgba(10,80,60,0.2)_45%, rgba(0,0,0,0.1)_100%)]'/>
        </div>
      </div>

      <div className='relative z-50 pt-20'>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={!user ? <SignUpPage/> : <Navigate to="/"/>}/>
        <Route path="/login" element={!user ? <LoginPage/> : <Navigate to="/"/>}/>
      </Routes>
    </div>
    <Toaster/>
  </div>
  );

}

export default App
