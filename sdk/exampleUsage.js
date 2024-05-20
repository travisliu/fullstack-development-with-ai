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

