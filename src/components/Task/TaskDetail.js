import React, { useState, useEffect } from "react";
import taskGuidance from "../../data/taskGuidance";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  ButtonGroup,
} from "@mui/material";

// Background colors based on status
const bgColors = {
  done: "#ecfdf5", // green-50
  ongoing: "#eff6ff", // blue-50
  revise: "#fffbea", // yellow-50
};

// Chip colors for left border
const chipColors = {
  done: "success",
  ongoing: "info",
  revise: "warning",
};

// Function to fetch task guidance based on the task ID
const getTaskGuidance = (taskId) => {
  return taskGuidance[taskId];
};

const TaskDetail = ({ taskId }) => {
  const [guidance, setGuidance] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [markDone, setMarkDone] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const validStatuses = ["all", "done", "ongoing", "revise", "validate"];

  useEffect(() => {
    const fetchedGuidance = getTaskGuidance(taskId);
    if (fetchedGuidance) {
      setGuidance(fetchedGuidance);
    } else {
      setGuidance([]);
    }
    setLoading(false);
  }, [taskId]);

  const handleStatusFilter = (status) => {
    if (validStatuses.includes(status)) {
      setStatusFilter(status);
    } else {
      alert("Invalid filter selected.");
    }
  };

  const visibleGuidance = guidance.filter(
    (item) => statusFilter === "all" || item.status === statusFilter
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={50} color="primary" />
      </Box>
    );
  }

  // if (!taskId || visibleGuidance.length === 0) {
  //   return <Typography>Select a task to see details.</Typography>;
  // }

  const handleCommentChange = (value) => {
    setComment(value);
  };

  const openSubmitDialog = (index) => {
    setSelectedIndex(index);
    setMarkDone(visibleGuidance[index].status === "done");
    setComment(visibleGuidance[index].comment || "");
    setOpenDialog(true);
  };

  const handleConfirmSubmit = () => {
    const updated = [...guidance];
    const stepIndex = guidance.findIndex(
      (g) => g.step === visibleGuidance[selectedIndex].step
    );
    if (stepIndex !== -1) {
      updated[stepIndex].status = markDone ? "done" : updated[stepIndex].status;
      updated[stepIndex].comment = comment;

      alert(
        `Step: ${updated[stepIndex].step}\nComment: ${
          updated[stepIndex].comment
        }\nMarked as: ${updated[stepIndex].status.toUpperCase()}`
      );
      setGuidance(updated);
    }
    setOpenDialog(false);
  };

  return (
    <div className="w-full md:w-3/4 p-4 bg-white rounded-lg">
      <Box sx={{ mb: 3 }}>
        <ButtonGroup variant="outlined" color="primary">
          {validStatuses.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "contained" : "outlined"}
              onClick={() => handleStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <Typography variant="h5" className="text-blue-800 font-semibold mb-1">
        📌 Task Breakdown & Instructions
      </Typography>

      {/* Filter Buttons */}

      <Stack spacing={3}>
        {visibleGuidance.map((item, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: bgColors[item.status] || "#f9fafb",
              borderLeft: `5px solid ${
                chipColors[item.status] === "success"
                  ? "#10b981"
                  : chipColors[item.status] === "info"
                  ? "#3b82f6"
                  : "#f59e0b"
              }`,
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      flexWrap="wrap"
                      gap={1}
                    >
                      <Typography fontWeight={600} fontSize={14}>
                        {index + 1}. {item.step}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                      >
                        Deadline: <strong>{item.deadline}</strong>
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        backgroundColor: "#f8fafc",
                        borderRadius: 1,
                        padding: 1,
                        fontSize: 13,
                        borderLeft: "4px solid #94a3b8",
                        color: "#334155",
                      }}
                    >
                      {item.instruction}
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={() => openSubmitDialog(index)}
                  >
                    Add Progress / Comment
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Modal Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>✅ Submit Progress</DialogTitle>
        <DialogContent dividers>
          {selectedIndex !== null && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Step: <strong>{visibleGuidance[selectedIndex].step}</strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Comment:
              </Typography>
              <TextField
                label="Your Progress / Comment"
                multiline
                rows={3}
                fullWidth
                size="small"
                value={comment}
                onChange={(e) => handleCommentChange(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={markDone}
                    onChange={(e) => setMarkDone(e.target.checked)}
                  />
                }
                label="Mark as Done"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirmSubmit}>
            Confirm Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskDetail;
