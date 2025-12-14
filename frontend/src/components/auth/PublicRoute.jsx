import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const PublicRoute = ({ children }) => {
    const token = useSelector(state => state.auth.token);
    return token ? <Navigate to="/main" replace /> : children;
};
