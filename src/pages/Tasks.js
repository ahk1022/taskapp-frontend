import React, { useEffect, useState } from 'react';
import { taskAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/Notification';

const Tasks = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [taskInfo, setTaskInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [currentTask, setCurrentTask] = useState(null); // Store the full task object
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (activeTask && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && activeTask) {
      handleCompleteTask();
    }
  }, [timeLeft, activeTask]);

  const loadTasks = async () => {
    try {
      const response = await taskAPI.getAvailable();
      setTasks(response.data.tasks || []);
      setTaskInfo({
        tasksCompletedToday: response.data.tasksCompletedToday,
        tasksAllowed: response.data.tasksAllowed,
        tasksRemaining: response.data.tasksRemaining,
        rewardPerTask: response.data.rewardPerTask,
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setLoading(false);
    }
  };

  const handleStartTask = async (task) => {
    try {
      const response = await taskAPI.start(task._id);
      setActiveTask(response.data.userTask);
      setCurrentTask(task); // Store the task for URL access
      setTimeLeft(task.duration);

      // Remove task from available tasks
      setTasks(tasks.filter(t => t._id !== task._id));
    } catch (err) {
      error(err.response?.data?.message || 'Failed to start task. Please try again.');
    }
  };

  const handleCompleteTask = async () => {
    try {
      const response = await taskAPI.complete(activeTask._id);
      success(`Congratulations! Task completed successfully. You earned ₨${response.data.reward} which has been added to your wallet.`);

      // Update user balance
      updateUser({ wallet: { ...user.wallet, balance: response.data.newBalance } });

      setActiveTask(null);
      setCurrentTask(null);
      setTimeLeft(0);
      loadTasks(); // Reload tasks
    } catch (err) {
      error(err.response?.data?.message || 'Failed to complete task. Please contact support if the issue persists.');
    }
  };

  // Helper function to get embeddable URL
  const getEmbedUrl = (url) => {
    if (!url) return null;

    // Extract YouTube video ID from any YouTube URL format
    const getYouTubeId = (url) => {
      // Remove any leading/trailing whitespace
      url = url.trim();

      // Pattern 1: youtu.be/VIDEO_ID
      if (url.includes('youtu.be/')) {
        const match = url.split('youtu.be/')[1];
        if (match) return match.split(/[?&#]/)[0];
      }

      // Pattern 2: youtube.com/shorts/VIDEO_ID
      if (url.includes('/shorts/')) {
        const match = url.split('/shorts/')[1];
        if (match) return match.split(/[?&#]/)[0];
      }

      // Pattern 3: youtube.com/embed/VIDEO_ID
      if (url.includes('/embed/')) {
        const match = url.split('/embed/')[1];
        if (match) return match.split(/[?&#]/)[0];
      }

      // Pattern 4: youtube.com/v/VIDEO_ID
      if (url.includes('/v/')) {
        const match = url.split('/v/')[1];
        if (match) return match.split(/[?&#]/)[0];
      }

      // Pattern 5: youtube.com/watch?v=VIDEO_ID (most common)
      if (url.includes('v=')) {
        const match = url.split('v=')[1];
        if (match) return match.split(/[?&#]/)[0];
      }

      return null;
    };

    const videoId = getYouTubeId(url);

    if (videoId && videoId.length === 11) {
      console.log('YouTube video ID extracted:', videoId);
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }

    // For other URLs, return as-is
    console.log('URL not recognized as YouTube, using as-is:', url);
    return url;
  };

  if (loading) {
    return <div style={styles.loading}>Loading tasks...</div>;
  }

  if (!user?.currentPackage) {
    return (
      <div style={styles.container}>
        <div style={styles.noPackageCard}>
          <h2>No Active Package</h2>
          <p>You need to purchase a package to access tasks</p>
          <a href="/packages" style={styles.buyBtn}>Buy Package</a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Available Tasks</h1>

      {taskInfo && (
        <div style={styles.infoCard}>
          <div style={styles.infoItem}>
            <span>Tasks Completed Today</span>
            <strong>{taskInfo.tasksCompletedToday} / {taskInfo.tasksAllowed}</strong>
          </div>
          <div style={styles.infoItem}>
            <span>Tasks Remaining</span>
            <strong>{taskInfo.tasksRemaining}</strong>
          </div>
          <div style={styles.infoItem}>
            <span>Reward Per Task</span>
            <strong>₨ {taskInfo.rewardPerTask}</strong>
          </div>
        </div>
      )}

      {activeTask && currentTask && (
        <div style={styles.activeTaskCard}>
          <div style={styles.taskHeader}>
            <div>
              <h2>{currentTask.title}</h2>
              <p style={styles.taskSubtitle}>{currentTask.description}</p>
            </div>
            <div style={styles.timerBadge}>
              <span style={styles.timerText}>{timeLeft}s</span>
            </div>
          </div>

          {currentTask.url && (
            <div style={styles.embedContainer}>
              {/* Debug: show original and converted URLs */}
              <div style={{fontSize: '10px', color: '#666', marginBottom: '5px', wordBreak: 'break-all'}}>
                Original: {currentTask.url}<br/>
                Embed: {getEmbedUrl(currentTask.url)}
              </div>
              <iframe
                src={getEmbedUrl(currentTask.url)}
                style={styles.iframe}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentTask.title}
              />
            </div>
          )}

          {!currentTask.url && (
            <div style={styles.noUrlMessage}>
              <p>Please complete the task as instructed</p>
              <div style={styles.timer}>
                <div style={styles.timerCircle}>
                  <span style={styles.timerTextLarge}>{timeLeft}s</span>
                </div>
              </div>
            </div>
          )}

          <p style={styles.instruction}>
            {timeLeft > 0
              ? `Wait ${timeLeft} seconds to complete this task and earn ₨${taskInfo?.rewardPerTask}`
              : 'Processing completion...'}
          </p>
        </div>
      )}

      {!activeTask && tasks.length === 0 && (
        <div style={styles.emptyState}>
          <h3>{taskInfo?.tasksRemaining === 0 ? 'Daily Limit Reached' : 'No Tasks Available'}</h3>
          <p>
            {taskInfo?.tasksRemaining === 0
              ? 'You have completed all your tasks for today. Come back tomorrow!'
              : 'Check back later for new tasks'}
          </p>
        </div>
      )}

      <div style={styles.taskGrid}>
        {tasks.map(task => (
          <div key={task._id} style={styles.taskCard}>
            <div style={styles.taskType}>{task.type.replace('_', ' ').toUpperCase()}</div>
            <h3 style={styles.taskTitle}>{task.title}</h3>
            <p style={styles.taskDescription}>{task.description}</p>
            <div style={styles.taskMeta}>
              <span>Duration: {task.duration}s</span>
              <span style={styles.reward}>₨ {taskInfo?.rewardPerTask}</span>
            </div>
            <button
              onClick={() => handleStartTask(task)}
              style={styles.startBtn}
              disabled={!!activeTask}
            >
              Start Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  infoItem: {
    textAlign: 'center',
  },
  noPackageCard: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  buyBtn: {
    display: 'inline-block',
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '1rem 2rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: '1rem',
  },
  activeTaskCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    marginBottom: '2rem',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    gap: '1rem',
  },
  taskSubtitle: {
    color: '#7f8c8d',
    margin: '0.5rem 0 0 0',
    fontSize: '0.95rem',
  },
  timerBadge: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '1rem 1.5rem',
    borderRadius: '50px',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    minWidth: '100px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)',
  },
  embedContainer: {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    backgroundColor: '#000',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '8px',
  },
  noUrlMessage: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#ecf0f1',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  timer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '2rem 0',
  },
  timerCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid #2980b9',
  },
  timerText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  timerTextLarge: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  instruction: {
    fontSize: '1rem',
    color: '#7f8c8d',
    textAlign: 'center',
    margin: '1rem 0 0 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#ecf0f1',
    borderRadius: '8px',
  },
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  taskType: {
    display: 'inline-block',
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  taskTitle: {
    fontSize: '1.2rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  taskDescription: {
    color: '#7f8c8d',
    marginBottom: '1rem',
    lineHeight: '1.6',
  },
  taskMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  reward: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  startBtn: {
    width: '100%',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Tasks;
