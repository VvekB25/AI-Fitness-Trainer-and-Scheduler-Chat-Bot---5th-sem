import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ExerciseLibrary.css';

const ExerciseLibrary = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Exercise Database
  const exercises = [
    // Chest Exercises
    {
      id: 1,
      name: 'Push-ups',
      category: 'chest',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      muscles: ['Chest', 'Triceps', 'Shoulders'],
      description: 'Classic upper body exercise that builds chest, shoulders, and triceps strength.',
      instructions: [
        'Start in a plank position with hands slightly wider than shoulder-width',
        'Keep your body straight from head to heels',
        'Lower your body until chest nearly touches the floor',
        'Push back up to starting position',
        'Keep core engaged throughout'
      ],
      tips: 'Keep elbows at 45-degree angle, not flared out. Maintain neutral spine.',
      sets: '3-4',
      reps: '8-15'
    },
    {
      id: 2,
      name: 'Bench Press',
      category: 'chest',
      difficulty: 'intermediate',
      equipment: 'barbell',
      muscles: ['Chest', 'Triceps', 'Shoulders'],
      description: 'Compound exercise for building chest mass and upper body strength.',
      instructions: [
        'Lie on bench with feet flat on floor',
        'Grip barbell slightly wider than shoulder-width',
        'Lower bar to mid-chest with control',
        'Press bar back up to starting position',
        'Keep shoulder blades retracted'
      ],
      tips: 'Use a spotter for safety. Keep wrists straight and bar path vertical.',
      sets: '3-5',
      reps: '6-10'
    },
    // Back Exercises
    {
      id: 3,
      name: 'Pull-ups',
      category: 'back',
      difficulty: 'intermediate',
      equipment: 'pull-up bar',
      muscles: ['Lats', 'Biceps', 'Upper Back'],
      description: 'Bodyweight exercise for developing a strong, wide back.',
      instructions: [
        'Hang from bar with overhand grip, hands shoulder-width apart',
        'Pull yourself up until chin clears the bar',
        'Lower yourself with control to full extension',
        'Keep core tight and avoid swinging',
        'Focus on pulling with your back, not just arms'
      ],
      tips: 'Use resistance bands for assistance if needed. Squeeze shoulder blades at top.',
      sets: '3-4',
      reps: '5-12'
    },
    {
      id: 4,
      name: 'Bent Over Rows',
      category: 'back',
      difficulty: 'intermediate',
      equipment: 'barbell',
      muscles: ['Lats', 'Rhomboids', 'Biceps'],
      description: 'Compound movement for building thick, strong back muscles.',
      instructions: [
        'Stand with feet hip-width, knees slightly bent',
        'Hinge at hips to 45-degree angle, back straight',
        'Pull bar to lower chest/upper abdomen',
        'Squeeze shoulder blades together at top',
        'Lower with control'
      ],
      tips: 'Keep back straight, core engaged. Pull bar to belly button area.',
      sets: '3-4',
      reps: '8-12'
    },
    // Legs Exercises
    {
      id: 5,
      name: 'Squats',
      category: 'legs',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      muscles: ['Quads', 'Glutes', 'Hamstrings'],
      description: 'Fundamental lower body exercise for building leg strength and mass.',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Lower body by bending knees and hips',
        'Go down until thighs are parallel to floor',
        'Keep chest up and back straight',
        'Push through heels to return to start'
      ],
      tips: 'Keep knees tracking over toes. Don\'t let knees cave inward.',
      sets: '3-5',
      reps: '10-15'
    },
    {
      id: 6,
      name: 'Lunges',
      category: 'legs',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      muscles: ['Quads', 'Glutes', 'Hamstrings'],
      description: 'Unilateral leg exercise that builds strength and balance.',
      instructions: [
        'Stand upright with feet hip-width apart',
        'Step forward with one leg',
        'Lower back knee toward ground',
        'Front thigh should be parallel to floor',
        'Push back to starting position'
      ],
      tips: 'Keep torso upright. Front knee shouldn\'t extend past toes.',
      sets: '3',
      reps: '10-12 per leg'
    },
    {
      id: 7,
      name: 'Deadlifts',
      category: 'legs',
      difficulty: 'advanced',
      equipment: 'barbell',
      muscles: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
      description: 'King of compound exercises for total body strength and power.',
      instructions: [
        'Stand with feet hip-width, bar over mid-foot',
        'Bend at hips and knees to grip bar',
        'Keep back straight, chest up',
        'Drive through heels, extend hips and knees',
        'Stand tall, then lower with control'
      ],
      tips: 'Keep bar close to body. Brace core. Don\'t round lower back.',
      sets: '3-5',
      reps: '5-8'
    },
    // Shoulders
    {
      id: 8,
      name: 'Shoulder Press',
      category: 'shoulders',
      difficulty: 'beginner',
      equipment: 'dumbbells',
      muscles: ['Shoulders', 'Triceps'],
      description: 'Build strong, rounded shoulders with this overhead pressing movement.',
      instructions: [
        'Sit or stand with dumbbells at shoulder height',
        'Press weights overhead until arms are fully extended',
        'Lower with control back to shoulders',
        'Keep core engaged and back neutral',
        'Avoid arching lower back'
      ],
      tips: 'Press in slight arc, not straight up. Keep wrists neutral.',
      sets: '3-4',
      reps: '8-12'
    },
    {
      id: 9,
      name: 'Lateral Raises',
      category: 'shoulders',
      difficulty: 'beginner',
      equipment: 'dumbbells',
      muscles: ['Side Delts'],
      description: 'Isolation exercise for building wider, more defined shoulders.',
      instructions: [
        'Stand with dumbbells at sides, palms facing in',
        'Raise arms out to sides until parallel to floor',
        'Keep slight bend in elbows',
        'Lower with control',
        'Don\'t use momentum'
      ],
      tips: 'Lead with elbows, not hands. Keep pinky slightly higher than thumb.',
      sets: '3',
      reps: '12-15'
    },
    // Arms
    {
      id: 10,
      name: 'Bicep Curls',
      category: 'arms',
      difficulty: 'beginner',
      equipment: 'dumbbells',
      muscles: ['Biceps'],
      description: 'Classic arm exercise for building bigger, stronger biceps.',
      instructions: [
        'Stand with dumbbells at sides, palms forward',
        'Curl weights up toward shoulders',
        'Keep elbows stationary at sides',
        'Squeeze biceps at top',
        'Lower with control'
      ],
      tips: 'Don\'t swing or use momentum. Keep upper arms still.',
      sets: '3',
      reps: '10-12'
    },
    {
      id: 11,
      name: 'Tricep Dips',
      category: 'arms',
      difficulty: 'intermediate',
      equipment: 'parallel bars',
      muscles: ['Triceps', 'Chest', 'Shoulders'],
      description: 'Bodyweight exercise for building strong, defined triceps.',
      instructions: [
        'Grip parallel bars and lift body up',
        'Lower body by bending elbows to 90 degrees',
        'Keep elbows close to body',
        'Push back up to starting position',
        'Keep chest upright'
      ],
      tips: 'Lean forward for chest emphasis, stay upright for triceps.',
      sets: '3',
      reps: '8-12'
    },
    // Core
    {
      id: 12,
      name: 'Plank',
      category: 'core',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      muscles: ['Abs', 'Core', 'Lower Back'],
      description: 'Isometric core exercise for building stability and endurance.',
      instructions: [
        'Start in forearm plank position',
        'Keep body straight from head to heels',
        'Engage core and glutes',
        'Hold position without sagging or piking',
        'Breathe normally'
      ],
      tips: 'Don\'t hold breath. Keep hips level with shoulders.',
      sets: '3',
      reps: '30-60 seconds'
    },
    {
      id: 13,
      name: 'Crunches',
      category: 'core',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      muscles: ['Upper Abs'],
      description: 'Targeted ab exercise for building six-pack definition.',
      instructions: [
        'Lie on back with knees bent, feet flat',
        'Place hands behind head or across chest',
        'Lift shoulder blades off floor',
        'Squeeze abs at top',
        'Lower with control'
      ],
      tips: 'Don\'t pull on neck. Focus on using abs, not momentum.',
      sets: '3',
      reps: '15-20'
    },
    // Cardio
    {
      id: 14,
      name: 'Burpees',
      category: 'cardio',
      difficulty: 'intermediate',
      equipment: 'bodyweight',
      muscles: ['Full Body'],
      description: 'High-intensity full-body exercise for conditioning and fat loss.',
      instructions: [
        'Start standing',
        'Drop into squat and place hands on floor',
        'Jump feet back into plank position',
        'Do a push-up (optional)',
        'Jump feet back to hands and explode up'
      ],
      tips: 'Maintain good form even when tired. Land softly.',
      sets: '3-4',
      reps: '10-15'
    },
    {
      id: 15,
      name: 'Mountain Climbers',
      category: 'cardio',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      muscles: ['Core', 'Shoulders', 'Legs'],
      description: 'Dynamic cardio exercise that strengthens core and burns calories.',
      instructions: [
        'Start in high plank position',
        'Drive one knee toward chest',
        'Quickly switch legs',
        'Keep hips level and core engaged',
        'Maintain steady rhythm'
      ],
      tips: 'Keep core tight. Speed up for cardio, slow down for control.',
      sets: '3',
      reps: '30-45 seconds'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Exercises', icon: '💪' },
    { id: 'chest', name: 'Chest', icon: '🏋️' },
    { id: 'back', name: 'Back', icon: '💪' },
    { id: 'legs', name: 'Legs', icon: '🦵' },
    { id: 'shoulders', name: 'Shoulders', icon: '🏋️' },
    { id: 'arms', name: 'Arms', icon: '💪' },
    { id: 'core', name: 'Core', icon: '🔥' },
    { id: 'cardio', name: 'Cardio', icon: '🏃' }
  ];

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exercise.muscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const difficultyColors = {
    beginner: '#2ecc71',
    intermediate: '#f39c12',
    advanced: '#e74c3c'
  };

  return (
    <div className="exercise-library-container">
      {/* Header */}
      <div className="library-header">
        <div className="header-content">
          <h1>💪 Exercise Library</h1>
          <p>Discover exercises for every muscle group</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            📊 Dashboard
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            💬 Chat
          </button>
          <button onClick={() => navigate('/workouts')} className="btn-secondary">
            📝 Workouts
          </button>
          <button onClick={() => navigate('/scheduler')} className="btn-secondary">
            📅 Scheduler
          </button>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      <div className="library-content">
        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search exercises or muscle groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="difficulty-filters">
            <span className="filter-label">Difficulty:</span>
            {difficulties.map(diff => (
              <button
                key={diff}
                className={`diff-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="exercises-section">
          <div className="results-header">
            <h2>
              {selectedCategory !== 'all' 
                ? categories.find(c => c.id === selectedCategory)?.name 
                : 'All Exercises'}
            </h2>
            <span className="results-count">{filteredExercises.length} exercises</span>
          </div>

          {filteredExercises.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>No exercises found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="exercises-grid">
              {filteredExercises.map(exercise => (
                <div 
                  key={exercise.id} 
                  className="exercise-card"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <div className="exercise-header">
                    <h3>{exercise.name}</h3>
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: difficultyColors[exercise.difficulty] }}
                    >
                      {exercise.difficulty}
                    </span>
                  </div>

                  <div className="exercise-info">
                    <div className="info-item">
                      <span className="info-icon">🎯</span>
                      <span>{exercise.muscles.join(', ')}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">🏋️</span>
                      <span>{exercise.equipment}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📊</span>
                      <span>{exercise.sets} sets × {exercise.reps} reps</span>
                    </div>
                  </div>

                  <p className="exercise-description">{exercise.description}</p>

                  <button className="view-details-btn">
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="modal-overlay" onClick={() => setSelectedExercise(null)}>
          <div className="modal-content exercise-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedExercise.name}</h2>
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: difficultyColors[selectedExercise.difficulty] }}
                >
                  {selectedExercise.difficulty}
                </span>
              </div>
              <button onClick={() => setSelectedExercise(null)} className="modal-close">×</button>
            </div>

            <div className="modal-body">
              <div className="exercise-stats">
                <div className="stat-item">
                  <strong>Target Muscles</strong>
                  <p>{selectedExercise.muscles.join(', ')}</p>
                </div>
                <div className="stat-item">
                  <strong>Equipment</strong>
                  <p>{selectedExercise.equipment}</p>
                </div>
                <div className="stat-item">
                  <strong>Recommended</strong>
                  <p>{selectedExercise.sets} sets × {selectedExercise.reps} reps</p>
                </div>
              </div>

              <div className="exercise-section">
                <h3>📝 Description</h3>
                <p>{selectedExercise.description}</p>
              </div>

              <div className="exercise-section">
                <h3>🎯 How To Perform</h3>
                <ol className="instructions-list">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>

              <div className="exercise-section">
                <h3>💡 Pro Tips</h3>
                <p className="tips-text">{selectedExercise.tips}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;
