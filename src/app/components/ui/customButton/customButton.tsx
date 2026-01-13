'use client'
type buttonProps = {
    layout?: string;
    border?: string;
    width?: string;
    height?: string;
    text?: string;
    onClick?: () => void;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    icon?: string;
}

const CustomButton = ({ layout,
    border='border border-black',
    width,
    height,
    text,
    onClick,
    backgroundColor = 'bg-gray',
    textColor = 'text-black',
    padding = 'py-3 px-8',
    icon }: buttonProps) => {
    return (
        <div className={`${layout} relative`}>
            <button
                onClick={onClick}
                className={`group relative flex justify-center items-center cursor-pointer gap-2.5 whitespace-nowrap overflow-hidden
                    ${height} ${width} ${padding} ${backgroundColor} ${textColor} ${border}
                `}
            >
                {/* Background slide effect */}
                <span className="absolute inset-0 bg-gray transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                
                {/* Text content */}
                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                    {text}
                </span>
                
                {/* Icon */}
                {icon && (
                    <img
                        src={icon}
                        alt="icon"
                        className="relative z-10 transition-all duration-500 group-hover:translate-x-1"
                    />
                )}
            </button>
        </div>
    );
}

export default CustomButton;