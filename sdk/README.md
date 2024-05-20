# Feature Flag Service - SDK

Welcome to the SDK repository of the Feature Flag Service, a project designed to revolutionize feature rollout management. This repository contains the software development kit (SDK) that allows you to integrate the Feature Flag Service into your applications seamlessly.

## SDK Overview

The SDK provides a simple and efficient way to interact with the Feature Flag Service from within your application. It supports real-time updates and granular control over feature visibility, enhancing your ability to manage feature rollouts dynamically.

## Installation

To use the SDK, follow these steps to set up and run the SDK service.

### 1. Install Dependencies

Install the required dependencies using yarn:
```bash
yarn install
```

## Usage

### Example Usage

Here's a basic example of how to use the SDK in your application. You can find this example in `exampleUsage.js`.

```javascript
const FeatureFlagSDK = require('./src/index'); // Adjust path as necessary

const sdk = new FeatureFlagSDK({ serverUrl: 'ws://localhost:3030' });

async function main() {
    const userAttributes = { name: 'demo', age: 16 };
    const featureFlagId = 'Demo09';

    // Set an interval to continuously check the flag
    setInterval(async () => {
        try {
            const isEnabled = await sdk.isFeatureEnabled(featureFlagId, userAttributes);

            console.log(`Feature flag '${featureFlagId}' enabled for user: ${isEnabled}`);
        } catch (error) {
            console.error('An error has occurred:', error);
        }
    }, 3000); // Check every 3 seconds
}

// Start the main function immediately after initializing the SDK
main();
```

## Scripts

The SDK provides several yarn scripts to help with development and testing:

- **Build**: Build the SDK for production using Webpack.
  ```bash
  yarn build
  ```

- **Demo**: Run the example usage script.
  ```bash
  yarn demo
  ```

## SDK Configuration

The main configuration options for the SDK are provided when you instantiate the `FeatureFlagSDK` class. These include:

- `serverUrl`: The WebSocket URL of the Feature Flag Service server.

## Contact

For any questions or feedback, please open an issue on GitHub.

