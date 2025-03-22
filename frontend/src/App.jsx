import { BrowserRouter as Router, Route, Routes } from "react-router-dom"


import NavBar from "./components/NavBar"
import { AuthProvider } from "./components/context/authContext"
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


function App() {


  return (
    <div className="App">
      <Router>
        <AuthProvider>
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
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
