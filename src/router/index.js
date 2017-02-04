import path from 'path';
import express from 'express';
const app = express.Router();

app.get('/', (req, res) => {
  res.sendFile(path.join(req.app.get('views'), 'index.html'));
});

export default app;