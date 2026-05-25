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