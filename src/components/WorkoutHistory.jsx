import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { workoutAPI } from '../utils/api';
import '../styles/WorkoutHistory.css';

const WorkoutHistory = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [historyRes, statsRes] = await Promise.all([
        workoutAPI.getHistory(),
        workoutAPI.getStats()
      ]);

      if (historyRes.data.success) {
        setWorkouts(historyRes.data.workouts);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;

    try {
      await workoutAPI.deleteWorkout(id);
      setWorkouts(workouts.filter(w => w._id !== id));
      loadData(); // Reload stats
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete workout');
    }
  };

  const difficultyColors = {
    easy: '#2ecc71',
    moderate: '#3498db',
    hard: '#f39c12',
    'very-hard': '#e74c3c'
  };

  const moodEmojis = {
    great: '😄',
    good: '😊',
    okay: '😐',
    tired: '😓',
    exhausted: '😫'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="workout-history-container">
      {/* Header */}
      <div className="history-header">
        <div className="header-content">
          <h1>📝 Workout History</h1>
          <p>Track your fitness journey</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            📊 Dashboard
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            💬 Chat
          </button>
          <button onClick={() => navigate('/exercises')} className="btn-secondary">
            💪 Exercises
          </button>
          <button onClick={() => navigate('/scheduler')} className="btn-secondary">
            📅 Scheduler
          </button>
          <button onClick={() => setShowLogModal(true)} className="btn-primary">
            ➕ Log Workout
          </button>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      <div className="history-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your workouts...</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            {stats && (
              <div className="stats-overview">
                <div className="stat-box">
                  <span className="stat-icon">🏋️</span>
                  <div className="stat-details">
                    <h3>{stats.totalWorkouts}</h3>
                    <p>Total Workouts</p>
                  </div>
                </div>
                <div className="stat-box">
                  <span className="stat-icon">📅</span>
                  <div className="stat-details">
                    <h3>{stats.workoutsThisWeek}</h3>
                    <p>This Week</p>
                  </div>
                </div>
                <div className="stat-box">
                  <span className="stat-icon">🔥</span>
                  <div className="stat-details">
                    <h3>{stats.totalCalories}</h3>
                    <p>Calories Burned</p>
                  </div>
                </div>
                <div className="stat-box">
                  <span className="stat-icon">⏱️</span>
                  <div className="stat-details">
                    <h3>{stats.totalHours}h</h3>
                    <p>Total Time</p>
                  </div>
                </div>
                <div className="stat-box">
                  <span className="stat-icon">⚡</span>
                  <div className="stat-details">
                    <h3>{stats.streak.current}</h3>
                    <p>Day Streak</p>
                  </div>
                </div>
              </div>
            )}

            {/* Workout List */}
            <div className="workouts-section">
              <h2>Recent Workouts</h2>
              {workouts.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🏋️</span>
                  <h3>No workouts logged yet</h3>
                  <p>Start tracking your fitness journey!</p>
                  <button onClick={() => setShowLogModal(true)} className="btn-primary">
                    Log Your First Workout
                  </button>
                </div>
              ) : (
                <div className="workouts-list">
                  {workouts.map((workout) => (
                    <div key={workout._id} className="workout-card">
                      <div className="workout-header">
                        <div className="workout-title">
                          <h3>{workout.workoutName}</h3>
                          <span className="workout-date">
                            {formatDate(workout.completedAt)} at {formatTime(workout.completedAt)}
                          </span>
                        </div>
                        <button 
                          onClick={() => deleteWorkout(workout._id)}
                          className="btn-delete"
                          title="Delete workout"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="workout-stats">
                        <div className="workout-stat">
                          <span className="stat-label">⏱️ Duration</span>
                          <span className="stat-value">{workout.duration} min</span>
                        </div>
                        <div className="workout-stat">
                          <span className="stat-label">🔥 Calories</span>
                          <span className="stat-value">{workout.caloriesBurned}</span>
                        </div>
                        <div className="workout-stat">
                          <span className="stat-label">💪 Difficulty</span>
                          <span 
                            className="stat-value difficulty-badge"
                            style={{ backgroundColor: difficultyColors[workout.difficulty] }}
                          >
                            {workout.difficulty}
                          </span>
                        </div>
                        <div className="workout-stat">
                          <span className="stat-label">Mood</span>
                          <span className="stat-value">{moodEmojis[workout.mood]}</span>
                        </div>
                      </div>

                      {workout.exercises && workout.exercises.length > 0 && (
                        <div className="workout-exercises">
                          <strong>Exercises:</strong>
                          <div className="exercise-list">
                            {workout.exercises.map((ex, idx) => (
                              <span key={idx} className="exercise-tag">
                                {ex.name} 
                                {ex.sets > 0 && ` (${ex.sets}×${ex.reps})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {workout.notes && (
                        <div className="workout-notes">
                          <strong>Notes:</strong>
                          <p>{workout.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Log Workout Modal */}
      {showLogModal && (
        <LogWorkoutModal 
          onClose={() => setShowLogModal(false)}
          onSuccess={() => {
            setShowLogModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

// Log Workout Modal Component
const LogWorkoutModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    workoutName: '',
    duration: '',
    caloriesBurned: '',
    difficulty: 'moderate',
    mood: 'good',
    notes: '',
    exercises: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.workoutName || !formData.duration) {
      setError('Workout name and duration are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await workoutAPI.logWorkout({
        ...formData,
        duration: parseInt(formData.duration),
        caloriesBurned: parseInt(formData.caloriesBurned) || 0
      });
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 Log Workout</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Workout Name *</label>
            <input
              type="text"
              value={formData.workoutName}
              onChange={(e) => setFormData({...formData, workoutName: e.target.value})}
              placeholder="e.g., Morning Run, Chest Day, Yoga Session"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="30"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Calories Burned</label>
              <input
                type="number"
                value={formData.caloriesBurned}
                onChange={(e) => setFormData({...formData, caloriesBurned: e.target.value})}
                placeholder="200"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
                <option value="very-hard">Very Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label>How did you feel?</label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({...formData, mood: e.target.value})}
              >
                <option value="great">😄 Great</option>
                <option value="good">😊 Good</option>
                <option value="okay">😐 Okay</option>
                <option value="tired">😓 Tired</option>
                <option value="exhausted">😫 Exhausted</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="How was your workout? Any achievements or struggles?"
              rows="3"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Logging...' : 'Log Workout 🎉'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutHistory;
