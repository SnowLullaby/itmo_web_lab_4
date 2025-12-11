import { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import './YField.css';

function YField({ onValueChange }) {
    const [value, setValue] = useState('');
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const validate = (val) => {
        if (val === '') return true;
        const num = parseFloat(val);
        if (isNaN(num) || num < -5 || num > 5) {
            setError('Y должен быть от -5 до 5');
            return false;
        }
        setError(null);
        return true;
    };

    const handleChange = (e) => {
        const val = e.target.value;
        if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
            setValue(val);
            validate(val);
            if (onValueChange && val !== '') onValueChange(parseFloat(val));
            if (val !== '' && inputRef.current) {
                inputRef.current.setCustomValidity('');
                inputRef.current.reportValidity();
            }
        }
    };

    const handleBlur = () => {
        validate(value);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setCustomValidity('');
        }
    }, []);

    const handleInvalid = (e) => {
        e.preventDefault();
        setError('Не задано значение Y');
    };

    return (
        <div className="form-block">
            <label>Y:</label>
            <InputText
                value={value} onChange={handleChange} onBlur={handleBlur}
                onInvalid={handleInvalid} placeholder="-5 ... 5" required
                className="y-field"
            />
            {error && <small className="p-error">{error}</small>}
        </div>
    );
}

export default YField;
