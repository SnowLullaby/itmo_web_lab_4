import { useState, useRef, useEffect } from 'react';
import { Checkbox } from 'primereact/checkbox';
import './ZField.css';

function ZField({ onValueChange }) {
    const [selected, setSelected] = useState([]);
    const [error, setError] = useState(null);
    const hiddenRef = useRef(null);

    const handleChange = (e) => {
        let newSelected = [...selected];
        if (e.checked) {
            newSelected.push(e.value);
        } else {
            newSelected = newSelected.filter(v => v !== e.value);
        }
        setSelected(newSelected);
        if (onValueChange) onValueChange(newSelected);

        if (hiddenRef.current) {
            hiddenRef.current.value = newSelected.length > 0 ? 'valid' : '';
            hiddenRef.current.setCustomValidity('');
        }
        setError(null);
    };

    useEffect(() => {
        if (hiddenRef.current) {
            hiddenRef.current.value = '';
            hiddenRef.current.setCustomValidity('');
        }
    }, []);

    const handleInvalid = (e) => {
        e.preventDefault();
        setError('Выберите хотя бы один Z');
    };

    return (
        <div className="form-block">
            <label>Z:</label>
            <div className="z-button-group">
                <table>
                    <tbody>
                    <tr>
                        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(opt => (
                            <td key={opt}>
                                <Checkbox inputId={`z${opt}`} value={opt}
                                          onChange={handleChange} checked={selected.includes(opt)}
                                />
                                <label htmlFor={`z${opt}`}>{opt}</label>
                            </td>
                        ))}
                    </tr>
                    </tbody>
                </table>
            </div>
            <input
                ref={hiddenRef} required onInvalid={handleInvalid}
                className="hidden-input"
            />
            {error && <small className="p-error">{error}</small>}
        </div>
    );
}

export default ZField;
