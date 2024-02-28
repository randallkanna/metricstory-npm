
import React, { createContext, useContext, useEffect } from 'react';
import { metricStory } from './index';

const MetricStoryContext = createContext();

const MetricStoryProvider = ({ apiKey, children }) => {
	useEffect(() => {
			metricStory.init({ token: apiKey });
			// Optionally handle other setup tasks here
	}, [apiKey]);

	return (
			<MetricStoryContext.Provider value={{ metricStory }}>
					{children}
			</MetricStoryContext.Provider>
	);
};

const useMetricStory = () => useContext(MetricStoryContext).metricStory;

export { MetricStoryProvider, useMetricStory };

