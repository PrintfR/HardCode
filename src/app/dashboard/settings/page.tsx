"use client";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useThemeContext } from "@/context/ThemeContext";
import { useNotifications } from "@/context/NotificationContext";
import { Save, Bell, Eye, Code, Globe } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const { theme, setTheme } = useThemeContext();
    const { addNotification } = useNotifications();
    const [settings, setSettings] = useState({
        email: "user@example.com",
        notifications: {
            email: true,
            push: false,
            contests: true,
            achievements: true,
        },
        privacy: {
            showEmail: false,
            showActivity: true,
            showSubmissions: true,
        },
        editor: {
            fontSize: 14,
            theme: "vs-dark",
            tabSize: 2,
            wordWrap: true,
        },
        language: "en",
    });

    const handleSave = () => {
        // Save settings to backend/localStorage
        localStorage.setItem("user-settings", JSON.stringify(settings));
        addNotification("success", "Settings saved successfully");
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Breadcrumb items={[{ label: "Settings" }]} />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Settings</h1>
                <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Change Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications via email
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.notifications.email}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            notifications: {
                                                ...settings.notifications,
                                                email: checked,
                                            },
                                        })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive browser push notifications
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.notifications.push}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            notifications: {
                                                ...settings.notifications,
                                                push: checked,
                                            },
                                        })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Contest Updates</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified about new contests
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.notifications.contests}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            notifications: {
                                                ...settings.notifications,
                                                contests: checked,
                                            },
                                        })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Achievement Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when you earn achievements
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.notifications.achievements}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            notifications: {
                                                ...settings.notifications,
                                                achievements: checked,
                                            },
                                        })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Privacy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Show Email</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Make your email visible to others
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.privacy.showEmail}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            privacy: {
                                                ...settings.privacy,
                                                showEmail: checked,
                                            },
                                        })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Show Activity</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Show your activity on your profile
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.privacy.showActivity}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            privacy: {
                                                ...settings.privacy,
                                                showActivity: checked,
                                            },
                                        })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Show Submissions</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow others to view your submissions
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.privacy.showSubmissions}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            privacy: {
                                                ...settings.privacy,
                                                showSubmissions: checked,
                                            },
                                        })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Editor Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code className="h-5 w-5" />
                                Editor Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="fontSize">Font Size</Label>
                                <Input
                                    id="fontSize"
                                    type="number"
                                    min={10}
                                    max={24}
                                    value={settings.editor.fontSize}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            editor: {
                                                ...settings.editor,
                                                fontSize: parseInt(
                                                    e.target.value
                                                ) || 14,
                                            },
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="editorTheme">Editor Theme</Label>
                                <Select
                                    value={settings.editor.theme}
                                    onValueChange={(value) =>
                                        setSettings({
                                            ...settings,
                                            editor: {
                                                ...settings.editor,
                                                theme: value,
                                            },
                                        })
                                    }
                                >
                                    <SelectTrigger id="editorTheme">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vs">Light</SelectItem>
                                        <SelectItem value="vs-dark">Dark</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="tabSize">Tab Size</Label>
                                <Input
                                    id="tabSize"
                                    type="number"
                                    min={2}
                                    max={8}
                                    value={settings.editor.tabSize}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            editor: {
                                                ...settings.editor,
                                                tabSize: parseInt(
                                                    e.target.value
                                                ) || 2,
                                            },
                                        })
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Word Wrap</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable word wrapping in editor
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.editor.wordWrap}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            editor: {
                                                ...settings.editor,
                                                wordWrap: checked,
                                            },
                                        })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Theme Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Appearance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="theme">Theme</Label>
                                <Select
                                    value={theme || "system"}
                                    onValueChange={setTheme}
                                >
                                    <SelectTrigger id="theme">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Language Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Language</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="language">Interface Language</Label>
                                <Select
                                    value={settings.language}
                                    onValueChange={(value) =>
                                        setSettings({
                                            ...settings,
                                            language: value,
                                        })
                                    }
                                >
                                    <SelectTrigger id="language">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="de">German</SelectItem>
                                        <SelectItem value="zh">Chinese</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

