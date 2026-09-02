import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.send('NDRF GIS Prototype API is running.');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
