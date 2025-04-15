import React, { createContext, useState } from 'react';

export const AttentivenessContext = createContext();

export const AttentivenessProvider = ({ children }) => {
    const [results, setResults] = useState(null);
    return (
        <AttentivenessContext.Provider value={{ results, setResults }}>
            {children}
        </AttentivenessContext.Provider>
    );
};