import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileSetup.css';

const ProfileSetup = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    // Basic Info
    age: '',
    gender: '',
    height: '',
    weight: '',
    
    // Fitness Info
    fitnessLevel: 'beginner',
    activityLevel: 'moderate',
    
    // Goals
    fitnessGoal: 'maintenance',
    targetWeight: '',
    weeklyWorkouts: 3,
    
    // Preferences
    equipment: [],
    workoutDuration: 30,
    injuries: []
  });
  
  const [customInjury, setCustomInjury] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load existing user data when component mounts
  useEffect(() => {
    if (user) {
      setProfileData({
        age: user.profile?.age || '',
        gender: user.profile?.gender || '',
        height: user.profile?.height || '',
        weight: user.profile?.weight || '',
        fitnessLevel: user.profile?.fitnessLevel || 'beginner',
        activityLevel: user.profile?.activityLevel || 'moderate',
        fitnessGoal: user.goals?.fitnessGoal || 'maintenance',
        targetWeight: user.goals?.targetWeight || '',
        weeklyWorkouts: user.goals?.weeklyWorkouts || 3,
        equipment: user.preferences?.equipment || [],
        workoutDuration: user.preferences?.workoutDuration || 30,
        injuries: user.preferences?.injuries || []
      });
    }
  }, [user]);

  const equipmentOptions = [
    'bodyweight',
    'dumbbells',
    'barbell',
    'resistance-bands',
    'gym-equipment',
    'none'
  ];

  const commonInjuries = [
    'Lower back pain',
    'Knee pain',
    'Shoulder pain',
    'Wrist pain',
    'Ankle issues',
    'None'
  ];

  const handleChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleEquipmentToggle = (equipment) => {
    setProfileData(prev => {
      const current = prev.equipment || [];
      const isSelected = current.includes(equipment);
      
      if (equipment === 'none') {
        return { ...prev, equipment: ['none'] };
      }
      
      const filtered = current.filter(e => e !== 'none');
      
      if (isSelected) {
        return { ...prev, equipment: filtered.filter(e => e !== equipment) };
      } else {
        return { ...prev, equipment: [...filtered, equipment] };
      }
    });
  };

  const handleInjuryToggle = (injury) => {
    setProfileData(prev => {
      const current = prev.injuries || [];
      const isSelected = current.includes(injury);
      
      if (injury === 'None') {
        return { ...prev, injuries: [] };
      }
      
      const filtered = current.filter(i => i !== 'None');
      
      if (isSelected) {
        return { ...prev, injuries: filtered.filter(i => i !== injury) };
      } else {
        return { ...prev, injuries: [...filtered, injury] };
      }
    });
  };

  const addCustomInjury = () => {
    if (customInjury.trim()) {
      setProfileData(prev => ({
        ...prev,
        injuries: [...(prev.injuries || []).filter(i => i !== 'None'), customInjury.trim()]
      }));
      setCustomInjury('');
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const validateStep = () => {
    switch(step) {
      case 1:
        if (!profileData.age || !profileData.gender || !profileData.height || !profileData.weight) {
          setError('Please fill in all basic information');
          return false;
        }
        if (profileData.age < 13 || profileData.age > 120) {
          setError('Please enter a valid age');
          return false;
        }
        break;
      case 2:
        if (!profileData.fitnessLevel || !profileData.activityLevel) {
          setError('Please select your fitness and activity level');
          return false;
        }
        break;
      case 3:
        if (!profileData.fitnessGoal || !profileData.weeklyWorkouts) {
          setError('Please complete your goals');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setLoading(true);
    setError('');

    try {
      const result = await updateProfile({
        profile: {
          age: parseInt(profileData.age),
          gender: profileData.gender,
          height: parseInt(profileData.height),
          weight: parseInt(profileData.weight),
          fitnessLevel: profileData.fitnessLevel,
          activityLevel: profileData.activityLevel
        },
        goals: {
          fitnessGoal: profileData.fitnessGoal,
          targetWeight: profileData.targetWeight ? parseInt(profileData.targetWeight) : undefined,
          weeklyWorkouts: parseInt(profileData.weeklyWorkouts)
        },
        preferences: {
          equipment: profileData.equipment.length > 0 ? profileData.equipment : ['bodyweight'],
          workoutDuration: parseInt(profileData.workoutDuration),
          injuries: profileData.injuries
        }
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Failed to save profile');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const skipSetup = () => {
    navigate('/dashboard');
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-box">
        <div className="setup-header">
          <h1>🏋️ Complete Your Profile</h1>
          <p>Help us personalize your fitness journey</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
          <p className="step-indicator">Step {step} of 4</p>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="setup-step">
            <h2>📋 Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  placeholder="25"
                  min="13"
                  max="120"
                />
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <select
                  value={profileData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Height (cm) *</label>
                <input
                  type="number"
                  value={profileData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  placeholder="170"
                />
              </div>

              <div className="form-group">
                <label>Weight (kg) *</label>
                <input
                  type="number"
                  value={profileData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  placeholder="70"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Fitness Level */}
        {step === 2 && (
          <div className="setup-step">
            <h2>💪 Fitness Level</h2>
            
            <div className="form-group">
              <label>Current Fitness Level *</label>
              <div className="radio-group">
                <label className={profileData.fitnessLevel === 'beginner' ? 'active' : ''}>
                  <input
                    type="radio"
                    name="fitnessLevel"
                    value="beginner"
                    checked={profileData.fitnessLevel === 'beginner'}
                    onChange={(e) => handleChange('fitnessLevel', e.target.value)}
                  />
                  <div className="radio-content">
                    <strong>Beginner</strong>
                    <span>New to fitness or returning after a break</span>
                  </div>
                </label>

                <label className={profileData.fitnessLevel === 'intermediate' ? 'active' : ''}>
                  <input
                    type="radio"
                    name="fitnessLevel"
                    value="intermediate"
                    checked={profileData.fitnessLevel === 'intermediate'}
                    onChange={(e) => handleChange('fitnessLevel', e.target.value)}
                  />
                  <div className="radio-content">
                    <strong>Intermediate</strong>
                    <span>Regular exercise, comfortable with basics</span>
                  </div>
                </label>

                <label className={profileData.fitnessLevel === 'advanced' ? 'active' : ''}>
                  <input
                    type="radio"
                    name="fitnessLevel"
                    value="advanced"
                    checked={profileData.fitnessLevel === 'advanced'}
                    onChange={(e) => handleChange('fitnessLevel', e.target.value)}
                  />
                  <div className="radio-content">
                    <strong>Advanced</strong>
                    <span>Experienced athlete, intense training</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Activity Level *</label>
              <select
                value={profileData.activityLevel}
                onChange={(e) => handleChange('activityLevel', e.target.value)}
              >
                <option value="sedentary">Sedentary (Little or no exercise)</option>
                <option value="light">Light (Exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (Exercise 3-5 days/week)</option>
                <option value="active">Active (Exercise 6-7 days/week)</option>
                <option value="very-active">Very Active (Physical job + exercise)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div className="setup-step">
            <h2>🎯 Your Goals</h2>
            
            <div className="form-group">
              <label>Primary Fitness Goal *</label>
              <select
                value={profileData.fitnessGoal}
                onChange={(e) => handleChange('fitnessGoal', e.target.value)}
              >
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="endurance">Endurance</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target Weight (kg)</label>
              <input
                type="number"
                value={profileData.targetWeight}
                onChange={(e) => handleChange('targetWeight', e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="form-group">
              <label>Workouts per Week *</label>
              <input
                type="number"
                value={profileData.weeklyWorkouts}
                onChange={(e) => handleChange('weeklyWorkouts', e.target.value)}
                min="1"
                max="7"
              />
            </div>

            <div className="form-group">
              <label>Workout Duration (minutes)</label>
              <input
                type="number"
                value={profileData.workoutDuration}
                onChange={(e) => handleChange('workoutDuration', e.target.value)}
                placeholder="30"
              />
            </div>
          </div>
        )}

        {/* Step 4: Preferences */}
        {step === 4 && (
          <div className="setup-step">
            <h2>⚙️ Preferences</h2>
            
            <div className="form-group">
              <label>Available Equipment</label>
              <div className="checkbox-group">
                {equipmentOptions.map(equipment => (
                  <label key={equipment} className={profileData.equipment?.includes(equipment) ? 'active' : ''}>
                    <input
                      type="checkbox"
                      checked={profileData.equipment?.includes(equipment)}
                      onChange={() => handleEquipmentToggle(equipment)}
                    />
                    <span>{equipment.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Injuries or Limitations</label>
              <div className="checkbox-group">
                {commonInjuries.map(injury => (
                  <label key={injury} className={profileData.injuries?.includes(injury) ? 'active' : ''}>
                    <input
                      type="checkbox"
                      checked={profileData.injuries?.includes(injury)}
                      onChange={() => handleInjuryToggle(injury)}
                    />
                    <span>{injury}</span>
                  </label>
                ))}
              </div>
              
              <div className="custom-injury">
                <input
                  type="text"
                  value={customInjury}
                  onChange={(e) => setCustomInjury(e.target.value)}
                  placeholder="Add custom injury/limitation"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomInjury()}
                />
                <button type="button" onClick={addCustomInjury}>Add</button>
              </div>

              {profileData.injuries && profileData.injuries.length > 0 && !commonInjuries.includes(profileData.injuries[0]) && (
                <div className="selected-injuries">
                  {profileData.injuries.filter(i => !commonInjuries.includes(i)).map((injury, index) => (
                    <span key={index} className="injury-tag">
                      {injury}
                      <button onClick={() => setProfileData(prev => ({
                        ...prev,
                        injuries: prev.injuries.filter(i => i !== injury)
                      }))}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="setup-actions">
          {step > 1 && (
            <button onClick={prevStep} className="btn-secondary">
              ← Back
            </button>
          )}
          
          {step < 4 ? (
            <button onClick={nextStep} className="btn-primary">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Complete Setup ✓'}
            </button>
          )}
          
          <button onClick={skipSetup} className="btn-skip">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
