import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/main" element={<MainPage />} />
            </Routes>
        </Router>
    );
}

export default App
