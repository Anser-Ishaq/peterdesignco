'use client'
import { useState } from 'react';

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
    label?: string;
    labelClassName?: string;
    accept?: string; // For file input
    multiple?: boolean; // For file input
    onFileChange?: (files: FileList | null) => void; // For file input
    showFileList?: boolean; // Show list of selected files
    // Additional HTML input attributes
    min?: string | number;
    max?: string | number;
    step?: string | number;
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
    iconPosition = 'left',
    label,
    labelClassName = 'block text-sm font-medium text-gray-700 mb-2',
    accept,
    multiple = false,
    onFileChange,
    showFileList = true,
    min,
    max,
    step
}: inputProps) => {

    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        setSelectedFiles(files);
        
        if (type === 'file' && onFileChange) {
            onFileChange(files);
        }
        if (onChange) {
            onChange(e);
        }
    };

    const removeFile = (indexToRemove: number) => {
        if (!selectedFiles) return;
        
        const dt = new DataTransfer();
        const files = Array.from(selectedFiles);
        
        files.forEach((file, index) => {
            if (index !== indexToRemove) {
                dt.items.add(file);
            }
        });
        
        const newFileList = dt.files;
        setSelectedFiles(newFileList);
        
        if (onFileChange) {
            onFileChange(newFileList);
        }
        
        // Update the input element
        const inputElement = document.getElementById(id || '') as HTMLInputElement;
        if (inputElement) {
            inputElement.files = newFileList;
        }
    };

    return (
        <div className={`${layout} relative`}>
            {label && (
                <label htmlFor={id} className={labelClassName}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative flex items-center">
                {icon && iconPosition === 'left' && type !== 'file' && (
                    <img src={icon} alt="icon" className="absolute left-3 w-5 h-5" />
                )}
                <input
                    type={type}
                    name={name}
                    id={id}
                    value={type === 'file' ? undefined : value}
                    onChange={handleFileChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    accept={type === 'file' ? accept : undefined}
                    multiple={type === 'file' ? multiple : undefined}
                    min={min}
                    max={max}
                    step={step}
                    className={`${width} ${height} ${padding} ${backgroundColor} ${textColor} ${border} ${
                        icon && iconPosition === 'left' && type !== 'file' ? 'pl-10' : ''
                    } ${
                        icon && iconPosition === 'right' && type !== 'file' ? 'pr-10' : ''
                    } ${
                        type === 'file' ? 'file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100' : ''
                    } focus:outline-none`}
                />
                {icon && iconPosition === 'right' && type !== 'file' && (
                    <img src={icon} alt="icon" className="absolute right-3 w-5 h-5" />
                )}
            </div>
            
            {/* File List Display */}
            {type === 'file' && selectedFiles && selectedFiles.length > 0 && showFileList && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                        Selected Files ({selectedFiles.length}):
                    </div>
                    <ul className="space-y-2">
                        {Array.from(selectedFiles).map((file, index) => (
                            <li key={index} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    {index + 1}. {file.name}
                                </span>
                                {multiple && (
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-red-500 hover:text-red-700 ml-2 px-2 py-1 rounded hover:bg-red-50"
                                        title="Remove file"
                                    >
                                        ×
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CustomInput;
