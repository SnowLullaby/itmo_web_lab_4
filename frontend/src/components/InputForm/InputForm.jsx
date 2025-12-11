import { Button } from 'primereact/button';
import './InputForm.css';
import {Suspense} from "react";

function InputForm({ children, submitLabel = 'Отправить' }) {
    return (
        <form className="form-cell">
            {children}
            <div className="form-block">
                <Suspense fallback={<div style={{ height: '50px', width: '100%', backgroundColor: '#a341a1', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Загрузка...</div>}>
                    <Button label={submitLabel} type="submit" className="ui-button" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                </Suspense>
            </div>
        </form>
    );
}

export default InputForm;
