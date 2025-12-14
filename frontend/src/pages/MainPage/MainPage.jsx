import {useState, useRef, useEffect, Suspense} from 'react';
import Header from '../../components/Header/Header';
import InputForm from '../../components/InputForm/InputForm';
import { XField, YField, ZField, RField } from '../../components/fields';
import GraphCanvas from '../../components/graphcanvas/GraphCanvas';
import ResultsTable from '../../components/resultstable/ResultsTable';
import './MainPage.css';
import { Message } from 'primereact/message';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from "primereact/button";
import {logout} from "../../store/authSlice.js";
import {useNavigate} from "react-router-dom";

function MainPage() {
    const [x, setX] = useState(null);
    const [y, setY] = useState('');
    const [z, setZ] = useState([]);
    const [r, setR] = useState(3);
    const [points, setPoints] = useState([]);
    const [serverError, setServerError] = useState(null);
    const formRef = useRef(null);
    const username = useSelector(state => state.auth.user);
    const token = useSelector(state => state.auth.token);
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    useEffect(() => {
        loadPoints().catch(err => {
            console.error('Ошибка загрузки точек:', err);
        });
    }, []);

    const loadPoints = async () => {
        try {
            const res = await fetch(
                //"http://localhost:8080/itmo_web_lab_4-0.0.1-SNAPSHOT-plain/api/points",
                "http://127.0.0.1:28002/itmo_web_lab_4-0.0.1-SNAPSHOT-plain/api/points",
                { headers: authHeaders }
            );

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || `HTTP ${res.status}`);
            }

            const data = await res.json();
            setPoints(data.reverse());
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);

        if (formRef.current && !formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }

        if (x === null || y === '' || z.length === 0 || !r) {
            return;
        }

        if (x < -3 || x > 5 || y < -5 || y > 5 || z.some(v => v < -4 || v > 4) || r < 1 || r > 4) {
            return;
        }

        const payload = {
            x: Number(x),
            y: Number(y),
            z: z,
            r: Number(r)
        };

        try {
            //const res = await fetch('http://localhost:8080/itmo_web_lab_4-0.0.1-SNAPSHOT-plain/api/points', {
            const res = await fetch('http://127.0.0.1:28002/itmo_web_lab_4-0.0.1-SNAPSHOT-plain/api/points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders,},
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                let errorMessage = 'Ошибка сервера';
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    // если JSON не распарсился
                }
                throw new Error(errorMessage);
            }

            const newPoints = await res.json();

            setPoints(prev => [...newPoints.reverse(), ...prev]);

        } catch (err) {
            setServerError(err.message || 'Неизвестная ошибка');
            console.error(err);
        }
    };

    const validatePayload = (payload) => {
        if (payload.x === null || payload.x === undefined || Number.isNaN(payload.x)) {
            return "Не задан X";
        }
        if (payload.y === null || payload.y === undefined || payload.y === "" || Number.isNaN(payload.y)) {
            return "Не задан Y";
        }
        if (!Array.isArray(payload.z) || payload.z.length === 0) {
            return "Не выбран Z";
        }
        if (!payload.r && payload.r !== 0) {
            return "Не задан R";
        }

        if (payload.x < -3 || payload.x > 5) return "X должен быть в диапазоне [-3; 5]";
        if (payload.y < -5 || payload.y > 5) return "Y должен быть в диапазоне [-5; 5]";
        if (payload.z.some(v => v < -4 || v > 4)) return "Z должен быть в диапазоне [-4; 4]";
        if (payload.r < 1 || payload.r > 4) return "R должен быть в диапазоне [1; 4]";

        return null;
    };

    const submitPoint = async (payload) => {
        const err = validatePayload(payload);
        if (err) {
            setServerError(err);
            throw new Error(err);
        }

        const res = await fetch(
            //"http://localhost:8080/itmo_web_lab_4-0.0.1-SNAPSHOT-plain/api/points",
            "http://127.0.0.1:28002/itmo_web_lab_4-0.0.1-SNAPSHOT-plain/api/points",
            {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            const raw = await res.text();
            let msg = "Ошибка сервера";
            try {
                const json = raw ? JSON.parse(raw) : null;
                msg = json?.message || json?.error || msg;
            } catch {
                if (raw?.includes("Access Denied")) msg = "Доступ запрещён";
            }

            setServerError(msg);
            throw new Error(msg);
        }

        return await res.json();
    };

    const handlePointClickFromGraph = async ({ x: gx, y: gy, z: gz }) => {
        setServerError(null);

        const payload = {
            x: Number(gx),
            y: Number(gy),
            z: [gz],
            r: Number(r),
        };

        try {
            const newPoints = await submitPoint(payload);
            setPoints((prev) => [...newPoints.reverse(), ...prev]);
        } catch (err) {
            setServerError(err?.message || "Неизвестная ошибка");
        }
    };

    const handleRefresh = () => loadPoints();

    const handleClear = async () => {
        try {
            const res = await fetch(
                //"http://localhost:8080/itmo_web_lab_4-0.0.1-SNAPSHOT-plain/api/points",
                "http://127.0.0.1:28002/itmo_web_lab_4-0.0.1-SNAPSHOT-plain/api/points",
                { method: "DELETE", headers: authHeaders }
            );

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || `HTTP ${res.status}`);
            }

            setPoints([]);
        } catch (err) {
            console.error("Ошибка очистки:", err);
        }
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="main-container">
            <Header/>

            <div className="header user-header">  {}
                <Suspense fallback={<div
                    style={{width: '100%', height: '50px', background: '#a341a1', borderRadius: '4px'}}></div>}>
                    <span className="username-display">
                        Пользователь: {username || 'Неизвестный'}
                    </span>
                    <Button label="Выход" onClick={handleLogout} className="ui-button logout-button" style={{
                        textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}/>
                </Suspense>
            </div>

            <div className="form-graph-container">
                <InputForm onSubmit={handleSubmit} ref={formRef}>
                    <XField onValueChange={setX}/>
                    <YField onValueChange={setY}/>
                    <ZField onValueChange={setZ}/>
                    <RField onValueChange={setR}/>

                    {}
                    {serverError && (
                        <div className="form-block error-block">
                            <Message severity="error" text={serverError}/>
                        </div>
                    )}
                </InputForm>

                <GraphCanvas r={r} points={points} onPointClick={handlePointClickFromGraph}/>
            </div>

            <div className="results-container">
                <ResultsTable points={points} onRefresh={handleRefresh} onClear={handleClear}/>
            </div>
        </div>
    );
}

export default MainPage;
