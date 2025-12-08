'use client';
import { useState } from 'react';

interface CounterProps {
    initialValue?: number;
    min?: number;
    max?: number;
    onChange?: (value: number) => void;
}

const Counter = ({ initialValue = 1, min = 1, max = 99, onChange }: CounterProps) => {
    const [count, setCount] = useState(initialValue);

    const handleIncrement = () => {
        if (count < max) {
            const newValue = count + 1;
            setCount(newValue);
            onChange?.(newValue);
        }
    };

    const handleDecrement = () => {
        if (count > min) {
            const newValue = count - 1;
            setCount(newValue);
            onChange?.(newValue);
        }
    };

    return (
        <div className="flex items-center gap-0 md:gap-4 border border-gold bg-gold/70 rounded-lg w-fit h-[70px] ">
            <button
                onClick={handleDecrement}
                disabled={count <= min}
                className="px-2 py-2 text-xl font-bold hover:bg-gold h-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
            >
                −
            </button>
            <span className="text-lg font-semibold min-w-[2ch] text-center">{count}</span>
            <button
                onClick={handleIncrement}
                disabled={count >= max}
                className="px-2 py-2 text-xl font-bold hover:bg-gold h-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    );
};

export default Counter;
