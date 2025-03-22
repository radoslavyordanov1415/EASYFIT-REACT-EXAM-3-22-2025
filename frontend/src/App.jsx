import { BrowserRouter as Router, Route, Routes } from "react-router-dom"


import NavBar from "./components/NavBar"


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
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<Create />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
