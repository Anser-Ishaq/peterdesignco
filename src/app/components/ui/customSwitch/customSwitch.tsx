'use client';

interface CustomSwitchProps {
  id?: string;
  name?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'red';
}

const CustomSwitch = ({
  id,
  name,
  checked = false,
  onChange,
  label,
  labelClassName = 'text-sm font-medium text-gray-700',
  disabled = false,
  size = 'md',
  color = 'blue'
}: CustomSwitchProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: {
      switch: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  };

  // Color classes
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    red: 'bg-red-600'
  };

  const currentSize = sizeClasses[size];
  const currentColor = colorClasses[color];

  return (
    <div className="flex items-center">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`${currentSize.switch} ${
            checked ? currentColor : 'bg-gray-200'
          } ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out`}
          onClick={() => !disabled && onChange && onChange(!checked)}
        >
          <span
            className={`${currentSize.thumb} ${
              checked ? currentSize.translate : 'translate-x-0.5'
            } inline-block transform bg-white rounded-full shadow-lg transition-transform duration-200 ease-in-out`}
          />
        </div>
      </div>
      {label && (
        <label
          htmlFor={id}
          className={`ml-3 ${labelClassName} ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default CustomSwitch;