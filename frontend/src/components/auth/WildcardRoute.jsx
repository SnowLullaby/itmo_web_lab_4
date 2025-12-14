import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const WildcardRoute = () => {
    const token = useSelector(state => state.auth.token);
    return <Navigate to={token ? "/main" : "/login"} replace />;
};
