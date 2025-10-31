import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'balance', 'core'],
    required: true
  },
  muscleGroup: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'full-body', 'cardio']
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  equipment: [{
    type: String,
    enum: ['bodyweight', 'dumbbells', 'barbell', 'resistance-bands', 'gym-equipment', 'none']
  }],
  instructions: {
    type: String,
    required: true
  },
  sets: { type: Number },
  reps: { type: String }, // Can be "10-12" or "30 seconds"
  restTime: { type: Number }, // in seconds
  caloriesPerMinute: { type: Number, default: 5 },
  videoUrl: { type: String },
  imageUrl: { type: String },
  tips: [String]
}, {
  timestamps: true
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  exercises: [{
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise'
    },
    exerciseName: String,
    sets: Number,
    reps: String,
    weight: Number, // in kg
    duration: Number, // in minutes
    completed: { type: Boolean, default: false }
  }],
  totalDuration: { type: Number }, // in minutes
  caloriesBurned: { type: Number },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'hard', 'very-hard']
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: { type: Date },
  notes: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String }
}, {
  timestamps: true
});

const scheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Weekly Workout Plan'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  frequency: {
    type: Number, // workouts per week
    default: 3
  },
  workoutDays: [{
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    workoutType: String, // e.g., "Upper Body", "Cardio", "Legs"
    exercises: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise'
    }],
    duration: Number // in minutes
  }],
  reminders: {
    enabled: { type: Boolean, default: true },
    time: { type: String, default: '08:00' } // HH:MM format
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  weight: { type: Number },
  bodyMeasurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    biceps: Number,
    thighs: Number
  },
  bodyFatPercentage: { type: Number },
  photos: [{
    url: String,
    type: { type: String, enum: ['front', 'back', 'side'] }
  }],
  notes: { type: String },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'tired', 'exhausted']
  }
}, {
  timestamps: true
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
const Workout = mongoose.model('Workout', workoutSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);
const Progress = mongoose.model('Progress', progressSchema);

export { Exercise, Workout, Schedule, Progress };
