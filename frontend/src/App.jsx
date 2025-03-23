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
import MannequinProvider from "./components/Mannequin/hooks/use-mannequin-context"
import useMannequinState from "./components/Mannequin/hooks/use-mannequin-state"
import Footer from "./components/Footer"

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

// This component is rendered after Router context is established
function AppContent() {
  // Now this hook is called within Router context
  const mannequinState = useMannequinState()

  return (
    <MannequinProvider value={mannequinState}>
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />

        {/* Auth routes - redirect to home if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected routes - require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:outfitId" element={<Edit />} />
          <Route path="/catalog" element={<Catalog />} />
        </Route>
      </Routes>
      <Footer />
    </MannequinProvider>
  )
}

export default App

