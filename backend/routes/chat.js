import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { 
  chatWithFitnessAI, 
  generateWorkoutPlan, 
  getExerciseRecommendations 
} from '../services/gemini.js';
import User from '../models/User.js';
import ChatMessage from '../models/ChatMessage.js';

const router = express.Router();

// Store chat history in memory (In production, use database or Redis)
const chatSessions = new Map();

// @route   POST /api/chat/message
// @desc    Send message to AI fitness trainer
// @access  Private
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    console.log('📨 Received message from user:', userId);
    console.log('💬 Message:', message);

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    // Get user profile for context
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Load chat history from database (last 20 messages for context)
    const dbMessages = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    
    // Convert to format needed for AI (reverse to get chronological order)
    let chatHistory = dbMessages.reverse().map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    console.log('📚 Chat history length:', chatHistory.length);

    // Prepare user profile context
    const userProfile = {
      fitnessLevel: user.profile?.fitnessLevel,
      fitnessGoal: user.goals?.fitnessGoal,
      equipment: user.preferences?.equipment,
      workoutDuration: user.preferences?.workoutDuration,
      injuries: user.preferences?.injuries,
      weeklyWorkouts: user.goals?.weeklyWorkouts
    };

    // Get AI response
    console.log('🤖 Calling Gemini AI...');
    const aiResponse = await chatWithFitnessAI(message, userProfile, chatHistory);
    console.log('✅ AI Response received');

    if (!aiResponse.success) {
      console.error('❌ AI Error:', aiResponse.error);
      return res.status(500).json({
        success: false,
        message: 'Error communicating with AI',
        error: aiResponse.error
      });
    }

    // Save user message to database
    await ChatMessage.create({
      userId,
      role: 'user',
      content: message
    });

    // Save AI response to database
    await ChatMessage.create({
      userId,
      role: 'assistant',
      content: aiResponse.message
    });

    console.log('💾 Messages saved to database');

    res.json({
      success: true,
      message: aiResponse.message,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Chat error:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/chat/workout-plan
// @desc    Generate personalized workout plan
// @access  Private
router.post('/workout-plan', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Get user profile
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prepare user profile
    const userProfile = {
      fitnessLevel: user.profile?.fitnessLevel || 'beginner',
      fitnessGoal: user.goals?.fitnessGoal || 'maintenance',
      equipment: user.preferences?.equipment || ['bodyweight'],
      workoutDuration: user.preferences?.workoutDuration || 30,
      injuries: user.preferences?.injuries || [],
      weeklyWorkouts: user.goals?.weeklyWorkouts || 3
    };

    // Generate workout plan
    const result = await generateWorkoutPlan(userProfile);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error generating workout plan',
        error: result.error
      });
    }

    res.json({
      success: true,
      workoutPlan: result.workoutPlan,
      userProfile: userProfile
    });
  } catch (error) {
    console.error('Workout plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/chat/exercises
// @desc    Get exercise recommendations
// @access  Private
router.post('/exercises', authMiddleware, async (req, res) => {
  try {
    const { muscleGroup, equipment, difficulty } = req.body;

    if (!muscleGroup) {
      return res.status(400).json({
        success: false,
        message: 'Please specify a muscle group'
      });
    }

    const result = await getExerciseRecommendations(
      muscleGroup,
      equipment || 'bodyweight',
      difficulty || 'intermediate'
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error getting exercise recommendations',
        error: result.error
      });
    }

    res.json({
      success: true,
      exercises: result.exercises,
      filters: { muscleGroup, equipment, difficulty }
    });
  } catch (error) {
    console.error('Exercise recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/chat/history
// @desc    Get chat history
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 50;
    
    // Get messages from database
    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    // Reverse to get chronological order
    const chatHistory = messages.reverse().map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.createdAt
    }));

    res.json({
      success: true,
      history: chatHistory,
      count: chatHistory.length
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

// @route   DELETE /api/chat/history
// @desc    Clear chat history
// @access  Private
router.delete('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Delete all messages for this user from database
    const result = await ChatMessage.deleteMany({ userId });

    res.json({
      success: true,
      message: 'Chat history cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
