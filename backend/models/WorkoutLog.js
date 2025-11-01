import mongoose from 'mongoose';

const workoutLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  workoutName: {
    type: String,
    required: true,
    trim: true
  },
  exercises: [{
    name: {
      type: String,
      required: true
    },
    sets: {
      type: Number,
      default: 0
    },
    reps: {
      type: Number,
      default: 0
    },
    weight: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number, // in minutes
      default: 0
    },
    notes: String
  }],
  duration: {
    type: Number, // Total workout duration in minutes
    required: true
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'hard', 'very-hard'],
    default: 'moderate'
  },
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'tired', 'exhausted'],
    default: 'good'
  },
  notes: {
    type: String,
    trim: true
  },
  completedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
workoutLogSchema.index({ userId: 1, completedAt: -1 });

// Virtual for formatted date
workoutLogSchema.virtual('formattedDate').get(function() {
  return this.completedAt.toLocaleDateString();
});

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);

export default WorkoutLog;
