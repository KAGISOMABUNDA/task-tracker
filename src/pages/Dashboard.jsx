import TaskList from "../components/TaskList";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-800 mb-2">
            My Tasks
          </h1>
          <p className="text-sm sm:text-base text-slate-500">
            Organize and track your daily tasks efficiently
          </p>
        </div>

        {/* Task List */}
        <TaskList />
      </div>
    </div>
  );
}