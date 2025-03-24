import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import NavBar from "./components/NavBar"
import PublicRoute from "./components/guards/PublicRoutes"
import ProtectedRoute from "./components/guards/ProtectedRoutes"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Create from "./pages/Create"
import Catalog from "./pages/Catalog"
import Edit from "./pages/Edit"
import Logout from "./pages/Logout"
import "./App.css"
import { AuthProvider } from "./components/context/AuthenticationContex"
import Footer from "./components/Footer"
import OutfitDetails from "./pages/OutfitDetails"

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
      </Routes>
      <Footer />
    </>
  )
}

export default App
