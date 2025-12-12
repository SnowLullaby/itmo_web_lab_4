import { Provider } from 'react-redux';
import { store } from './store/store';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import MainPage from './pages/MainPage/MainPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
    return (
        <Provider store={store}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/main" element={
                    <ProtectedRoute>
                        <MainPage />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Provider>
    );
}

export default App;
