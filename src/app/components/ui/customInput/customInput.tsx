'use client'
type inputProps = {
    layout?: string;
    border?: string;
    width?: string;
    height?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    type?: string;
    name?: string;
    id?: string;
    disabled?: boolean;
    required?: boolean;
    icon?: string;
    iconPosition?: 'left' | 'right';
}

const CustomInput = ({ 
    layout, 
    border = '', 
    width = 'w-full', 
    height, 
    placeholder, 
    value, 
    onChange, 
    backgroundColor = 'bg-dark-gray!', 
    textColor = 'text-black', 
    padding = 'py-3 px-4', 
    type = 'text',
    name,
    id,
    disabled = false,
    required = false,
    icon,
    iconPosition = 'left'
}: inputProps) => {

    return (
        <div className={`${layout} relative`}>
            <div className="relative flex items-center">
                {icon && iconPosition === 'left' && (
                    <img src={icon} alt="icon" className="absolute left-3 w-5 h-5" />
                )}
                <input
                    type={type}
                    name={name}
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`${width} ${height} ${padding} ${backgroundColor} ${textColor} ${border} ${icon && iconPosition === 'left' ? 'pl-10' : ''} ${icon && iconPosition === 'right' ? 'pr-10' : ''} focus:outline-none`}
                />
                {icon && iconPosition === 'right' && (
                    <img src={icon} alt="icon" className="absolute right-3 w-5 h-5" />
                )}
            </div>
        </div>
    );
}

export default CustomInput;
