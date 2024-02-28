
import { v4 as uuidv4 } from 'uuid';

const METRIC_STORY_BASE = 'https://api.metricstory.ai/api/v1/';
// const METRIC_STORY_BASE = 'http://localhost:8080/api/v1/';

class Storage {
  static getItem(key) {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    } else {
      console.log("localStorage is not available in the current environment.");
      return null;
    }
  }

  static setItem(key, value) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    } else {
      console.log("localStorage is not available in the current environment.");
    }
  }
}

const ENDPOINTS = {
  IDENTIFY: 'identify',
  INSIGHT: 'track'
};

export class MetricStory {
  constructor() {
    this.userId = null;
    this.isAnonymous = true;
  }
  
  init(options) {
    this.token = options.token;
    const userData = this.getUserDataFromStorage();

    if (!userData) {
      this.userId = uuidv4();
      this.isAnonymous = true;
      this.saveUserDataToStorage(this.userId, this.isAnonymous);
      this.identify({ userId: this.userId }); // Optional: Add more parameters as needed
    } else {
      this.userId = userData.userId;
      this.isAnonymous = userData.isAnonymous;
    }
    
    this.trackPageLoad();
  }
  
  getUserDataFromStorage() {
    const userDataString = Storage.getItem('metricStoryUserId');
    try {
      return JSON.parse(userDataString);
    } catch (error) {
      console.error('Error parsing user data from storage:', error);
      return null;
    }
  }

  saveUserDataToStorage(userId, isAnonymous) {
    const userData = JSON.stringify({ userId, isAnonymous });
    Storage.setItem('metricStoryUserId', userData);
  }

  trackPageViewManually(url, referrer) {
    url = url || window.location.pathname;
    referrer = referrer || document.referrer;

    this.track({ 
      event: 'PAGE_VIEW', 
      properties: {
        domain: url,
        referrer: referrer,
        timestamp: new Date(),
        url: window.location.href
      }
    });
  }

  trackPageLoad() {
    const pageUrl = window.location.pathname;
    const referrer = document.referrer;

    this.track({ 
      event: 'PAGE_LOAD', 
      properties: {
        url: pageUrl,
        referrer: referrer
      }
    });
  }

  identify(params, callback) {
    /* Assume params includes a userId that serves as an identifier */
    if (!this.isAnonymous) return; // Avoid re-identifying already identified user

    this.isAnonymous = false;
    this.userId = params.userId;
    this.saveUserDataToStorage(this.userId, this.isAnonymous); // Update storage

    const data = {
      ...params,
      url: window.location.href,
      token: this.token
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(data)
    };
    
    fetch(`${METRIC_STORY_BASE}${ENDPOINTS.IDENTIFY}`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseData => {
        if (callback) callback(null, responseData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        if (callback) callback(error, null);
      });
  }

  track(params, callback) {
    const data = {
      ...params,
      userId: this.userId,
      token: this.token,
      url: window.location.href,
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(data)
    };
    
    fetch(`${METRIC_STORY_BASE}${ENDPOINTS.INSIGHT}`, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (callback) callback(null, data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          if (callback) callback(error, null);
        });
  }
}

export { MetricStoryProvider, useMetricStory } from './MetricStoryContext';

export const metricStory = new MetricStory();

