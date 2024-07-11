# Convertly

This provides a straightforward way to integrate Convertly analytics into your web application.

## Usage

Before using the SDK, ensure you have generated an API token from tryConvertly.com. This token is required for authorizing requests to Convertly's API.

For added security, you can add a domain in tryConvertly.com as well

### Initializing Convertly

Install the module

```
npm install convertly
```

Import the `Convertly` provider and initialize it with your API token.

```javascript
import { ConvertlyProvider } from 'convertly';

export default function App() {
  return (
      <ConvertlyProvider apiKey='key-XXXXX'>
          <BrowserRouter />
      </ConvertlyProvider>
  )
} 
```

### Identifying Users

To associate events and page views with a user, call the `identify` method. This makes it easier to track user actions across your application.

```javascript
convertly.identify({ userId: "user's unique ID", first_name: "First Name", last_name: "Last Name" });
```

It's a good practice to call this method right after a user logs in or when the user information is updated.

### Tracking Events

You can track custom events using the `track` method. This is useful for understanding the actions users are taking in your web application.

```javascript
convertly.track({ event: "USER_SIGNED_UP", properties: { plan: "Pro" } });
```

### Automatic Page Load Tracking

The SDK automatically tracks page loads when the `Convertly` class is first initialized. However, if you need to track page views manually (e.g., in single-page applications), you can use the `page` method as shown below.

```javascript
convertly.page({ page: '/home', properties: { plan: 'Free' } });
```