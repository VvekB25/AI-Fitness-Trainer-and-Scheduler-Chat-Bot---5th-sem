import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load chat history
    loadHistory();
    // Add welcome message
    setMessages([{
      role: 'assistant',
      content: `Hello ${user?.name || 'there'}! 👋 I'm your AI Fitness Trainer. I'm here to help you with:\n\n💪 Personalized workout plans\n🏋️ Exercise recommendations\n🥗 Nutrition advice\n📊 Progress tracking\n🎯 Goal setting\n\nHow can I help you today?`,
      timestamp: new Date().toISOString()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      const response = await chatAPI.getHistory();
      if (response.data.success && response.data.history.length > 0) {
        setMessages(response.data.history.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date().toISOString()
        })));
      }
    } catch (error) {
      console.error('Load history error:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(input);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: response.data.timestamp
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Send message error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutPlan = async () => {
    setLoading(true);
    const loadingMessage = {
      role: 'assistant',
      content: '🔄 Generating your personalized workout plan...',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await chatAPI.getWorkoutPlan();
      
      const planMessage = {
        role: 'assistant',
        content: response.data.workoutPlan,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev.slice(0, -1), planMessage]);
    } catch (error) {
      console.error('Workout plan error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I couldn\'t generate a workout plan. Please update your profile first or try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await chatAPI.clearHistory();
      setMessages([{
        role: 'assistant',
        content: `Chat cleared! How can I help you today?`,
        timestamp: new Date().toISOString()
      }]);
      setShowQuickActions(true);
    } catch (error) {
      console.error('Clear chat error:', error);
    }
  };

  const handleQuickAction = (action) => {
    setShowQuickActions(false);
    setInput(action);
    // Trigger send
    setTimeout(() => {
      const form = document.querySelector('.input-container');
      form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  const quickActions = [
    {
      icon: '🏋️',
      label: 'Create Workout Plan',
      prompt: 'Create a personalized workout plan for me based on my profile'
    },
    {
      icon: '💪',
      label: 'Today\'s Workout',
      prompt: 'Give me a quick workout I can do today'
    },
    {
      icon: '📝',
      label: 'Log Workout',
      action: () => navigate('/workouts')
    },
    {
      icon: '🥗',
      label: 'Nutrition Tips',
      prompt: 'Give me nutrition advice for my fitness goals'
    },
    {
      icon: '📊',
      label: 'Track Progress',
      prompt: 'How should I track my fitness progress?'
    },
    {
      icon: '🎯',
      label: 'Set Goals',
      prompt: 'Help me set realistic fitness goals'
    }
  ];

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <h2>🏋️ AI Fitness Trainer</h2>
          <span className="user-name">{user?.name}</span>
        </div>
        <div className="header-right">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="action-btn"
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => navigate('/workouts')} 
            className="action-btn"
          >
            📝 Workouts
          </button>
          <button 
            onClick={() => navigate('/exercises')} 
            className="action-btn"
          >
            💪 Exercises
          </button>
          <button 
            onClick={() => navigate('/scheduler')} 
            className="action-btn"
          >
            📅 Scheduler
          </button>
          {!user?.profile?.age && (
            <button 
              onClick={() => navigate('/profile-setup')} 
              className="action-btn profile-btn"
            >
              ⚙️ Complete Profile
            </button>
          )}
          <button onClick={getWorkoutPlan} className="action-btn" disabled={loading}>
            📋 Get Workout Plan
          </button>
          <button onClick={clearChat} className="action-btn">
            🗑️ Clear
          </button>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="messages-container">
        {/* Quick Actions - Show when chat is empty or cleared */}
        {showQuickActions && messages.length <= 1 && (
          <div className="quick-actions-container">
            <h3>🚀 Quick Actions</h3>
            <p>Get started with one of these common requests:</p>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={() => action.action ? action.action() : handleQuickAction(action.prompt)}
                  disabled={loading}
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">{msg.content}</div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about fitness, workouts, nutrition..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send 🚀
        </button>
      </form>
    </div>
  );
};

export default Chat;
