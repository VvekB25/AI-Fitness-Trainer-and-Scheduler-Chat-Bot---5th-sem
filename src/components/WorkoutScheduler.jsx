import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/WorkoutScheduler.css';

const WorkoutScheduler = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(getWeekDates(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    loadSchedule();
  }, []);

  function getWeekDates(date) {
    const week = [];
    const current = new Date(date);
    const day = current.getDay();
    const diff = current.getDate() - day; // First day is Sunday

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(current.setDate(diff + i));
      week.push(weekDate);
    }
    return week;
  }

  const loadSchedule = () => {
    // Load from localStorage (in production, this would be from backend)
    const saved = localStorage.getItem('workoutSchedule');
    if (saved) {
      setSchedule(JSON.parse(saved));
    }
  };

  const saveSchedule = (newSchedule) => {
    localStorage.setItem('workoutSchedule', JSON.stringify(newSchedule));
    setSchedule(newSchedule);
  };

  const addWorkout = (date, workout) => {
    const dateKey = date.toDateString();
    const newSchedule = {
      ...schedule,
      [dateKey]: [...(schedule[dateKey] || []), workout]
    };
    saveSchedule(newSchedule);
  };

  const removeWorkout = (date, index) => {
    const dateKey = date.toDateString();
    const newSchedule = {
      ...schedule,
      [dateKey]: schedule[dateKey].filter((_, i) => i !== index)
    };
    saveSchedule(newSchedule);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek[0]);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeek(getWeekDates(newDate));
  };

  const goToToday = () => {
    setCurrentWeek(getWeekDates(new Date()));
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDateWorkouts = (date) => {
    return schedule[date.toDateString()] || [];
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  // Quick add templates
  const workoutTemplates = [
    { name: 'Full Body Strength', duration: 60, type: 'strength', emoji: '💪' },
    { name: 'Upper Body', duration: 45, type: 'strength', emoji: '🏋️' },
    { name: 'Lower Body', duration: 45, type: 'strength', emoji: '🦵' },
    { name: 'Cardio Run', duration: 30, type: 'cardio', emoji: '🏃' },
    { name: 'HIIT Training', duration: 30, type: 'cardio', emoji: '🔥' },
    { name: 'Yoga/Stretching', duration: 30, type: 'flexibility', emoji: '🧘' },
    { name: 'Rest Day', duration: 0, type: 'rest', emoji: '😴' }
  ];

  return (
    <div className="scheduler-container">
      {/* Header */}
      <div className="scheduler-header">
        <div className="header-content">
          <h1>📅 Workout Scheduler</h1>
          <p>Plan your fitness week</p>
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
          <button onClick={() => navigate('/exercises')} className="btn-secondary">
            💪 Exercises
          </button>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      <div className="scheduler-content">
        {/* Calendar Controls */}
        <div className="calendar-controls">
          <button onClick={() => navigateWeek(-1)} className="nav-btn">
            ← Previous Week
          </button>
          <div className="current-range">
            <h2>
              {monthNames[currentWeek[0].getMonth()]} {currentWeek[0].getDate()} - {monthNames[currentWeek[6].getMonth()]} {currentWeek[6].getDate()}, {currentWeek[0].getFullYear()}
            </h2>
            <button onClick={goToToday} className="today-btn">
              Today
            </button>
          </div>
          <button onClick={() => navigateWeek(1)} className="nav-btn">
            Next Week →
          </button>
        </div>

        {/* Weekly Calendar */}
        <div className="calendar-grid">
          {currentWeek.map((date, index) => {
            const dateWorkouts = getDateWorkouts(date);
            const today = isToday(date);
            const past = isPast(date);

            return (
              <div 
                key={index} 
                className={`calendar-day ${today ? 'today' : ''} ${past ? 'past' : ''}`}
              >
                <div className="day-header">
                  <div className="day-info">
                    <span className="day-name">{dayNames[index]}</span>
                    <span className="day-date">{date.getDate()}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedDate(date);
                      setShowAddModal(true);
                    }}
                    className="add-workout-btn"
                    title="Add workout"
                  >
                    +
                  </button>
                </div>

                <div className="day-workouts">
                  {dateWorkouts.length === 0 ? (
                    <div className="no-workouts">
                      <span>No workouts planned</span>
                    </div>
                  ) : (
                    dateWorkouts.map((workout, idx) => (
                      <div key={idx} className={`workout-item ${workout.type}`}>
                        <div className="workout-info">
                          <span className="workout-emoji">{workout.emoji}</span>
                          <div className="workout-details">
                            <strong>{workout.name}</strong>
                            {workout.duration > 0 && (
                              <span className="workout-duration">{workout.duration} min</span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => removeWorkout(date, idx)}
                          className="remove-btn"
                          title="Remove workout"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Summary */}
        <div className="weekly-summary">
          <h3>📊 This Week Summary</h3>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-value">
                {Object.values(schedule)
                  .flat()
                  .filter(w => currentWeek.some(d => d.toDateString() === Object.keys(schedule).find(k => schedule[k].includes(w))))
                  .length}
              </span>
              <span className="stat-label">Workouts Planned</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">
                {Object.values(schedule)
                  .flat()
                  .filter(w => currentWeek.some(d => d.toDateString() === Object.keys(schedule).find(k => schedule[k].includes(w))))
                  .reduce((sum, w) => sum + w.duration, 0)} min
              </span>
              <span className="stat-label">Total Time</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">
                {user?.goals?.weeklyWorkouts || 3}
              </span>
              <span className="stat-label">Weekly Goal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Workout Modal */}
      {showAddModal && selectedDate && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content scheduler-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Workout - {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h2>
              <button onClick={() => setShowAddModal(false)} className="modal-close">×</button>
            </div>

            <div className="modal-body">
              <h3>Quick Add Templates</h3>
              <div className="templates-grid">
                {workoutTemplates.map((template, index) => (
                  <button
                    key={index}
                    className={`template-btn ${template.type}`}
                    onClick={() => {
                      addWorkout(selectedDate, template);
                      setShowAddModal(false);
                    }}
                  >
                    <span className="template-emoji">{template.emoji}</span>
                    <div className="template-info">
                      <strong>{template.name}</strong>
                      {template.duration > 0 && (
                        <span className="template-duration">{template.duration} min</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="custom-workout-section">
                <h3>Or Create Custom Workout</h3>
                <CustomWorkoutForm 
                  onSubmit={(workout) => {
                    addWorkout(selectedDate, workout);
                    setShowAddModal(false);
                  }}
                  onCancel={() => setShowAddModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Workout Form Component
const CustomWorkoutForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    type: 'strength',
    emoji: '💪'
  });

  const typeEmojis = {
    strength: '💪',
    cardio: '🏃',
    flexibility: '🧘',
    rest: '😴'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.duration) return;

    onSubmit({
      name: formData.name,
      duration: parseInt(formData.duration),
      type: formData.type,
      emoji: typeEmojis[formData.type]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="custom-form">
      <div className="form-group">
        <label>Workout Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="e.g., Morning Chest & Triceps"
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
            placeholder="45"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="rest">Rest</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          Add Workout ✓
        </button>
      </div>
    </form>
  );
};

export default WorkoutScheduler;
