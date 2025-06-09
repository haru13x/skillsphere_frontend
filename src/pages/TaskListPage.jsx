import React, { useState } from "react";
import taskData from "../data/taskData";

import TaskSidebar from "../components/Task/TaskSidebar";
import TaskDetail from "../components/Task/TaskDetail";
import Topbar from "../components/Navigation/Topbar.js";

const TaskListPage = () => {
  const [selectedTaskId, setSelectedTaskId] = useState(taskData[0]?.id || null);

  const handleTaskSelect = (taskId) => {
    setSelectedTaskId(taskId);
  };

  return (
    <div style={{ backgroundColor: "#003050", height: "100%", position: "fixed", width: "100%" }}>
      <Topbar />
      <div className="flex flex-col md:flex-row" style={{ height: "100%" }}>
        <TaskSidebar tasks={taskData} onSelectTask={handleTaskSelect} />
        {selectedTaskId && <TaskDetail taskId={selectedTaskId} />}
      </div>
    </div>
  );
};

export default TaskListPage;
