const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom Login Route
server.post('/api/v1/auth/login', (req, res) => {
  const { phone, password } = req.body;
  const db = router.db; // Access the lowdb instance
  const users = db.get('users').value();

  const user = users.find(u => u.phone === phone && u.password === password);

  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({
      token: 'mock-jwt-token-' + user.id,
      user: userWithoutPassword
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Rewriter for other API routes to match /api/v1 base URL
server.use(jsonServer.rewriter({
  '/api/v1/*': '/$1'
}));

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});
