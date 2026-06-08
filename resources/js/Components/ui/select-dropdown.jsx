import React from 'react';
import Select from 'react-select';

const customSelectStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: '40px',
        borderColor: state.isFocused ? '#3B82F6' : '#E2E8F0', // slate-200
        borderWidth: state.isFocused ? '2px' : '1px',
        boxShadow: state.isFocused ? '0 0 0 1px #3B82F6' : 'none',
        '&:hover': {
            borderColor: '#3B82F6',
        },
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '2px 12px',
    }),
    input: (base) => ({
        ...base,
        margin: '0 !important',
        padding: '0 !important',
        caretColor: '#0f172a', // slate-900
        '& input': {
            outline: 'none !important',
            border: 'none !important',
            boxShadow: 'none !important',
        },
        '& input:focus': {
            outline: 'none !important',
            border: 'none !important',
            boxShadow: 'none !important',
        },
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? '#3B82F6'
            : state.isFocused
            ? '#EFF6FF'
            : 'white',
        color: state.isSelected ? 'white' : '#334155', // slate-700
        fontSize: '0.875rem',
        padding: '8px 12px',
        cursor: 'pointer',
        '&:active': {
            backgroundColor: '#3B82F6',
        },
    }),
    placeholder: (base) => ({
        ...base,
        fontSize: '0.875rem',
        color: '#94a3b8', // slate-400
        fontWeight: '400',
    }),
    singleValue: (base) => ({
        ...base,
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#0f172a', // slate-900
    }),
    menu: (base) => ({
        ...base,
        zIndex: 50,
        marginTop: '4px',
        boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }),
    menuList: (base) => ({
        ...base,
        padding: '4px',
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: '#94a3b8', // slate-400
        padding: '8px',
        '&:hover': {
            color: '#3B82F6',
        },
        transition: 'all 0.2s',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    clearIndicator: (base) => ({
        ...base,
        color: '#94a3b8', // slate-400
        padding: '8px',
        cursor: 'pointer',
        '&:hover': {
            color: '#EF4444',
        },
    }),
};

export function SelectDropdown({
    options,
    value,
    onChange,
    placeholder = 'Pilih...',
    isClearable = true,
    isSearchable = true,
    isDisabled = false,
    noOptionsMessage = () => 'Tidak ada data',
    ...props
}) {
    // If value is a primitive (like string or number), we need to find the corresponding option object
    const selectedOption = React.useMemo(() => {
        if (value === null || value === undefined || value === '') return null;
        if (typeof value === 'object' && value !== null) return value; // Already an option object

        // Find the option that matches the primitive value
        return options?.find(opt => opt.value === value) || null;
    }, [value, options]);

    const handleChange = (selected) => {
        if (onChange) {
            // Pass the primitive value if the original onChange expects it
            // Or we can just pass the whole object. Let's pass the whole object, 
            // but provide a convenience for forms that just want the value.
            onChange(selected);
        }
    };

    return (
        <Select
            value={selectedOption}
            onChange={handleChange}
            options={options}
            styles={customSelectStyles}
            placeholder={placeholder}
            isClearable={isClearable}
            isSearchable={isSearchable}
            isDisabled={isDisabled}
            noOptionsMessage={noOptionsMessage}
            autoComplete="off"
            {...props}
        />
    );
}
