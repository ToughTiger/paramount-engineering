// src/server/routes/about.ts
import express from 'express';
import { getAboutContent, upsertAboutContent } from '../services/aboutService';

const router = express.Router();

// GET /api/about
router.get('/about', async (_req, res) => {
  try {
    const about = await getAboutContent();
    // If nothing yet, return an empty structure (client can render a blank form)
    res.json(about ?? { imageUrl: '', mission: '', bio: '' });
  } catch (err) {
    console.error('Get about error:', err);
    res.status(500).json({ error: 'Failed to fetch about content' });
  }
});

// PUT /api/about  (upsert)
router.put('/about', async (req, res) => {
  try {
    const body = req.body ?? {};
    const input = {
      imageUrl: String(body.imageUrl ?? ''),
      mission: String(body.mission ?? ''),
      bio: String(body.bio ?? ''),
    };
    const saved = await upsertAboutContent(input);
    res.json(saved);
  } catch (err) {
    console.error('Upsert about error:', err);
    res.status(500).json({ error: 'Failed to save about content' });
  }
});

export default router;
