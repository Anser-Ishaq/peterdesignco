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
    animation?: "lift" | "scale" | "slide" | "pulse" | "none";
}

const CustomButton = ({ layout,
    border,
    width,
    height,
    text,
    onClick,
    backgroundColor = 'bg-gold',
    textColor = 'text-black',
    padding = 'py-3 px-8',
    icon,
    animation = "none" }: buttonProps) => {
    const animations: Record<string, string> = {
        slide: "transition-all duration-300 hover:px-10",
        pulse: "transition-all duration-300 hover:brightness-110 hover:shadow-md",
        none: ""
    };
    return (
        <div className={`${layout} relative`}>
            <button
                onClick={onClick}
                className={`flex justify-center items-center  cursor-pointer gap-2.5 whitespace-nowrap 
                    ${height} ${width} ${padding} ${backgroundColor} ${textColor} ${border}
                    ${animations[animation]}
                `}
            >
                {text}
                {icon && (
                    <img
                        src={icon}
                        alt="icon"
                        className={`transition-all duration-300 
                            ${animation === "slide" ? "group-hover:translate-x-1" : ""}
                        `}
                    />
                )}
            </button>
        </div>
    );
}

export default CustomButton;