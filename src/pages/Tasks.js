import React, { useEffect, useState } from 'react';
import { taskAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/Notification';
import theme from '../theme';

const Tasks = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [taskInfo, setTaskInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
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
      setCurrentTask(task);
      setTimeLeft(task.duration);
      setTasks(tasks.filter(t => t._id !== task._id));
    } catch (err) {
      error(err.response?.data?.message || 'Failed to start task. Please try again.');
    }
  };

  const handleCompleteTask = async () => {
    try {
      const response = await taskAPI.complete(activeTask._id);
      success(`Task completed! You earned ₨${response.data.reward}`);
      updateUser({ wallet: { ...user.wallet, balance: response.data.newBalance } });
      setActiveTask(null);
      setCurrentTask(null);
      setTimeLeft(0);
      loadTasks();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to complete task.');
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;

    const getYouTubeId = (url) => {
      url = url.trim();
      if (url.includes('youtu.be/')) {
        const match = url.split('youtu.be/')[1];
        if (match) return match.split(/[?&#]/)[0];
      }
      if (url.includes('/shorts/')) {
        const match = url.split('/shorts/')[1];
        if (match) return match.split(/[?&#]/)[0];
      }
      if (url.includes('/embed/')) {
        const match = url.split('/embed/')[1];
        if (match) return match.split(/[?&#]/)[0];
      }
      if (url.includes('/v/')) {
        const match = url.split('/v/')[1];
        if (match) return match.split(/[?&#]/)[0];
      }
      if (url.includes('v=')) {
        const match = url.split('v=')[1];
        if (match) return match.split(/[?&#]/)[0];
      }
      return null;
    };

    const videoId = getYouTubeId(url);
    if (videoId && videoId.length === 11) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
    return url;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading tasks...</p>
      </div>
    );
  }

  if (!user?.currentPackage) {
    return (
      <div style={styles.container}>
        <div style={styles.noPackageCard}>
          <div style={styles.noPackageIcon}>📦</div>
          <h2 style={styles.noPackageTitle}>No Active Package</h2>
          <p style={styles.noPackageText}>You need to purchase a package to access tasks</p>
          <a href="/packages" style={styles.buyBtn}>
            Browse Packages
            <span style={styles.btnArrow}>→</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Available Tasks</h1>
        <p style={styles.subtitle}>Complete tasks to earn rewards</p>
      </div>

      {taskInfo && (
        <div style={styles.infoCard}>
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}>✅</div>
            <span style={styles.infoLabel}>Completed Today</span>
            <strong style={styles.infoValue}>{taskInfo.tasksCompletedToday} / {taskInfo.tasksAllowed}</strong>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}>📋</div>
            <span style={styles.infoLabel}>Tasks Remaining</span>
            <strong style={styles.infoValue}>{taskInfo.tasksRemaining}</strong>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}>💰</div>
            <span style={styles.infoLabel}>Reward Per Task</span>
            <strong style={styles.infoValueHighlight}>₨ {taskInfo.rewardPerTask}</strong>
          </div>
        </div>
      )}

      {activeTask && currentTask && (
        <div style={styles.activeTaskCard}>
          <div style={styles.activeHeader}>
            <div style={styles.activeInfo}>
              <span style={styles.activeLabel}>Current Task</span>
              <h2 style={styles.activeTitle}>{currentTask.title}</h2>
              <p style={styles.activeDesc}>{currentTask.description}</p>
            </div>
            <div style={styles.timerWrapper}>
              <div style={styles.timerCircle}>
                <span style={styles.timerValue}>{timeLeft}</span>
                <span style={styles.timerUnit}>sec</span>
              </div>
            </div>
          </div>

          {currentTask.url && (
            <div style={styles.embedContainer}>
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
              <div style={styles.bigTimer}>
                <div style={styles.bigTimerCircle}>
                  <span style={styles.bigTimerValue}>{timeLeft}</span>
                  <span style={styles.bigTimerUnit}>seconds</span>
                </div>
              </div>
              <p style={styles.waitText}>Please wait for the timer to complete</p>
            </div>
          )}

          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${((currentTask.duration - timeLeft) / currentTask.duration) * 100}%`
              }}
            ></div>
          </div>
          <p style={styles.earnText}>
            {timeLeft > 0
              ? `Complete this task to earn ₨${taskInfo?.rewardPerTask}`
              : 'Processing completion...'}
          </p>
        </div>
      )}

      {!activeTask && tasks.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            {taskInfo?.tasksRemaining === 0 ? '🎉' : '📋'}
          </div>
          <h3 style={styles.emptyTitle}>
            {taskInfo?.tasksRemaining === 0 ? 'Daily Limit Reached!' : 'No Tasks Available'}
          </h3>
          <p style={styles.emptyText}>
            {taskInfo?.tasksRemaining === 0
              ? 'Great job! You have completed all your tasks for today. Come back tomorrow!'
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
              <div style={styles.taskMetaItem}>
                <span style={styles.metaIcon}>⏱️</span>
                <span>{task.duration}s</span>
              </div>
              <div style={styles.rewardBadge}>
                ₨ {taskInfo?.rewardPerTask}
              </div>
            </div>
            <button
              onClick={() => handleStartTask(task)}
              style={styles.startBtn}
              disabled={!!activeTask}
            >
              {activeTask ? 'Task in Progress...' : 'Start Task'}
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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1rem',
  },
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: `4px solid ${theme.colors.borderLight}`,
    borderTopColor: theme.colors.primary,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: '1.1rem',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: theme.colors.textSecondary,
  },
  noPackageCard: {
    backgroundColor: theme.colors.white,
    padding: '4rem 2rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    textAlign: 'center',
    maxWidth: '500px',
    margin: '2rem auto',
  },
  noPackageIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  noPackageTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '0.5rem',
  },
  noPackageText: {
    color: theme.colors.textSecondary,
    marginBottom: '1.5rem',
  },
  buyBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    color: theme.colors.white,
    padding: '1rem 2rem',
    borderRadius: theme.radius.md,
    textDecoration: 'none',
    fontWeight: '700',
    boxShadow: theme.shadows.success,
  },
  btnArrow: {
    fontSize: '1.1rem',
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    padding: '1.5rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1.5rem',
    border: `1px solid ${theme.colors.borderLight}`,
  },
  infoItem: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  infoIcon: {
    fontSize: '1.5rem',
  },
  infoLabel: {
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
  },
  infoValue: {
    color: theme.colors.primaryDark,
    fontSize: '1.25rem',
  },
  infoValueHighlight: {
    color: theme.colors.success,
    fontSize: '1.25rem',
  },
  activeTaskCard: {
    backgroundColor: theme.colors.white,
    padding: '2rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.lg,
    marginBottom: '2rem',
    border: `2px solid ${theme.colors.primary}`,
  },
  activeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  activeInfo: {
    flex: 1,
  },
  activeLabel: {
    display: 'inline-block',
    backgroundColor: theme.colors.primaryBg,
    color: theme.colors.primary,
    padding: '0.25rem 0.75rem',
    borderRadius: theme.radius.full,
    fontSize: '0.8rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
  },
  activeTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '0.5rem',
  },
  activeDesc: {
    color: theme.colors.textSecondary,
  },
  timerWrapper: {
    flexShrink: 0,
  },
  timerCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.white,
    boxShadow: theme.shadows.button,
  },
  timerValue: {
    fontSize: '1.75rem',
    fontWeight: '800',
    lineHeight: 1,
  },
  timerUnit: {
    fontSize: '0.7rem',
    opacity: 0.9,
  },
  embedContainer: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
    borderRadius: theme.radius.lg,
    marginBottom: '1.5rem',
    backgroundColor: '#000',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
  },
  noUrlMessage: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    marginBottom: '1.5rem',
  },
  bigTimer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  bigTimerCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.white,
    boxShadow: theme.shadows.button,
  },
  bigTimerValue: {
    fontSize: '2.5rem',
    fontWeight: '800',
    lineHeight: 1,
  },
  bigTimerUnit: {
    fontSize: '0.8rem',
    opacity: 0.9,
  },
  waitText: {
    color: theme.colors.textSecondary,
  },
  progressBar: {
    height: '6px',
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  progressFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.success} 100%)`,
    borderRadius: theme.radius.full,
    transition: 'width 1s linear',
  },
  earnText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: '0.95rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    marginBottom: '2rem',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: theme.colors.textSecondary,
  },
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  taskCard: {
    backgroundColor: theme.colors.white,
    padding: '1.5rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.borderLight}`,
    display: 'flex',
    flexDirection: 'column',
  },
  taskType: {
    display: 'inline-block',
    background: `linear-gradient(135deg, ${theme.colors.primaryBg} 0%, ${theme.colors.successBg} 100%)`,
    color: theme.colors.primary,
    padding: '0.375rem 0.875rem',
    borderRadius: theme.radius.full,
    fontSize: '0.75rem',
    fontWeight: '700',
    marginBottom: '1rem',
    alignSelf: 'flex-start',
  },
  taskTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: theme.colors.primaryDark,
    marginBottom: '0.5rem',
  },
  taskDescription: {
    color: theme.colors.textSecondary,
    marginBottom: '1rem',
    lineHeight: '1.6',
    fontSize: '0.9rem',
    flex: 1,
  },
  taskMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  taskMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
  },
  metaIcon: {
    fontSize: '1rem',
  },
  rewardBadge: {
    backgroundColor: theme.colors.successBg,
    color: theme.colors.successDark,
    padding: '0.375rem 0.75rem',
    borderRadius: theme.radius.full,
    fontWeight: '700',
    fontSize: '0.9rem',
  },
  startBtn: {
    width: '100%',
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    color: theme.colors.white,
    border: 'none',
    padding: '0.875rem',
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: theme.shadows.success,
    transition: 'all 0.2s ease',
  },
};

export default Tasks;
