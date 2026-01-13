"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { Task, TaskListResponse, TaskResponse } from "@/lib/types";
import { TaskItem } from "./task-item";
import { TaskEmpty } from "./task-empty";
import { TaskForm } from "./task-form";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    const response = await api.get<TaskListResponse>("/api/tasks");

    if (response.error) {
      setError(response.error.detail);
    } else if (response.data) {
      setTasks(response.data.tasks);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (title: string, description: string | null) => {
    setAddingTask(true);
    setError("");

    const response = await api.post<TaskResponse>("/api/tasks", {
      title,
      description,
    });

    if (response.error) {
      setError(response.error.detail);
    } else if (response.data) {
      setTasks((prev) => [response.data!, ...prev]);
    }

    setAddingTask(false);
  };

  const handleToggle = async (id: string) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, is_completed: !task.is_completed } : task
      )
    );

    const response = await api.patch<TaskResponse>(`/api/tasks/${id}/toggle`);

    if (response.error) {
      // Rollback on error
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, is_completed: !task.is_completed } : task
        )
      );
      setError(response.error.detail);
    }
  };

  const handleUpdate = async (id: string, title: string, description: string | null) => {
    const response = await api.put<TaskResponse>(`/api/tasks/${id}`, {
      title,
      description,
    });

    if (response.error) {
      setError(response.error.detail);
    } else if (response.data) {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? response.data! : task))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const response = await api.delete(`/api/tasks/${id}`);

    if (response.error) {
      setError(response.error.detail);
    } else {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const totalCount = tasks.length;

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskForm onSubmit={handleCreateTask} loading={addingTask} />

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {tasks.length === 0 ? (
        <TaskEmpty />
      ) : (
        <>
          {/* Progress Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{completedCount} of {totalCount} completed</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
