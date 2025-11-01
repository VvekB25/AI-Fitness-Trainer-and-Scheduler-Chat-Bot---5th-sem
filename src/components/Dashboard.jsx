import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { workoutAPI } from '../utils/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    workoutsThisWeek: 0,
    totalWorkouts: 0,
    currentStreak: 0,
    longestStreak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const response = await workoutAPI.getStats();
      if (response.data.success) {
        const apiStats = response.data.stats;
        setStats({
          workoutsThisWeek: apiStats.workoutsThisWeek,
          totalWorkouts: apiStats.totalWorkouts,
          currentStreak: apiStats.streak.current,
          longestStreak: apiStats.streak.longest
        });
      }
    } catch (error) {
      console.error('Load stats error:', error);
      // Fallback to user data
      setStats({
        workoutsThisWeek: user?.streak?.current || 0,
        totalWorkouts: 0,
        currentStreak: user?.streak?.current || 0,
        longestStreak: user?.streak?.longest || 0
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (!user?.profile?.height || !user?.profile?.weight) return null;
    const heightInM = user.profile.height / 100;
    const bmi = (user.profile.weight / (heightInM * heightInM)).toFixed(1);
    return bmi;
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return { category: 'Unknown', color: '#999' };
    if (bmi < 18.5) return { category: 'Underweight', color: '#3498db' };
    if (bmi < 25) return { category: 'Normal', color: '#2ecc71' };
    if (bmi < 30) return { category: 'Overweight', color: '#f39c12' };
    return { category: 'Obese', color: '#e74c3c' };
  };

  const bmi = calculateBMI();
  const bmiInfo = getBMICategory(bmi);

  const fitnessLevelEmoji = {
    beginner: '🌱',
    intermediate: '💪',
    advanced: '🏆'
  };

  const goalEmoji = {
    'weight-loss': '⚖️',
    'muscle-gain': '💪',
    'maintenance': '🎯',
    'endurance': '🏃',
    'flexibility': '🤸'
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>👋 Welcome back, {user?.name}!</h1>
          <p>Here's your fitness overview</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="btn-secondary">
            💬 Chat
          </button>
          <button onClick={() => navigate('/workouts')} className="btn-secondary">
            📝 Workouts
          </button>
          <button onClick={() => navigate('/exercises')} className="btn-secondary">
            💪 Exercises
          </button>
          <button onClick={() => navigate('/scheduler')} className="btn-secondary">
            📅 Scheduler
          </button>
          <button onClick={() => navigate('/profile-setup')} className="btn-secondary">
            ⚙️ Edit Profile
          </button>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card purple">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <h3>{stats.currentStreak}</h3>
              <p>Day Streak</p>
            </div>
          </div>

          <div className="stat-card blue">
            <div className="stat-icon">🏋️</div>
            <div className="stat-info">
              <h3>{stats.workoutsThisWeek}</h3>
              <p>This Week</p>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.totalWorkouts}</h3>
              <p>Total Workouts</p>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>{stats.longestStreak}</h3>
              <p>Best Streak</p>
            </div>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="dashboard-section">
          <h2>📊 Profile Overview</h2>
          <div className="profile-cards">
            {/* Basic Info */}
            <div className="profile-card">
              <h3>Basic Information</h3>
              {user?.profile?.age ? (
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="label">Age:</span>
                    <span className="value">{user.profile.age} years</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Gender:</span>
                    <span className="value">{user.profile.gender}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Height:</span>
                    <span className="value">{user.profile.height} cm</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Weight:</span>
                    <span className="value">{user.profile.weight} kg</span>
                  </div>
                  {bmi && (
                    <div className="detail-row highlight">
                      <span className="label">BMI:</span>
                      <span className="value" style={{ color: bmiInfo.color }}>
                        {bmi} ({bmiInfo.category})
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Complete your profile to see stats</p>
                  <button onClick={() => navigate('/profile-setup')} className="btn-primary">
                    Complete Profile
                  </button>
                </div>
              )}
            </div>

            {/* Fitness Info */}
            <div className="profile-card">
              <h3>Fitness Level</h3>
              {user?.profile?.fitnessLevel ? (
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="label">Level:</span>
                    <span className="value">
                      {fitnessLevelEmoji[user.profile.fitnessLevel] || '💪'} {user.profile.fitnessLevel}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Activity:</span>
                    <span className="value">{user.profile.activityLevel}</span>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No fitness data yet</p>
                </div>
              )}
            </div>

            {/* Goals */}
            <div className="profile-card">
              <h3>Goals</h3>
              {user?.goals?.fitnessGoal ? (
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="label">Primary Goal:</span>
                    <span className="value">
                      {goalEmoji[user.goals.fitnessGoal] || '🎯'} {user.goals.fitnessGoal}
                    </span>
                  </div>
                  {user.goals.targetWeight && (
                    <div className="detail-row">
                      <span className="label">Target Weight:</span>
                      <span className="value">{user.goals.targetWeight} kg</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Weekly Workouts:</span>
                    <span className="value">{user.goals.weeklyWorkouts} days</span>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No goals set yet</p>
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="profile-card">
              <h3>Preferences</h3>
              {user?.preferences?.equipment ? (
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="label">Equipment:</span>
                    <span className="value">{user.preferences.equipment.join(', ')}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Duration:</span>
                    <span className="value">{user.preferences.workoutDuration} min</span>
                  </div>
                  {user.preferences.injuries && user.preferences.injuries.length > 0 && (
                    <div className="detail-row">
                      <span className="label">Limitations:</span>
                      <span className="value">{user.preferences.injuries.join(', ')}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No preferences set</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>🚀 Quick Actions</h2>
          <div className="action-buttons">
            <button onClick={() => navigate('/')} className="action-button">
              <span className="action-emoji">💬</span>
              <div className="action-text">
                <strong>Start Chat</strong>
                <small>Talk to your AI trainer</small>
              </div>
            </button>
            <button onClick={() => navigate('/workouts')} className="action-button">
              <span className="action-emoji">📝</span>
              <div className="action-text">
                <strong>Workout History</strong>
                <small>Log and view workouts</small>
              </div>
            </button>
            <button onClick={() => navigate('/exercises')} className="action-button">
              <span className="action-emoji">💪</span>
              <div className="action-text">
                <strong>Exercise Library</strong>
                <small>Browse 15+ exercises</small>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
