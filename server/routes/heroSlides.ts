// src/server/routes/heroSlides.ts
import express from 'express';
import * as heroSlideRepo from '../services/heroService';

const router = express.Router();

// CREATE
router.post('/hero-slides', async (req, res) => {
  try {
    const slide = await heroSlideRepo.createHeroSlide(req.body);
    res.json(slide);
  } catch (err: any) {
    console.error("Create hero slide error:", err);
    res.status(500).json({ error: 'Failed to create hero slide' });
  }
});

// LIST
router.get('/hero-slides', async (_req, res) => {
  try {
    const slides = await heroSlideRepo.listHeroSlides();
    res.json(slides);
  } catch (err: any) {
    console.error("List hero slides error:", err);
    res.status(500).json({ error: 'Failed to list hero slides' });
  }
});

// UPDATE
router.put('/hero-slides/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await heroSlideRepo.updateHeroSlide(id, req.body);
    res.json(updated);
  } catch (err: any) {
    console.error("Update hero slide error:", err);
    res.status(500).json({ error: 'Failed to update hero slide' });
  }
});

// DELETE
router.delete('/hero-slides/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await heroSlideRepo.deleteHeroSlide(id);
    res.json({ success: true });
  } catch (err: any) {
    console.error("Delete hero slide error:", err);
    res.status(500).json({ error: 'Failed to delete hero slide' });
  }
});

export default router;
