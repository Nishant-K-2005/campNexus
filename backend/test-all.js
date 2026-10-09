/**
 * Comprehensive diagnostic test for CampNexus dashboard 500 error
 * Tests all endpoints that are called during dashboard load
 */
import jwt from "jsonwebtoken";

const JWT_SECRET = 'aab5adc141dc4d86083762c381cf1ca07897def1427a1bc8f3a5817d26b53238';
const BASE = 'http://localhost:5000';

async function testEndpoint(method, url, cookie, body = null, headers = {}) {
  const opts = {
    method,
    headers: { cookie, ...headers },
  };
  if (body) {
    opts.body = JSON.stringify(body);
    opts.headers['Content-Type'] = 'application/json';
  }
  try {
    const res = await fetch(`${BASE}${url}`, opts);
    const text = await res.text();
    console.log(`\n[${method} ${url}]`);
    console.log(`  Status: ${res.status}`);
    if (res.status !== 200 && res.status !== 201 && res.status !== 204) {
      console.log(`  ⚠️  NON-2xx RESPONSE: ${text.substring(0, 300)}`);
    } else {
      console.log(`  ✅ OK - ${text.substring(0, 100)}...`);
    }
    return { status: res.status, body: text };
  } catch (e) {
    console.log(`\n[${method} ${url}]`);
    console.log(`  ❌ NETWORK ERROR: ${e.message}`);
    return { status: 0, body: null };
  }
}

// Test user: surbhi (has joined community)
const surbhiToken = jwt.sign({ userId: 'c0279d49-d8f5-4644-8d93-334cda961016' }, JWT_SECRET, { expiresIn: '15d' });
const surbhiCookie = `jwt=${surbhiToken}`;
const communityId = '1b3b3e52-ecfe-41e2-bc70-68b3fc53b3ec';

// Test user: newly registered (no community)
const newUserToken = jwt.sign({ userId: 'e5c5a7cc-9033-443d-a218-34f1dbcce33c' }, JWT_SECRET, { expiresIn: '15d' });
const newUserCookie = `jwt=${newUserToken}`;

async function runAllTests() {
  console.log('=== CampNexus Dashboard Diagnostic ===\n');

  console.log('--- Testing as SURBHI (community member) ---');
  await testEndpoint('GET', '/api/auth/session', surbhiCookie);
  await testEndpoint('GET', '/api/communities', surbhiCookie);
  await testEndpoint('GET', `/api/discussions/${communityId}`, surbhiCookie);
  await testEndpoint('GET', `/api/resources/${communityId}`, surbhiCookie);

  console.log('\n--- Testing as NEW USER (no community) ---');
  await testEndpoint('GET', '/api/auth/session', newUserCookie);
  await testEndpoint('GET', '/api/communities', newUserCookie);

  console.log('\n--- Testing Reply endpoint ---');
  await testEndpoint('GET', '/api/replies/invalid-post-id', surbhiCookie);

  console.log('\n=== Done ===');
}

runAllTests();
