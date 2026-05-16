import { create } from "zustand";
import type { AppNotification, NotificationType } from "@/types";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";

interface NotificationStore {
  notifications: AppNotification[];
  unreadCount: number;
  add: (n: Omit<AppNotification, "id" | "read" | "createdAt">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: MOCK_NOTIFICATIONS,
  get unreadCount() {
    return get().notifications.filter((n) => !n.read).length;
  },
  add: (n) =>
    set((s) => ({
      notifications: [
        {
          ...n,
          id: `notif_${Date.now()}`,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...s.notifications,
      ],
    })),
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  dismiss: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
}));

// Convenience helper used by other parts of the app
export function notify(
  type: NotificationType,
  title: string,
  message: string
) {
  useNotificationStore.getState().add({ type, title, message });
}
