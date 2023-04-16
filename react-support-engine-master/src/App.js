import React from "react";
import { Routes, Route } from "react-router-dom"
import Home from './Home/HomePage';
import AdminPage from "./components/AdminPage";
import AgentPage from "./components/AgentPage";
import CustomerPage from "./components/Customerpage"

const App = () => {
    return (
        <div >
            <Routes>
                <Route path="/" element={<Home />} exact />
                <Route path="/SupportEngine/AdminPage" element={<AdminPage />} />
                <Route path="/SupportEngine/AgentPage" element={<AgentPage />} />
                <Route path="/SupportEngine/Customerpage" element={<CustomerPage />} />
            </Routes>

        </div>
    );
};

export default App;