import { Router } from 'express';
import * as categoryService from '../services/categoryService';

const router = Router();
// -------- CREATE --------
router.post('/categories', async (req, res) => {
  try {
    const name = typeof req.body === 'string' ? req.body : req.body?.name;
    const category = await categoryService.createCategory(String(name));
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// -------- LIST --------
router.get('/categories', async (req, res) => {
  try {
    const categories = await categoryService.listCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// -------- GET BY ID --------
router.get('/categories/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const category = await categoryService.getCategoryById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// -------- UPDATE --------
router.put('/categories/:id', async (req, res) => {
  try { 
    const id = Number(req.params.id);
    const { name } = req.body;
    const category = await categoryService.updateCategory(id, name);
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// -------- DELETE --------
router.delete('/categories/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await categoryService.deleteCategory(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;