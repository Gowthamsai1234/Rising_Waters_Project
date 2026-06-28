import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users in 30 seconds
    { duration: '30s', target: 20 },  // Hold 20 users for 30 seconds
    { duration: '30s', target: 0  },  // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% requests under 2 seconds
    http_req_failed:   ['rate<0.01'],   // Error rate under 1%
  },
};

// Test 1: Home Page
export default function () {

  // GET Home Page
  let res1 = http.get('http://127.0.0.1:5000/');
  check(res1, {
    'Home page status 200': (r) => r.status === 200,
    'Home page loads < 2s': (r) => r.timings.duration < 2000,
  });
  sleep(1);

  // GET Predict Page
  let res2 = http.get('http://127.0.0.1:5000/Predict');
  check(res2, {
    'Predict page status 200': (r) => r.status === 200,
    'Predict page loads < 2s': (r) => r.timings.duration < 2000,
  });
  sleep(1);

  // POST Prediction with sample flood data
  let payload = {
    'Temp':        '31',
    'Humidity':    '79',
    'Cloud Cover': '44',
    'ANNUAL':      '4000',
    'Jan-Feb':     '90',
    'Mar-May':     '800',
    'Jun-Sep':     '3000',
    'Oct-Dec':     '700',
    'avgjune':     '350',
    'sub':         '900',
  };
  let res3 = http.post('http://127.0.0.1:5000/Predict', payload);
  check(res3, {
    'Prediction result status 200': (r) => r.status === 200,
    'Prediction completes < 2s':    (r) => r.timings.duration < 2000,
  });
  sleep(1);
}