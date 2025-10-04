import { Router } from 'express';
import {
  createPortfolioItem,
  listPortfolioItems,
  getPortfolioItemById,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../services/portfolio';
import { prisma } from '@/server/lib/prisma';
const router = Router();

// Create
router.post('/portfolio', async (req, res) => {
  try {
    const body = req.body ?? {};
    console.log('Create portfolio body:', body);
    
    const categoryId = Number(body.categoryId);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return res.status(400).json({ error: 'Invalid categoryId' });
      }

      // Ensure category exists to avoid P2025
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(400).json({ error: `Category ${categoryId} not found` });
    }
    console.log('Validated category:', category);
    const input = {
      title: String(body.title ?? ''),
      imageUrl: String(body.imageUrl ?? ''),
      description: String(body.description ?? ''),
      categoryId: Number(body.categoryId),
    };
    if (!input.title || !input.imageUrl || !input.description || !Number.isInteger(input.categoryId)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }
    const created = await createPortfolioItem(input);
    res.json(created);
  } catch (err) {
    console.error('Create portfolio error:', err);
    res.status(500).json({ error: 'Failed to create portfolio item' });
  }
});

// List
router.get('/portfolio', async (req, res) => {
  try {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const items = await listPortfolioItems({ categoryId, search });
    res.json(items);
  } catch (err) {
    console.error('List portfolio error:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio items' });
  }
});

// Get by ID
router.get('/portfolio/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    const item = await getPortfolioItemById(id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error('Get portfolio error:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio item' });
  }
});

// Update
router.put('/portfolio/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

    const body = req.body ?? {};
    const data = {
      title: body.title !== undefined ? String(body.title) : undefined,
      imageUrl: body.imageUrl !== undefined ? String(body.imageUrl) : undefined,
      description: body.description !== undefined ? String(body.description) : undefined,
      categoryId:
        body.categoryId !== undefined && body.categoryId !== null
          ? Number(body.categoryId)
          : undefined,
    };

    const updated = await updatePortfolioItem(id, data);
    res.json(updated);
  } catch (err) {
    console.error('Update portfolio error:', err);
    res.status(500).json({ error: 'Failed to update portfolio item' });
  }
});

// Delete
router.delete('/portfolio/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    await deletePortfolioItem(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete portfolio error:', err);
    res.status(500).json({ error: 'Failed to delete portfolio item' });
  }
});

export default router;
