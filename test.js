fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test2@test.com', password: 'test', name: 'test' })
}).then(res => res.json()).then(console.log).catch(console.error);
