const { validationResult } = require('express-validator');
const UserProfile = require('../models/UserProfile');

// Create profile (POST /api/profiles)
exports.createProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, skills = [], projects = [], github } = req.body;
    const userId = req.user.id;

    // prevent multiple profiles per user
    const existing = await UserProfile.findOne({ userId });
    if (existing) return res.status(400).json({ message: 'Profile already exists. Use PUT to update.' });

    const profile = new UserProfile({
      userId,
      name,
      email,
      skills,
      projects,
      github,
    });

    await profile.save();
    res.status(201).json({ message: 'Profile created', profile });
  } catch (err) {
    next(err);
  }
};

// Get current user's profile (GET /api/profiles/me)
exports.getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await UserProfile.findOne({ userId }).populate('userId', 'name email');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ profile });
  } catch (err) {
    next(err);
  }
};

// Update profile (PUT /api/profiles)
exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const userId = req.user.id;
    const updates = (({ name, email, skills, projects, github }) => ({ name, email, skills, projects, github }))(req.body);

    let profile = await UserProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found. Create it first.' });

    // assign only provided fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) profile[key] = updates[key];
    });

    await profile.save();
    res.json({ message: 'Profile updated', profile });
  } catch (err) {
    next(err);
  }
};

// Get profile by id (GET /api/profiles/:id)
exports.getProfileById = async (req, res, next) => {
  try {
    const profile = await UserProfile.findById(req.params.id).populate('userId', 'name email');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ profile });
  } catch (err) {
    next(err);
  }
};

// Optional: list all profiles (GET /api/profiles)
exports.listProfiles = async (req, res, next) => {
  try {
    const profiles = await UserProfile.find().select('-__v').populate('userId', 'name email');
    res.json({ profiles });
  } catch (err) {
    next(err);
  }
};
