import {useState, useRef, Suspense} from 'react';
import Header from '../../components/Header/Header';
import InputForm from '../../components/InputForm/InputForm';
import { XField, YField, ZField, RField } from '../../components/fields';
import GraphCanvas from '../../components/graphcanvas/GraphCanvas';
import ResultsTable from '../../components/ResultsTable/ResultsTable';
import './MainPage.css';
import {Button} from "primereact/button";

function MainPage() {
    const [r, setR] = useState(3);
    const [points, setPoints] = useState([]);
    const formRef = useRef(null);

    const handleSubmit = (e) => {
        console.log('Submit формы');
    };

    const handleGraphClick = (data) => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    let handleLogout;

    return (
        <div className="main-container">
            <Header/>
            <div className="form-graph-container">
                <form className="form-cell">
                    <div className="form-block">
                        <Suspense fallback={<div style={{width: '100%', height: '50px', background: '#a341a1', borderRadius: '4px' }}></div>}>
                            <Button label="Выход" onClick={handleLogout} className="ui-button" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                        </Suspense>
                    </div>
                </form>
            </div>

            <div className="form-graph-container">
                <InputForm onSubmit={handleSubmit} ref={formRef}>
                    <XField/>
                    <YField/>
                    <ZField/>
                    <RField onValueChange={setR}/>
                </InputForm>
                <GraphCanvas r={r} points={points} onGraphClick={handleGraphClick}/>
            </div>

            <div className="results-container">
                <ResultsTable points={points}/>
            </div>
        </div>
    );
}

export default MainPage;
