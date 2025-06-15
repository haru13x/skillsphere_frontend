import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { UseMethods } from "../../composable/UseMethods";

// Background & border color mappings
const bgColors = {
  done: "#ecfdf5",
  ongoing: "#eff6ff",
  revise: "#fffbea",
};
const chipColors = {
  done: "success",
  ongoing: "info",
  revise: "warning",
};

const TaskDetail = ({ taskId }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [guidance, setGuidance] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [markDone, setMarkDone] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newInstruction, setNewInstruction] = useState({ title: "", description: "" });
  const [work, setWork] = useState([]);
  const validStatuses = ["all", "done", "ongoing", "revise"];

  useEffect(() => {
    const fetchGuidance = async () => {
      setLoading(true);
      try {
        const response = await UseMethods("get", "get-instruction", "", taskId);
        const rawData = response.data?.data || [];

        const formatted = rawData.map((item) => ({
          id: item.id,
          step: item.title,
          instruction: item.description,
          deadline: item.deadline_at ?? "No deadline",
          comment: item.comment ?? "",
          status:
            item.status === 1
              ? "ongoing"
              : item.status === 2
              ? "done"
              : item.status === 3
              ? "revise"
              : "ongoing",
          step_order: item.step_order,
        }));

        setGuidance(formatted);
        setWork(response.data.work)
      } catch (error) {
        console.error("Error fetching guidance:", error);
        setGuidance([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuidance();
  }, [taskId]);

  const handleStatusFilter = (status) => {
    if (validStatuses.includes(status)) {
      setStatusFilter(status);
    }
  };

  const visibleGuidance = guidance.filter(
    (item) => statusFilter === "all" || item.status === statusFilter
  );

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

  const handleAddInstruction = () => {
    const newId = guidance.length + 1;
    const newItem = {
      id: newId,
      step: newInstruction.title,
      instruction: newInstruction.description,
      deadline: "No deadline",
      comment: "",
      status: "ongoing",
      step_order: newId,
    };
    setGuidance((prev) => [...prev, newItem]);
    setOpenAddDialog(false);
    setNewInstruction({ title: "", description: "" });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={50} color="primary" />
      </Box>
    );
  }

  return (
    <div className="w-full md:w-3/4 p-4 bg-white rounded-lg" style={{ backgroundColor: "#003050", overflowY: "scroll", height: "100vh" }}>
      <Box sx={{ mb: 3 }}>
        <ButtonGroup variant="outlined" color="primary" sx={{ gap: "8px" }}>
          {validStatuses.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "contained" : "outlined"}
              onClick={() => handleStatusFilter(status)}
              sx={{
                backgroundColor: statusFilter === status ? "#003050" : "transparent",
                color: "#ffffff",
                border: statusFilter === status ? "1px solid #003050" : "1px solid rgba(255,255,255,0.5)",
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </ButtonGroup>
 {user.id === work.client_id && (
        <Button
          variant="contained"
          sx={{ marginLeft: 2, backgroundColor: "#10b981" }}
          onClick={() => setOpenAddDialog(true)}
        >
          ➕ Add Instruction
        </Button>
    )}
      </Box>

      <Typography variant="h5" sx={{ color: "#ffffff", pb: 2 }}>
        Task Breakdown & Instructions
      </Typography>

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
                  <Typography fontWeight={600} fontSize={14}>
                    {index + 1}. {item.step}
                  </Typography>
                  <Typography variant="caption">
                    Deadline: <strong>{item.deadline}</strong>
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "#f8fafc",
                      borderRadius: 1,
                      p: 1,
                      mt: 1,
                      fontSize: 13,
                      borderLeft: "4px solid #94a3b8",
                      color: "#334155",
                    }}
                  >
                    {item.instruction}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => openSubmitDialog(index)}
                    sx={{ backgroundColor: "#003050" }}
                  >
                    Add Progress / Comment
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Submit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>✅ Submit Progress</DialogTitle>
        <DialogContent dividers>
          {selectedIndex !== null && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Step: <strong>{visibleGuidance[selectedIndex].step}</strong>
              </Typography>
              <TextField
                label="Your Progress / Comment"
                multiline
                rows={3}
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox checked={markDone} onChange={(e) => setMarkDone(e.target.checked)} />}
                label="Mark as Done"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Instruction Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>➕ Add New Instruction</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Instruction Title"
            fullWidth
            margin="dense"
            value={newInstruction.title}
            onChange={(e) => setNewInstruction({ ...newInstruction, title: e.target.value })}
          />
          <TextField
            label="Instruction Description"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={newInstruction.description}
            onChange={(e) => setNewInstruction({ ...newInstruction, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddInstruction}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskDetail;
