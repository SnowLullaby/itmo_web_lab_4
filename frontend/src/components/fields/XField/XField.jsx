import { useState, useRef, useEffect } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import './XField.css';

function XField({ onValueChange: parentOnValueChange }) {
    const [value, setValue] = useState(null);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const handleValueChange = (e) => {
        const val = e.value;
        setValue(val);
        setError(null);
        if (parentOnValueChange && val !== null) parentOnValueChange(val);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setCustomValidity('');
        }
    }, []);

    const handleInvalid = (e) => {
        e.preventDefault();
        setError('Не задано значение X');
    };

    return (
        <div className="form-block">
            <label>X:</label>
            <InputNumber
                value={value} onValueChange={handleValueChange} onInvalid={handleInvalid}
                min={-3} max={3} step={1} required showButtons buttonLayout="stacked"
                decrementButtonClassName="spinner-down" incrementButtonClassName="spinner-up"
                decrementButtonIcon="pi pi-chevron-down" incrementButtonIcon="pi pi-chevron-up"
                className="x-spinner"
            />
            {error && <small className="p-error">{error}</small>}
        </div>
    );
}

export default XField;
