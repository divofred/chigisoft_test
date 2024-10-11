import express from 'express';
import ApiRouter from './api';
const router = express.Router();

router.get('/health-check', (req, res) => {
  res.status(200).json({
    message: 'Server is running'
  });
});

router.use('/api', ApiRouter);

router.all('*', (req, res) => {
  return res.status(404).json({
    message: 'Oops! This route does not exist. 🤷‍♂️'
  });
});

export default router;
