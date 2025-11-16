"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { toast } from "sonner";

export type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    timestamp: Date;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (type: NotificationType, message: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const addNotification = useCallback((type: NotificationType, message: string) => {
        const notification: Notification = {
            id: Date.now().toString(),
            type,
            message,
            timestamp: new Date(),
        };

        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show toast
        switch (type) {
            case "success":
                toast.success(message);
                break;
            case "error":
                toast.error(message);
                break;
            case "warning":
                toast.warning(message);
                break;
            case "info":
                toast.info(message);
                break;
        }
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(() => {
        setUnreadCount(0);
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider");
    }
    return context;
}

