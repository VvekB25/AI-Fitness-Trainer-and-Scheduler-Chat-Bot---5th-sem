import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import WorkoutLog from '../models/WorkoutLog.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/workouts/log
// @desc    Log a completed workout
// @access  Private
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const { workoutName, exercises, duration, caloriesBurned, difficulty, mood, notes } = req.body;
    const userId = req.userId;

    if (!workoutName || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Workout name and duration are required'
      });
    }

    const workoutLog = new WorkoutLog({
      userId,
      workoutName,
      exercises: exercises || [],
      duration,
      caloriesBurned: caloriesBurned || 0,
      difficulty: difficulty || 'moderate',
      mood: mood || 'good',
      notes: notes || ''
    });

    await workoutLog.save();

    // Update user streak
    const user = await User.findById(userId);
    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastWorkout = user.streak?.lastWorkout;
      
      if (!lastWorkout) {
        // First workout ever
        user.streak = {
          current: 1,
          longest: 1,
          lastWorkout: new Date()
        };
      } else {
        const lastWorkoutDate = new Date(lastWorkout);
        lastWorkoutDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today - lastWorkoutDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
          // Same day - don't update streak
        } else if (daysDiff === 1) {
          // Consecutive day - increase streak
          user.streak.current += 1;
          user.streak.longest = Math.max(user.streak.current, user.streak.longest);
          user.streak.lastWorkout = new Date();
        } else {
          // Broke streak - reset to 1
          user.streak.current = 1;
          user.streak.lastWorkout = new Date();
        }
      }
      
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Workout logged successfully!',
      workout: workoutLog,
      streak: user.streak
    });
  } catch (error) {
    console.error('Log workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/workouts/history
// @desc    Get user's workout history
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 20, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const workouts = await WorkoutLog.find({ userId })
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const totalWorkouts = await WorkoutLog.countDocuments({ userId });

    res.json({
      success: true,
      workouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalWorkouts,
        pages: Math.ceil(totalWorkouts / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/workouts/stats
// @desc    Get workout statistics
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Total workouts
    const totalWorkouts = await WorkoutLog.countDocuments({ userId });

    // This week's workouts
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const workoutsThisWeek = await WorkoutLog.countDocuments({
      userId,
      completedAt: { $gte: startOfWeek }
    });

    // Total calories burned
    const caloriesResult = await WorkoutLog.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: '$caloriesBurned' } } }
    ]);
    const totalCalories = caloriesResult.length > 0 ? caloriesResult[0].total : 0;

    // Total workout time (in hours)
    const timeResult = await WorkoutLog.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);
    const totalMinutes = timeResult.length > 0 ? timeResult[0].total : 0;
    const totalHours = (totalMinutes / 60).toFixed(1);

    // Recent workouts
    const recentWorkouts = await WorkoutLog.find({ userId })
      .sort({ completedAt: -1 })
      .limit(5)
      .lean();

    // Get user streak
    const user = await User.findById(userId).select('streak');

    res.json({
      success: true,
      stats: {
        totalWorkouts,
        workoutsThisWeek,
        totalCalories,
        totalHours,
        streak: user?.streak || { current: 0, longest: 0 }
      },
      recentWorkouts
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/workouts/:id
// @desc    Get single workout details
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const workoutId = req.params.id;

    const workout = await WorkoutLog.findOne({ _id: workoutId, userId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      workout
    });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout log
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const workoutId = req.params.id;

    const workout = await WorkoutLog.findOneAndDelete({ _id: workoutId, userId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
