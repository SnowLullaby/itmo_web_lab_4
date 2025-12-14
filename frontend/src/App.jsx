import { Provider } from 'react-redux';
import { store } from './store/store';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import MainPage from './pages/MainPage/MainPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';
import { WildcardRoute } from './components/auth/WildcardRoute';

function App() {
    return (
        <Provider store={store}>
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                } />
                <Route path="/main" element={
                    <ProtectedRoute>
                        <MainPage />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<WildcardRoute />} />
            </Routes>
        </Provider>
    );
}

export default App;
