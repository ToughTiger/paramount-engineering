import { Router } from 'express';
import * as tagService from '../services/tagService';

const router = Router();
// -------- CREATE --------
router.post('/tags', async (req, res) => {
    try {
        const name = typeof req.body === 'string' ? req.body : req.body?.name;
        const tag = await tagService.createTag(name);
        res.json(tag);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create tag' });
    }
});

// -------- LIST --------
router.get('/tags', async (req, res) => {
    try {
        const tags = await tagService.listTags();
        res.json(tags);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});
// -------- GET BY ID --------
router.get('/tags/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const tag = await tagService.getTagById(id);
        if (!tag) return res.status(404).json({ error: 'Tag not found' });
        res.json(tag);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tag' });
    }
});
// -------- UPDATE --------
router.put('/tags/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;
        const tag = await tagService.updateTag(id, name);
        res.json(tag);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update tag' });
    }
});
// -------- DELETE --------
router.delete('/tags/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        await tagService.deleteTag(id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete tag' });
    }
});
export default router;