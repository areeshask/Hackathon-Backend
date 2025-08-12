const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Create profile
router.post('/',
  authMiddleware,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    // skills and projects optional; expect arrays on client
  ],
  profileController.createProfile
);

// Get current user's profile
router.get('/me', authMiddleware, profileController.getMyProfile);

// Update profile
router.put('/',
  authMiddleware,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    // further validation for skills/projects can be added
  ],
  profileController.updateProfile
);

// Get by id (public)
router.get('/:id', profileController.getProfileById);

// List profiles (optional, public)
router.get('/', profileController.listProfiles);

module.exports = router;
