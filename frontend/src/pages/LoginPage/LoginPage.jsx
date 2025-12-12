import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/authSlice';
import { Message } from 'primereact/message';
import InputForm from '../../components/InputForm/InputForm';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import Header from '../../components/Header/Header';
import './LoginPage.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [serverError, setServerError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validate = () => {
        let valid = true;
        if (!username.trim()) {
            setUsernameError('Логин обязателен');
            valid = false;
        } else setUsernameError('');
        if (!password) {
            setPasswordError('Пароль обязателен');
            valid = false;
        } else setPasswordError('');
        return valid;
    };

    const clearErrors = () => {
        setUsernameError('');
        setPasswordError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        try {
            const res = await fetch('http://localhost:8080/itmo_web_lab_4-0.0.1-SNAPSHOT-plain/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Неверный логин или пароль');
            }

            const { token } = await res.json();
            dispatch(login({ username, token }));
            localStorage.setItem('token', token);
            navigate('/main');
        } catch (err) {
            setServerError(err.message);
        }
    };

    return (
        <div className="main-container">
            <Header />
            <div className="form-graph-container login-centered">
                <InputForm onSubmit={handleSubmit} submitLabel="Войти">
                    <div className="form-block">
                        <label>Логин</label>
                        <InputText
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); clearErrors(); }}
                            placeholder="Введите логин"
                            className="login-input"
                        />
                        {usernameError && <small className="p-error">{usernameError}</small>}
                    </div>

                    <div className="form-block">
                        <label>Пароль</label>
                        <Password
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                clearErrors();
                            }}
                            placeholder="Введите пароль"
                            feedback={false}
                            toggleMask
                            inputClassName="login-input"
                        />
                        {passwordError && <small className="p-error">{passwordError}</small>}
                    </div>

                    {serverError && (
                        <div className="form-block error-block">
                            <Message severity="error" text={serverError}/>
                        </div>
                    )}
                </InputForm>
            </div>
        </div>
    );
}

export default LoginPage;