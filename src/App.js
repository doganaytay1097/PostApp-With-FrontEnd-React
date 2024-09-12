import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import User from "./components/User/User";
import Authentication from "./components/Authentication/Authentication";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/users/:userId" element={<User />} />
                    <Route path="/auth" element={
                        localStorage.getItem("currentUser") != null ? <Navigate to="/" /> : <Authentication />
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
