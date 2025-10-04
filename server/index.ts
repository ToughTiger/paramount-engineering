import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import blogRoutes from './routes/blog';
import categoryRoutes from './routes/category';
import tagRoutes from './routes/tag';
import portfolioRoutes from './routes/portfolio';
import heroRoutes from './routes/heroSlides';
import aboutRoutes from './routes/about';

const app = express();
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// If frontend runs on a different port in dev, you can tighten this later.
app.use(cors({ origin: true, credentials: true }));

app.use('/api', authRoutes);
app.use('/api', blogRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);
app.use('/api', portfolioRoutes);
app.use('/api', heroRoutes);
app.use('/api', aboutRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
