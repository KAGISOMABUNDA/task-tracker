import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function TaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");

  // Real-time listener for tasks
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    });

    return () => unsubscribe();
  }, [user]);

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addDoc(collection(db, "tasks"), {
      title,
      status: "pending",
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    setTitle("");
  };

  // Toggle task completion
  const toggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    await updateDoc(doc(db, "tasks", task.id), { status: newStatus });
  };

  // Delete task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  // Filter logic
  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8">
        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium transition-colors duration-150 whitespace-nowrap text-sm sm:text-base"
            >
              Add Task
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-slate-200">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors duration-150 ${
              filter === "all"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors duration-150 ${
              filter === "pending"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Pending ({tasks.filter(t => t.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors duration-150 ${
              filter === "completed"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Completed ({tasks.filter(t => t.status === "completed").length})
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">
                {filter === "all" 
                  ? "No tasks yet. Add one to get started!" 
                  : `No ${filter} tasks`}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-150 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                  <button
                    onClick={() => toggleStatus(task)}
                    className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded border-2 border-slate-300 hover:border-blue-500 transition-colors duration-150 flex items-center justify-center"
                    aria-label={task.status === "completed" ? "Mark as pending" : "Mark as completed"}
                  >
                    {task.status === "completed" && (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <span
                    onClick={() => toggleStatus(task)}
                    className={`cursor-pointer flex-1 text-sm sm:text-base break-words ${
                      task.status === "completed"
                        ? "line-through text-slate-400"
                        : "text-slate-700"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="flex-shrink-0 ml-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Delete task"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}