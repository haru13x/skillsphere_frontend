import React, { useEffect, useState, useRef } from "react";
import Topbar from "../components/Navigation/Topbar";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Divider,
  Paper,
  Chip,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  Tab,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UseMethods } from "../composable/UseMethods";

const TaskDetails = () => {
  const { id } = useParams();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [rateType, setRateType] = useState("hourly");
  const [rateValue, setRateValue] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [applicants, setApplicants] = useState([]);
  const [hasApplied, setHasApplied] = useState(false); // Track if user has applied

  const formRef = useRef(null);
  const navigate = useNavigate();

  // Fetch task details or applicants every time tabIndex changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (tabIndex === 0) {
          // Fetch task details if tabIndex is 0 (Task Details tab)
          const taskRes = await UseMethods("get", "get-task-details", "", id);
          if (taskRes) {
            setTaskData(taskRes.data.data);
          }
        } else if (tabIndex === 1) {
          // Fetch applicants if tabIndex is 1 (Applicants tab)
          const applicantsRes = await UseMethods(
            "get",
            "get-applicants",
            "",
            id
          );
          if (applicantsRes) {
            setApplicants(applicantsRes.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Trigger fetchData on tab change
    fetchData();
  }, [tabIndex, id]); // Fetch data every time the tab or id changes

  // Check if the user has already applied
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const res = await UseMethods("get", "check-application-status", "", id);
        if (res && res.data.hasApplied === true) {
          setHasApplied(true);
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };

    checkApplicationStatus();
  }, [id]);

  const askAiSuggestion = async () => {
    const response = await fetch("http://localhost:5000/api/ask-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Suggest a Proposal to get this work and here the details ${taskData[0].title} and here the description
        ${taskData[0].description} like i want to work this proposal like proper proposal 
        at least 60 words`,
      }),
    });

    const data = await response.json();
    setCoverLetter(data.message);
  };

  const handleSubmitApplication = async () => {
    try {
      const applicationData = {
        work_id: id,
        proposal: coverLetter,
        proposal_currency: rateType,
        proposal_rate: rateValue,
      };

      const res = await UseMethods("post", "store-proposal", applicationData);
      console.log("Task saved:", res.data);
      setHasApplied(true); // Prevent further submissions
      alert("Task applied successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit task.");
    }
  };

  const resetForm = () => {
    setCoverLetter("");
    setRateType("hourly");
    setRateValue("");
  };

  if (loading) {
    return (
      <Box className="flex justify-center mt-10">
        <CircularProgress />
      </Box>
    );
  }

  if (!taskData && tabIndex === 0) {
    return (
      <Box className="text-center mt-10 text-red-500">Task not found.</Box>
    );
  }

  const task = taskData ? taskData[0] : null;

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div>
      <Topbar />
      <Box className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Title and CTA */}
        <Box className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <Typography variant="h4" className="text-blue-800 font-semibold">
            {task ? task.title : "Loading..."}
          </Typography>
        </Box>

        {/* Tabs for switching between Task Details and Applicants */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="Task Details"
        >
          <Tab label="Task Details" />
          <Tab label="Applicants" />
        </Tabs>

        {/* Task Details */}
        {tabIndex === 0 && (
          <Paper elevation={1} className="p-4 rounded-lg bg-white mt-4">
            {/* Task Info */}
            {task && (
              <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <Typography variant="body2" className="text-gray-500">
                    💰 Budget
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    ${task.rate}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" className="text-gray-500">
                    ⚡ Priority
                  </Typography>
                  <Chip label={task.priority} color="primary" size="small" />
                </div>
                <div>
                  <Typography variant="body2" className="text-gray-500">
                    🕒 Posted
                  </Typography>
                  <Typography variant="subtitle2">
                    {new Date(task.created_at).toLocaleString()}
                  </Typography>
                </div>
              </Box>
            )}

            {/* Description */}
            <Paper
              elevation={1}
              className="p-6 bg-white rounded-lg space-y-2 mt-4"
            >
              <Typography variant="h6" className="text-gray-800 font-semibold">
                Project Description
              </Typography>
              <Divider />
              <Typography
                variant="body1"
                className="text-gray-700 whitespace-pre-line leading-relaxed"
              >
                {task?.description}
              </Typography>
              <Paper elevation={1} className="p-4 rounded-lg bg-white mt-6">
                <Typography
                  variant="h6"
                  className="text-gray-800 font-semibold"
                >
                  Required Skills
                </Typography>
                <Box className="flex flex-wrap gap-2 mt-2">
                  {task.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill.skills}
                      color="secondary"
                      size="small"
                    />
                  ))}
                </Box>
              </Paper>
            </Paper>

            {/* Application Form */}
            {hasApplied ? (
              <Box className="text-center text-green-600 mt-4">
                <Typography variant="h6">
                  You have already applied for this task!
                </Typography>
              </Box>
            ) : (
              <Paper
                elevation={2}
                className="p-6 bg-white rounded-lg space-y-4 mt-4"
              >
                <Typography
                  variant="h6"
                  className="text-blue-700 font-semibold"
                >
                  Apply for this Task
                </Typography>
                <Button onClick={askAiSuggestion}>
                  ✍️ AI Suggest Cover Letter
                </Button>

                <TextField
                  fullWidth
                  multiline
                  rows={9}
                  label="Why are you a good fit?"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />

                <FormControl component="fieldset">
                  <FormLabel component="legend">Rate Type</FormLabel>
                  <RadioGroup
                    row
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value)}
                  >
                    <FormControlLabel
                      value="hourly"
                      control={<Radio />}
                      label="Hourly"
                    />
                    <FormControlLabel
                      value="fixed"
                      control={<Radio />}
                      label="Fixed Rate"
                    />
                  </RadioGroup>
                </FormControl>

                <TextField
                  fullWidth
                  label={
                    rateType === "hourly"
                      ? "Proposed Hourly Rate ($/hr)"
                      : "Proposed Fixed Price ($)"
                  }
                  type="number"
                  value={rateValue}
                  onChange={(e) => setRateValue(e.target.value)}
                />

                <Box className="flex justify-end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitApplication}
                    disabled={!coverLetter.trim() || !rateValue}
                  >
                    Submit Application
                  </Button>
                </Box>
              </Paper>
            )}
          </Paper>
        )}

        {/* Applicants List */}
        {tabIndex === 1 && (
          <Paper elevation={1} className="p-6 rounded-lg bg-white mt-4">
            <Typography variant="h6" className="text-blue-700 font-semibold">
              Applicants
            </Typography>

            {applicants.length > 0 ? (
              <Box>
                {applicants.map((applicant, index) => (
                  <Box
                    key={index}
                    className="mt-4 p-4 border-b border-gray-300"
                  >
                    {/* Applicant Information */}
                    <Box className="flex items-center gap-4">
                      <Typography variant="body1" className="font-semibold">
                        {applicant.user.firstname} {applicant.user.lastname}
                      </Typography>
                      <Chip
                        label={`Status: ${
                          applicant.status === 1 ? "Applied" : "Reviewed"
                        }`}
                        color={applicant.status === 1 ? "primary" : "default"}
                        size="small"
                      />
                    </Box>

                    {/* Applicant's Proposal */}
                    <Typography variant="body2" className="text-gray-700 mt-2">
                      <strong>Proposal:</strong>
                      <div className="whitespace-pre-line">
                        {applicant.proposal}
                      </div>
                    </Typography>

                    {/* Applicant's Proposed Rate */}
                    <Typography variant="body2" className="text-gray-700 mt-2">
                      <strong>Proposed Rate:</strong> {applicant.proposal_rate}{" "}
                      {applicant.proposal_currency}
                    </Typography>

                    {/* Applicant's Applied Date */}
                    <Typography variant="body2" className="text-gray-500 mt-1">
                      <strong>Applied on:</strong>{" "}
                      {new Date(applicant.applied_date).toLocaleString()}
                    </Typography>

                    {/* Divider */}
                    <Divider className="my-2" />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" className="text-gray-500">
                No applicants yet.
              </Typography>
            )}
          </Paper>
        )}
      </Box>
    </div>
  );
};

export default TaskDetails;
