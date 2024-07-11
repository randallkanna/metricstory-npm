
import React, { createContext, useContext, useEffect } from 'react';
import { convertly } from './index';

const ConvertlyContext = createContext();

const ConvertlyProvider = ({ apiKey, children }) => {
	useEffect(() => {
			convertly.init({ token: apiKey });
			// Optionally handle other setup tasks here
	}, [apiKey]);

	return (
			<ConvertlyContext.Provider value={{ convertly }}>
					{children}
			</ConvertlyContext.Provider>
	);
};

const useConvertly = () => useContext(ConvertlyContext).convertly;

export { ConvertlyProvider, useConvertly };

