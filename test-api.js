// Test script for API endpoints
// Run with: node test-api.js

const baseURL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${baseURL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test user registration
    console.log('\n2. Testing user registration...');
    const registerResponse = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    });
    const registerData = await registerResponse.json();
    console.log('✅ Registration:', registerData);

    if (registerData.token) {
      const token = registerData.token;

      // Test login
      console.log('\n3. Testing login...');
      const loginResponse = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      const loginData = await loginResponse.json();
      console.log('✅ Login:', loginData);

      // Test profile
      console.log('\n4. Testing profile access...');
      const profileResponse = await fetch(`${baseURL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileResponse.json();
      console.log('✅ Profile:', profileData);

      // Test creating an item
      console.log('\n5. Testing item creation...');
      const itemResponse = await fetch(`${baseURL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Test Item',
          description: 'This is a test item'
        })
      });
      const itemData = await itemResponse.json();
      console.log('✅ Item creation:', itemData);

      // Test getting items
      console.log('\n6. Testing get items...');
      const itemsResponse = await fetch(`${baseURL}/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const itemsData = await itemsResponse.json();
      console.log('✅ Get items:', itemsData);
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testAPI();
}

export { testAPI };