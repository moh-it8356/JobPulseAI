const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// All routes below are protected
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for the logged-in user
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Task text is required' });
    try {
        const task = await Task.create({ user: req.user._id, text });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Toggle task completion
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.completed = req.body.completed !== undefined ? req.body.completed : !task.completed;
        const updated = await task.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/tasks
// @desc    Delete ALL tasks for the logged-in user
router.delete('/', async (req, res) => {
    try {
        await Task.deleteMany({ user: req.user._id });
        res.json({ message: 'All tasks cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
