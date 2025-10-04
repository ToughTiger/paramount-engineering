import { Router } from 'express';
import * as blogService from '../services/blogService';

const router = Router();

// -------- CREATE --------
router.post('/blogs', async (req, res) => {
  try {
    const post = await blogService.createBlogPost(req.body);
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// -------- LIST --------
router.get('/blogs', async (req, res) => {
  try {
    const { take, skip, tagId, categoryId, search, orderByDate } = req.query;
    const posts = await blogService.listBlogPosts({
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
      tagId: tagId ? Number(tagId) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      search: search ? String(search) : undefined,
      orderByDate: orderByDate === 'asc' ? 'asc' : 'desc',
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// -------- GET BY ID --------
router.get('/blogs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const post = await blogService.getBlogPostById(id);
    if (!post) return res.status(404).json({ error: 'Blog post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// -------- GET BY SLUG --------
router.get('/blogs/slug/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const post = await blogService.getBlogPostBySlug(slug);
    if (!post) return res.status(404).json({ error: 'Blog post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog post by slug' });
  }
});

// -------- UPDATE --------
router.put('/blogs/:id', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store'); // 👈 prevent 304

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid blog post ID' });
    }
    console.log("Updating blog post with ID:", req.params.id, req.body);
    const raw = req.body ?? {};
    const payload = {
      slug: typeof raw.slug === 'string' ? raw.slug : undefined,
      title: typeof raw.title === 'string' ? raw.title : undefined,
      author: typeof raw.author === 'string' ? raw.author : undefined,
      dateISO: typeof raw.dateISO === 'string' ? raw.dateISO : undefined,
      imageUrl: typeof raw.imageUrl === 'string' ? raw.imageUrl : undefined,
      content: typeof raw.content === 'string' ? raw.content : undefined,
      categoryId: req.body.categoryId ? Number(req.body.categoryId) : undefined,
      tagIds: Array.isArray(req.body.tagIds)
        ? req.body.tagIds.map((t: any) => Number(t))
        : undefined,
    };
    console.log("Update payload after normalization:", payload);
    const updated = await blogService.updateBlogPost(id, payload);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// -------- DELETE --------
router.delete('/blogs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await blogService.deleteBlogPost(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

export default router;
