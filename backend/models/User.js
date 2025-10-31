import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  profile: {
    age: { type: Number, min: 13, max: 120 },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    fitnessLevel: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very-active'],
      default: 'moderate'
    }
  },
  goals: {
    targetWeight: { type: Number },
    fitnessGoal: { 
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'maintenance', 'endurance', 'flexibility'],
      default: 'maintenance'
    },
    timeline: { type: String }, // e.g., "3 months", "6 months"
    weeklyWorkouts: { type: Number, default: 3 }
  },
  preferences: {
    equipment: [{
      type: String,
      enum: ['bodyweight', 'dumbbells', 'barbell', 'resistance-bands', 'gym-equipment', 'none']
    }],
    workoutDuration: { type: Number, default: 30 }, // minutes
    dietaryRestrictions: [String],
    injuries: [String]
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastWorkoutDate: { type: Date }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
