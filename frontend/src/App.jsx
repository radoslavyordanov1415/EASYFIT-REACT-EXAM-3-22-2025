import NotFound from "./pages/NotFound.jsx"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import Profile from "./pages/Profile"
import Create from "./pages/Create"
import Edit from "./pages/Edit"
import Catalog from "./pages/Catalog"
import OutfitDetails from "./pages/OutfitDetails"
import About from "./pages/About"

import ProtectedRoute from "./components/guards/ProtectedRoutes"
import PublicRoute from "./components/guards/PublicRoutes"
import { AuthProvider } from "./components/context/AuthenticationContex"

import "./App.css"
import Community from "./components/Mannequin/Community/Community"
function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </div>
  )
}

function AppContent() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/community" element={<Community />} />


        {/* Auth routes */}
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:outfitId" element={<Edit />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/outfit/:outfitId" element={<OutfitDetails />} />

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
