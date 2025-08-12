const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
});

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  skills: { type: [String], default: [] },
  projects: { type: [projectSchema], default: [] },
  github: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
