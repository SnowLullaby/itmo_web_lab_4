import { useState, useRef, useEffect } from 'react';
import { Slider } from 'primereact/slider';
import { InputText } from 'primereact/inputtext';
import './RField.css';

function RField({ onValueChange }) {
    const [inputValue, setInputValue] = useState('3');
    const [sliderValue, setSliderValue] = useState(3);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 0); // Delay после paint
        return () => clearTimeout(timer);
    }, []);

    const clamp = (num) => {
        if (num < 1) return 1;
        if (num > 4) return 4;
        return num;
    };

    const validate = (val) => {
        if (val === '') {
            setError(null);
            return true;
        }
        const num = parseFloat(val);
        if (isNaN(num) || num < 1 || num > 4) {
            setError('R должен быть от 1 до 4');
            return false;
        }
        setError(null);
        return true;
    };

    const handleSliderChange = (e) => {
        const newValue = e.value;
        setSliderValue(newValue);
        setInputValue(newValue.toString());
        if (onValueChange) onValueChange(newValue);
        if (inputRef.current) {
            inputRef.current.value = newValue.toString();
            inputRef.current.setCustomValidity('');
            validate(newValue.toString());
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
            setInputValue(val);
            const num = parseFloat(val);
            const isValidNum = !isNaN(num);
            setSliderValue(isValidNum ? clamp(num) : sliderValue);
            if (val !== '') {
                validate(val);
            } else {
                setError(null);
            }
            if (onValueChange && val !== '' && isValidNum && num >= 1 && num <= 4) onValueChange(num);
            if (inputRef.current) {
                inputRef.current.setCustomValidity('');
                if (val !== '') inputRef.current.reportValidity();
            }
        }
    };

    const handleBlur = () => {
        if (inputValue !== '') validate(inputValue);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = inputValue;
            inputRef.current.setCustomValidity('');
        }
    }, [inputValue]);

    const handleInvalid = (e) => {
        e.preventDefault();
        setError('Не задано значение R');
    };

    return (
        <div className="form-block">
            <label>R:</label>
            <div style={{visibility: isLoaded ? 'visible' : 'hidden', height: '20px', marginBottom: '20px', marginTop: '10px'
            }}> {}
                <Slider
                    id="r_slider" value={sliderValue} onChange={handleSliderChange}
                    min={1} max={4} step={0.5}
                    className="ui-slider"
                />
            </div>
            <InputText
                ref={inputRef} value={inputValue} placeholder="1 ... 4" required
                onChange={handleInputChange} onBlur={handleBlur} onInvalid={handleInvalid}
                className="r-inputfield"
            />
            {error && <small className="p-error">{error}</small>}
        </div>
    );
}

export default RField;
