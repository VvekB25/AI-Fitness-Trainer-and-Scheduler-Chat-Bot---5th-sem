import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for fitness trainer context
const FITNESS_TRAINER_CONTEXT = `You are an expert AI Fitness Trainer and Health Coach with certifications in:
- Personal Training (CPT)
- Nutrition Science
- Exercise Physiology
- Sports Medicine

Your personality:
- Encouraging and motivating
- Professional yet friendly
- Evidence-based and scientifically accurate
- Adaptive to user's fitness level

Your capabilities:
1. Create personalized workout plans
2. Provide exercise form corrections and tips
3. Suggest nutrition and meal plans
4. Track progress and adjust recommendations
5. Answer fitness and health questions
6. Provide motivation and support
7. Suggest exercises based on available equipment
8. Help with injury prevention and recovery

Guidelines:
- Always prioritize user safety
- Ask for medical clearance if user mentions injuries or health conditions
- Be specific with exercise instructions (sets, reps, rest time)
- Encourage proper form over heavy weights
- Recommend gradual progression
- Stay within fitness and nutrition domain
- Use emojis occasionally to be engaging 💪🏋️‍♂️🔥

When asked about workouts, provide structured responses with:
- Exercise name
- Muscle group targeted
- Sets and reps
- Rest time
- Form tips
- Alternatives if needed
`;

// Create Gemini model with fitness context
export const getFitnessModel = () => {
  return genAI.getGenerativeModel({ 
    model: "models/gemini-flash-latest"
  });
};

// Chat with fitness context
export const chatWithFitnessAI = async (message, userProfile = {}, chatHistory = []) => {
  try {
    const model = getFitnessModel();

    // Build context from user profile
    let userContext = '';
    if (userProfile && Object.keys(userProfile).length > 0) {
      userContext = `\n\nUser Profile Context:
- Fitness Level: ${userProfile.fitnessLevel || 'Not specified'}
- Goals: ${userProfile.fitnessGoal || 'Not specified'}
- Equipment Available: ${userProfile.equipment?.join(', ') || 'Not specified'}
- Workout Duration Preference: ${userProfile.workoutDuration || 30} minutes
- Injuries/Limitations: ${userProfile.injuries?.join(', ') || 'None mentioned'}
`;
    }

    // Convert chat history to Gemini format
    const history = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add fitness trainer context as first message if no history
    if (history.length === 0) {
      history.push({
        role: 'user',
        parts: [{ text: FITNESS_TRAINER_CONTEXT }]
      });
      history.push({
        role: 'model',
        parts: [{ text: "Hello! I'm your AI Fitness Trainer. I'm here to help you with personalized workout plans, exercise guidance, nutrition advice, and achieve your fitness goals. How can I assist you today? 💪" }]
      });
    }

    // Start chat with history
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Send message with user context
    const fullMessage = userContext ? `${userContext}\n\n${message}` : message;
    const result = await chat.sendMessage(fullMessage);
    const response = await result.response;
    
    return {
      success: true,
      message: response.text()
    };
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return {
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
      error: error.message
    };
  }
};

// Generate personalized workout plan
export const generateWorkoutPlan = async (userProfile) => {
  try {
    const model = getFitnessModel();

    const prompt = `Create a personalized weekly workout plan based on this profile:

Fitness Level: ${userProfile.fitnessLevel || 'beginner'}
Goal: ${userProfile.fitnessGoal || 'general fitness'}
Equipment: ${userProfile.equipment?.join(', ') || 'bodyweight'}
Workouts per week: ${userProfile.weeklyWorkouts || 3}
Duration per session: ${userProfile.workoutDuration || 30} minutes
Injuries/Limitations: ${userProfile.injuries?.join(', ') || 'None'}

Please provide:
1. Weekly structure (which days, what focus)
2. For each workout day:
   - Workout focus/type
   - 5-7 specific exercises
   - Sets, reps, and rest times
   - Total estimated duration
3. Recovery/rest day recommendations
4. Progressive overload suggestions

Format the response in a clear, structured way.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return {
      success: true,
      workoutPlan: response.text()
    };
  } catch (error) {
    console.error('Workout Plan Generation Error:', error);
    return {
      success: false,
      message: 'Error generating workout plan',
      error: error.message
    };
  }
};

// Get exercise recommendations
export const getExerciseRecommendations = async (muscleGroup, equipment, difficulty) => {
  try {
    const model = getFitnessModel();

    const prompt = `Suggest 5 effective exercises for:
Muscle Group: ${muscleGroup}
Equipment: ${equipment || 'bodyweight'}
Difficulty: ${difficulty || 'intermediate'}

For each exercise provide:
1. Exercise name
2. How to perform (brief instructions)
3. Sets and reps recommendation
4. Key form tips
5. Common mistakes to avoid

Be specific and practical.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return {
      success: true,
      exercises: response.text()
    };
  } catch (error) {
    console.error('Exercise Recommendations Error:', error);
    return {
      success: false,
      message: 'Error getting exercise recommendations',
      error: error.message
    };
  }
};

export default {
  getFitnessModel,
  chatWithFitnessAI,
  generateWorkoutPlan,
  getExerciseRecommendations
};
