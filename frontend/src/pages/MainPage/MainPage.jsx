import { useState, useRef, useEffect } from 'react';
import Header from '../../components/Header/Header';
import InputForm from '../../components/InputForm/InputForm';
import { XField, YField, ZField, RField } from '../../components/fields';
import GraphCanvas from '../../components/graphcanvas/GraphCanvas';
import ResultsTable from '../../components/resultstable/ResultsTable';
import './MainPage.css';
import { Message } from 'primereact/message';

function MainPage() {
    const [x, setX] = useState(null);
    const [y, setY] = useState('');
    const [z, setZ] = useState([]);
    const [r, setR] = useState(3);
    const [points, setPoints] = useState([]);
    const [serverError, setServerError] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        loadPoints().catch(err => {
            console.error('Ошибка загрузки точек:', err);
        });
    }, []);

    const loadPoints = async () => {
        try {
            const res = await fetch('http://localhost:8080/itmo_web_lab_4-0.0.1-SNAPSHOT-plain/api/points');
            if (!res.ok) throw new Error('Не удалось загрузить точки');
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
            const res = await fetch('http://localhost:8080/itmo_web_lab_4-0.0.1-SNAPSHOT-plain/api/points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    const handleRefresh = () => loadPoints();

    const handleClear = async () => {
        try {
            await fetch('http://localhost:8080/itmo_web_lab_4-0.0.1-SNAPSHOT-plain/api/points', { method: 'DELETE' });
            setPoints([]);
        } catch (err) {
            console.error('Ошибка очистки:', err);
        }
    };

    const handleGraphClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    return (
        <div className="main-container">
            <Header />

            <div className="form-graph-container">
                <InputForm onSubmit={handleSubmit} ref={formRef}>
                    <XField onValueChange={setX} />
                    <YField onValueChange={setY} />
                    <ZField onValueChange={setZ} />
                    <RField onValueChange={setR} />

                    {}
                    {serverError && (
                        <div className="form-block error-block">
                            <Message severity="error" text={serverError} />
                        </div>
                    )}
                </InputForm>

                <GraphCanvas r={r} points={points} onGraphClick={handleGraphClick} />
            </div>

            <div className="results-container">
                <ResultsTable
                    points={points}
                    onRefresh={handleRefresh}
                    onClear={handleClear}
                />
            </div>
        </div>
    );
}

export default MainPage;
