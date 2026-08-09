import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import api from "../api";
import "../css/projects.css";

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL = (
    process.env.REACT_APP_API_URL ||
    "https://gkt-website.onrender.com"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api/projects`;

// =====================================================
// EMPTY PROJECT
// =====================================================

const EMPTY_PROJECT = {
    name: "",
    client: "",
    developer: "",
    deadline: "",
    progress: 0,
    status: "Pending",
};

// =====================================================
// PROJECTS
// =====================================================

function Projects() {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    const [editingProject, setEditingProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const [form, setForm] = useState({
        ...EMPTY_PROJECT,
    });

    const [saving, setSaving] = useState(false);

    // =====================================================
    // AUTH CONFIG
    // =====================================================

    const getConfig = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            return {};
        }

        return {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
    };

    // =====================================================
    // CHECK TOKEN
    // =====================================================

    const checkAuthentication = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Login Required",
                text: "Your admin session has expired. Please login again.",
                confirmButtonText: "Login",
            }).then(() => {
                window.location.href = "/admin";
            });

            return false;
        }

        return true;
    };

    // =====================================================
    // FETCH PROJECTS
    // =====================================================

    const fetchProjects = useCallback(async () => {
        if (!checkAuthentication()) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            console.log("Fetching projects from:", API_URL);

            const response = await axios.get(
                API_URL,
                getConfig()
            );

            console.log(
                "PROJECTS RESPONSE:",
                response.data
            );

            if (Array.isArray(response.data)) {
                setProjects(response.data);
            } else if (Array.isArray(response.data?.projects)) {
                setProjects(response.data.projects);
            } else {
                setProjects([]);
            }

        } catch (error) {
            console.error(
                "FETCH PROJECTS ERROR:",
                error.response?.data || error.message
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");

                Swal.fire({
                    icon: "warning",
                    title: "Session Expired",
                    text: "Please login again.",
                    confirmButtonText: "Login",
                }).then(() => {
                    window.location.href = "/admin";
                });

                return;
            }

            setProjects([]);

            Swal.fire({
                icon: "error",
                title: "Unable to Load Projects",
                text:
                    error.response?.data?.detail ||
                    "Could not connect to the backend.",
            });

        } finally {
            setLoading(false);
        }
    }, []);

    // =====================================================
    // LOAD PROJECTS
    // =====================================================

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredProjects = projects.filter((project) => {
        const searchText = search
            .toLowerCase()
            .trim();

        if (!searchText) {
            return true;
        }

        return (
            String(project.name || "")
                .toLowerCase()
                .includes(searchText) ||

            String(project.client || "")
                .toLowerCase()
                .includes(searchText) ||

            String(project.developer || "")
                .toLowerCase()
                .includes(searchText) ||

            String(project.status || "")
                .toLowerCase()
                .includes(searchText)
        );
    });

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                name === "progress"
                    ? Number(value)
                    : value,
        }));
    };

    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const openAddModal = () => {
        setEditingProject(null);

        setForm({
            ...EMPTY_PROJECT,
        });

        setShowModal(true);
    };

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (project) => {
        setEditingProject(project);

        setForm({
            name: project.name || "",
            client: project.client || "",
            developer: project.developer || "",
            deadline: project.deadline || "",
            progress: Number(project.progress || 0),
            status: project.status || "Pending",
        });

        setShowModal(true);
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        setEditingProject(null);

        setForm({
            ...EMPTY_PROJECT,
        });
    };

    // =====================================================
    // SAVE PROJECT
    // =====================================================

    const handleSave = async (e) => {
        e.preventDefault();

        if (!checkAuthentication()) {
            return;
        }

        if (!form.name.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Project Name Required",
                text: "Please enter the project name.",
            });

            return;
        }

        if (!form.client.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Client Required",
                text: "Please enter the client name.",
            });

            return;
        }

        if (!form.developer.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Developer Required",
                text: "Please enter the developer name.",
            });

            return;
        }

        try {
            setSaving(true);

            // =================================================
            // UPDATE
            // =================================================

            if (editingProject) {
                console.log(
                    "Updating project:",
                    editingProject._id
                );

                await axios.put(
                    `${API_URL}/${editingProject._id}`,
                    form,
                    getConfig()
                );

                await fetchProjects();

                await Swal.fire({
                    icon: "success",
                    title: "Project Updated",
                    text: "Project details updated successfully.",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            // =================================================
            // CREATE
            // =================================================

            else {
                console.log(
                    "Creating project:",
                    form
                );

                await axios.post(
                    API_URL,
                    form,
                    getConfig()
                );

                await fetchProjects();

                await Swal.fire({
                    icon: "success",
                    title: "Project Added",
                    text: "Project has been added successfully.",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            closeModal();

        } catch (error) {
            console.error(
                "SAVE PROJECT ERROR:",
                error.response?.data || error.message
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");

                Swal.fire({
                    icon: "warning",
                    title: "Session Expired",
                    text: "Please login again.",
                }).then(() => {
                    window.location.href = "/admin";
                });

                return;
            }

            Swal.fire({
                icon: "error",
                title: "Unable to Save Project",
                text:
                    error.response?.data?.detail ||
                    "Something went wrong while saving the project.",
            });

        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // VIEW PROJECT
    // =====================================================

    const handleView = (project) => {
        setSelectedProject(project);
        setShowViewModal(true);
    };

    // =====================================================
    // DELETE PROJECT
    // =====================================================

    const handleDelete = async (project) => {
        if (!checkAuthentication()) {
            return;
        }

        const result = await Swal.fire({
            title: "Delete Project?",
            text: `Are you sure you want to delete "${project.name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await axios.delete(
                `${API_URL}/${project._id}`,
                getConfig()
            );

            await fetchProjects();

            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Project deleted successfully.",
                timer: 1500,
                showConfirmButton: false,
            });

        } catch (error) {
            console.error(
                "DELETE PROJECT ERROR:",
                error.response?.data || error.message
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");

                Swal.fire({
                    icon: "warning",
                    title: "Session Expired",
                    text: "Please login again.",
                }).then(() => {
                    window.location.href = "/admin";
                });

                return;
            }

            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text:
                    error.response?.data?.detail ||
                    "Unable to delete the project.",
            });
        }
    };

    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const handleStatusChange = async (
        project,
        newStatus
    ) => {
        if (!checkAuthentication()) {
            return;
        }

        const oldStatus = project.status;

        setProjects((previous) =>
            previous.map((item) =>
                item._id === project._id
                    ? {
                          ...item,
                          status: newStatus,
                      }
                    : item
            )
        );

        try {
            await axios.put(
                `${API_URL}/${project._id}/status`,
                {
                    status: newStatus,
                },
                getConfig()
            );

        } catch (error) {
            console.error(
                "STATUS UPDATE ERROR:",
                error.response?.data || error.message
            );

            setProjects((previous) =>
                previous.map((item) =>
                    item._id === project._id
                        ? {
                              ...item,
                              status: oldStatus,
                          }
                        : item
                )
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");

                Swal.fire({
                    icon: "warning",
                    title: "Session Expired",
                    text: "Please login again.",
                }).then(() => {
                    window.location.href = "/admin";
                });

                return;
            }

            Swal.fire({
                icon: "error",
                title: "Status Update Failed",
                text:
                    error.response?.data?.detail ||
                    "Unable to update project status.",
            });
        }
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {
        return String(status || "Pending")
            .toLowerCase()
            .replace(/\s+/g, "-");
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <Sidebar />

            <div className="dashboard-main">
                <Topbar />

                <div className="dashboard-content">
                    <div className="projects-page">

                        {/* HEADER */}

                        <div className="projects-header">
                            <div>
                                <h2>
                                    📁 Projects
                                </h2>

                                <p>
                                    Manage projects,
                                    developers,
                                    deadlines and
                                    project progress.
                                </p>
                            </div>

                            <button
                                className="add-project-btn"
                                onClick={openAddModal}
                            >
                                + Add Project
                            </button>
                        </div>

                        {/* SEARCH */}

                        <input
                            className="project-search"
                            type="text"
                            placeholder="Search projects, clients, developers..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                        {/* TABLE */}

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Project</th>
                                        <th>Client</th>
                                        <th>Developer</th>
                                        <th>Deadline</th>
                                        <th>Progress</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="no-data"
                                            >
                                                Loading projects...
                                            </td>
                                        </tr>
                                    ) : filteredProjects.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="no-data"
                                            >
                                                {search
                                                    ? "No projects found."
                                                    : "No projects available."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProjects.map(
                                            (project, index) => {
                                                const progress =
                                                    Math.min(
                                                        100,
                                                        Math.max(
                                                            0,
                                                            Number(
                                                                project.progress ||
                                                                    0
                                                            )
                                                        )
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            project._id ||
                                                            project.id ||
                                                            index
                                                        }
                                                    >
                                                        <td>
                                                            {index + 1}
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {
                                                                    project.name
                                                                }
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {project.client ||
                                                                "-"}
                                                        </td>

                                                        <td>
                                                            {project.developer ||
                                                                "-"}
                                                        </td>

                                                        <td>
                                                            {project.deadline ||
                                                                "-"}
                                                        </td>

                                                        <td>
                                                            <div className="progress-wrapper">
                                                                <div className="progress-bar">
                                                                    <div
                                                                        className="progress-fill"
                                                                        style={{
                                                                            width: `${progress}%`,
                                                                        }}
                                                                    />
                                                                </div>

                                                                <span>
                                                                    {
                                                                        progress
                                                                    }
                                                                    %
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <select
                                                                className={`project-status ${getStatusClass(
                                                                    project.status
                                                                )}`}
                                                                value={
                                                                    project.status ||
                                                                    "Pending"
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handleStatusChange(
                                                                        project,
                                                                        e.target.value
                                                                    )
                                                                }
                                                            >
                                                                <option value="Pending">
                                                                    Pending
                                                                </option>

                                                                <option value="In Progress">
                                                                    In Progress
                                                                </option>

                                                                <option value="On Hold">
                                                                    On Hold
                                                                </option>

                                                                <option value="Completed">
                                                                    Completed
                                                                </option>

                                                                <option value="Cancelled">
                                                                    Cancelled
                                                                </option>
                                                            </select>
                                                        </td>

                                                        <td>
                                                            <div className="project-actions">

                                                                <button
                                                                    className="view-btn"
                                                                    onClick={() =>
                                                                        handleView(
                                                                            project
                                                                        )
                                                                    }
                                                                >
                                                                    View
                                                                </button>

                                                                <button
                                                                    className="edit-btn"
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            project
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    className="delete-btn"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            project
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            {showModal && (
                <div className="modal-overlay">
                    <div className="project-modal">

                        <div className="modal-header">
                            <h3>
                                {editingProject
                                    ? "Edit Project"
                                    : "Add Project"}
                            </h3>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSave}>

                            <div className="form-group">
                                <label>
                                    Project Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter project name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Client
                                </label>

                                <input
                                    type="text"
                                    name="client"
                                    value={form.client}
                                    onChange={handleChange}
                                    placeholder="Enter client name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Developer
                                </label>

                                <input
                                    type="text"
                                    name="developer"
                                    value={form.developer}
                                    onChange={handleChange}
                                    placeholder="Enter developer name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Deadline
                                </label>

                                <input
                                    type="date"
                                    name="deadline"
                                    value={form.deadline}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Progress: {form.progress}%
                                </label>

                                <input
                                    type="range"
                                    name="progress"
                                    min="0"
                                    max="100"
                                    value={form.progress}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="In Progress">
                                        In Progress
                                    </option>

                                    <option value="On Hold">
                                        On Hold
                                    </option>

                                    <option value="Completed">
                                        Completed
                                    </option>

                                    <option value="Cancelled">
                                        Cancelled
                                    </option>
                                </select>
                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingProject
                                        ? "Save Changes"
                                        : "Add Project"}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =====================================================
                VIEW MODAL
            ===================================================== */}

            {showViewModal &&
                selectedProject && (
                    <div className="modal-overlay">
                        <div className="project-modal view-modal">

                            <div className="modal-header">
                                <h3>
                                    Project Details
                                </h3>

                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={() =>
                                        setShowViewModal(false)
                                    }
                                >
                                    ×
                                </button>
                            </div>

                            <div className="project-details">

                                <div className="detail-row">
                                    <strong>
                                        Project
                                    </strong>

                                    <span>
                                        {
                                            selectedProject.name
                                        }
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <strong>
                                        Client
                                    </strong>

                                    <span>
                                        {
                                            selectedProject.client ||
                                            "-"
                                        }
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <strong>
                                        Developer
                                    </strong>

                                    <span>
                                        {
                                            selectedProject.developer ||
                                            "-"
                                        }
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <strong>
                                        Deadline
                                    </strong>

                                    <span>
                                        {
                                            selectedProject.deadline ||
                                            "-"
                                        }
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <strong>
                                        Progress
                                    </strong>

                                    <span>
                                        {Number(
                                            selectedProject.progress ||
                                                0
                                        )}
                                        %
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <strong>
                                        Status
                                    </strong>

                                    <span
                                        className={`status-badge ${getStatusClass(
                                            selectedProject.status
                                        )}`}
                                    >
                                        {
                                            selectedProject.status ||
                                            "Pending"
                                        }
                                    </span>
                                </div>

                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="close-btn"
                                    onClick={() =>
                                        setShowViewModal(false)
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>
                    </div>
                )}
        </>
    );
}

export default Projects;