import React from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

const TaskSidebar = ({ tasks, onSelectTask }) => {
  return (
    <div className="w-full md:w-1/5 p-4 border-r bg-gray-50">
      <Typography
        variant="subtitle2"
        className="uppercase text-gray-500 tracking-wide mb-4"
      >
        Tasks
      </Typography>
      <Divider className="mb-2" />
      <List dense>
        {tasks.map((task) => (
          <ListItemButton
            key={task.id}
            onClick={() => onSelectTask(task.id)} // Ensure this triggers correctly
            className="rounded-md mb-1 hover:bg-teal-100 transition-all"
          >
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  className="text-sm font-medium text-gray-800"
                >
                  {task.title}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};

export default TaskSidebar;
