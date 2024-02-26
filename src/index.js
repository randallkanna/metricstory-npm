import { v4 as uuidv4 } from 'uuid';

const METRIC_STORY_BASE = 'https://api.metricstory.ai/api/v1/';

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
  constructor(options) {
    this.token = options.token;
    this.userId = this.getUserIdFromStorage();
    
    if (!this.userId) {
      this.userId = uuidv4();
      Storage.setItem('metricStoryUserId', this.userId);
    }

    this.trackPageLoad();
  }
  
  getUserIdFromStorage() {
    return Storage.getItem('metricStoryUserId');
  }

  saveUserIdToStorage(userId) {
    Storage.setItem('metricStoryUserId', userId);
  }

  trackPageViewManually(url, referrer) {
    url = url || window.location.pathname;
    referrer = referrer || document.referrer;

    this.track({ 
      event: 'PAGE_VIEW', 
      properties: {
        url: url,
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
    const data = {
      ...params,
      userId: this.userId,
      url: window.location.href,
      token: this.token
    };

    this.userId = params.userId;
    this.saveUserIdToStorage(this.userId);
    if (callback) callback(null);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(data)
    };
    
    fetch(METRIC_STORY_BASE + ENDPOINTS.IDENTIFY, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseData => {
        this.userId = params.userId;
        this.saveUserIdToStorage(this.userId);
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
    
    fetch(METRIC_STORY_BASE + ENDPOINTS.INSIGHT, requestOptions)
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