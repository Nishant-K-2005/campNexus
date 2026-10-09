import jwt from "jsonwebtoken";

const JWT_SECRET = 'aab5adc141dc4d86083762c381cf1ca07897def1427a1bc8f3a5817d26b53238';
const userId = 'c0279d49-d8f5-4644-8d93-334cda961016';

// Generate token matching generateToken.js signature (usually contains userId)
const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15d' });
const cookie = `jwt=${token}`;

async function testEndpoint(url) {
  try {
    console.log(`Testing ${url}...`);
    const res = await fetch(url, {
      headers: {
        cookie: cookie
      }
    });
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Response: ${text.substring(0, 500)}`);
  } catch (error) {
    console.error(`Request to ${url} failed:`, error);
  }
}

async function main() {
  await testEndpoint("http://localhost:5000/api/auth/session");
  await testEndpoint("http://localhost:5000/api/communities");
  // Let's check for any discussions
  await testEndpoint("http://localhost:5000/api/discussions/some-invalid-id");
  await testEndpoint("http://localhost:5000/api/discussions/1b3b3e52-ecfe-41e2-bc70-68b3fc53b3ec");
}

main();
