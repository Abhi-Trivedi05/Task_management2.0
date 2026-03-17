"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, Search, Filter, ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"PENDING" | "IN_PROGRESS" | "COMPLETED">("PENDING");

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(statusFilter && { status: statusFilter }),
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      const res = await fetch(`/api/tasks?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [fetchTasks, user]);

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await fetch(`/api/tasks/${editingTask._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, status }),
        });
      } else {
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, status }),
        });
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Failed to save task", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    } else {
      setEditingTask(null);
      setTitle("");
      setDescription("");
      setStatus("PENDING");
    }
    setIsModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "IN_PROGRESS": return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Your Tasks</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage and track your progress</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="input-modern !pl-12"
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Filter className="h-5 w-5 text-slate-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="input-modern !pl-12 appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 relative z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 glass-card relative z-10">
          <CheckCircle2 className="mx-auto h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No tasks found</h3>
          <p className="mt-2 text-sm text-slate-500 font-medium max-w-sm mx-auto">Get started by creating a new task or try adjusting your search filters.</p>
          <div className="mt-8">
            <button
              onClick={() => openModal()}
              className="btn-primary"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card overflow-hidden relative z-10">
          <ul role="list" className="divide-y divide-slate-200/50">
            {tasks.map((task) => (
              <li key={task._id} className="group flex items-center justify-between gap-x-6 p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex min-w-0 gap-x-4 items-start">
                  <div className="mt-1 flex-shrink-0">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="min-w-0 flex-auto">
                    <p className={`text-sm/6 font-semibold ${task.status === 'COMPLETED' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {task.title}
                    </p>
                    {task.description && (
                       <p className="mt-1 truncate text-xs/5 text-slate-500 max-w-xl">
                        {task.description}
                       </p>
                    )}
                    <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-slate-400">
                      <time dateTime={task.createdAt}>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </time>
                      <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(task)}
                    className="hidden sm:block text-sm/6 font-semibold text-primary-600 hover:text-primary-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="hidden sm:block text-sm/6 font-semibold text-red-600 hover:text-red-500"
                  >
                    Delete
                  </button>
                  {/* Mobile buttons */}
                  <button onClick={() => openModal(task)} className="sm:hidden text-slate-400 hover:text-primary-600">
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDeleteTask(task._id)} className="sm:hidden text-slate-400 hover:text-red-600">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center justify-between border-t border-slate-200/50 bg-white/30 px-6 py-4">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Showing page <span className="font-bold text-slate-900">{page}</span> of <span className="font-bold text-slate-900">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm overflow-hidden" aria-label="Pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-3 py-2 text-slate-500 ring-1 ring-inset ring-slate-200 bg-white hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 transition-colors"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-3 py-2 text-slate-500 ring-1 ring-inset ring-slate-200 bg-white hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 transition-colors"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200">
                <form onSubmit={handleSaveTask}>
                  <div className="px-6 pb-6 pt-8">
                    <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-6">
                      {editingTask ? "Edit Task" : "Create New Task"}
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-1">Title</label>
                        <input
                          type="text"
                          id="title"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="input-modern bg-slate-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-1">Description</label>
                        <textarea
                          id="description"
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="input-modern bg-slate-50 focus:bg-white resize-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-semibold text-slate-900 mb-1">Status</label>
                        <select
                          id="status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value as any)}
                          className="input-modern bg-slate-50 focus:bg-white appearance-none"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50/80 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn-secondary w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto"
                    >
                      Save Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
