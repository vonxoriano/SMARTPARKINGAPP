const KEY = 'appNotifications';

export const getNotifications = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
};

export const addNotification = (data) => {
  const list = getNotifications();
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    read: false,
    time: new Date().toISOString(),
    ...data,
  };
  list.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 60)));
  window.dispatchEvent(new Event('notificationsUpdated'));
  return entry;
};

export const markAllRead = () => {
  const list = getNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('notificationsUpdated'));
};

export const markOneRead = (id) => {
  const list = getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('notificationsUpdated'));
};

export const deleteNotif = (id) => {
  const list = getNotifications().filter(n => n.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('notificationsUpdated'));
};

export const clearAll = () => {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('notificationsUpdated'));
};

export const getUnreadCount = () => getNotifications().filter(n => !n.read).length;

export const seedInitialNotifications = () => {
  const existing = getNotifications();
  if (existing.length > 0) return;
  const now = Date.now();
  const seeds = [
    {
      id: 'seed-1',
      type: 'system',
      title: 'Welcome to Smart Parking!',
      message: 'Your account is ready. Reserve parking spots across campus anytime.',
      time: new Date(now - 2 * 86400000).toISOString(),
      read: true,
    },
    {
      id: 'seed-2',
      type: 'system',
      title: 'RTL Area Maintenance',
      message: 'RTL area will be closed for maintenance on April 25 from 8AM–12PM.',
      time: new Date(now - 86400000).toISOString(),
      read: false,
    },
  ];
  localStorage.setItem(KEY, JSON.stringify(seeds));
};
