import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "../css/projects.css";


// =====================================================
// API
// =====================================================

const API_URL = "http://127.0.0.1:8000/api/projects";


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
// PROJECTS COMPONENT
// =====================================================

function Projects() {

  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);

  const [editingProject, setEditingProject] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null);

  const [form, setForm] = useState(EMPTY_PROJECT);

  const [saving, setSaving] = useState(false);


  // =====================================================
  // FETCH PROJECTS
  // =====================================================

  const fetchProjects = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        API_URL,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      setProjects(response.data || []);

    } catch (error) {

      console.error(
        "FETCH PROJECTS ERROR:",
        error.response?.data || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Unable to load projects",
        text:
          error.response?.data?.detail ||
          "Could not connect to the backend.",
      });

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD ON PAGE OPEN
  // =====================================================

  useEffect(() => {

    fetchProjects();

  }, []);


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredProjects = projects.filter((project) => {

    const searchText = search.toLowerCase();

    return (

      String(project.name || "")
        .toLowerCase()
        .includes(searchText)

      ||

      String(project.client || "")
        .toLowerCase()
        .includes(searchText)

      ||

      String(project.developer || "")
        .toLowerCase()
        .includes(searchText)

      ||

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

    setForm(EMPTY_PROJECT);

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

    setForm(EMPTY_PROJECT);

  };


  // =====================================================
  // ADD / UPDATE PROJECT
  // =====================================================

  const handleSave = async (e) => {

    e.preventDefault();

    if (!form.name.trim()) {

      Swal.fire({
        icon: "warning",
        title: "Project name required",
        text: "Please enter the project name.",
      });

      return;
    }


    if (!form.client.trim()) {

      Swal.fire({
        icon: "warning",
        title: "Client required",
        text: "Please enter the client name.",
      });

      return;
    }


    if (!form.developer.trim()) {

      Swal.fire({
        icon: "warning",
        title: "Developer required",
        text: "Please enter the developer name.",
      });

      return;
    }


    try {

      setSaving(true);

      const token = localStorage.getItem("token");

      const config = {

        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},

      };


      // =================================================
      // UPDATE
      // =================================================

      if (editingProject) {

        await axios.put(

          `${API_URL}/${editingProject._id}`,

          form,

          config

        );


        await fetchProjects();


        Swal.fire({

          icon: "success",

          title: "Project updated",

          text: "Project details have been updated successfully.",

          timer: 1500,

          showConfirmButton: false,

        });

      }


      // =================================================
      // CREATE
      // =================================================

      else {

        await axios.post(

          API_URL,

          form,

          config

        );


        await fetchProjects();


        Swal.fire({

          icon: "success",

          title: "Project added",

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

      Swal.fire({

        icon: "error",

        title: "Unable to save project",

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

    const result = await Swal.fire({

      title: "Delete project?",

      text: `Are you sure you want to delete "${project.name}"?`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes, delete",

      cancelButtonText: "Cancel",

    });


    if (!result.isConfirmed) {
      return;
    }


    try {

      const token = localStorage.getItem("token");

      await axios.delete(

        `${API_URL}/${project._id}`,

        {

          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},

        }

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

      Swal.fire({

        icon: "error",

        title: "Delete failed",

        text:
          error.response?.data?.detail ||
          "Unable to delete the project.",

      });

    }

  };


  // =====================================================
  // UPDATE STATUS DIRECTLY
  // =====================================================

  const handleStatusChange = async (
    project,
    newStatus
  ) => {

    try {

      const token = localStorage.getItem("token");


      // Optimistic UI update

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


      await axios.put(

        `${API_URL}/${project._id}/status`,

        {
          status: newStatus,
        },

        {

          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},

        }

      );


    } catch (error) {

      console.error(
        "STATUS UPDATE ERROR:",
        error.response?.data || error.message
      );


      await fetchProjects();


      Swal.fire({

        icon: "error",

        title: "Status update failed",

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


            {/* =========================================
                    HEADER
            ========================================= */}

            <div className="projects-header">

              <div>

                <h2>📁 Projects</h2>

                <p>
                  Manage projects, developers, deadlines
                  and project progress.
                </p>

              </div>


              <button

                className="add-project-btn"

                onClick={openAddModal}

              >

                + Add Project

              </button>

            </div>


            {/* =========================================
                    SEARCH
            ========================================= */}

            <input

              className="project-search"

              type="text"

              placeholder="Search projects, clients, developers..."

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }

            />


            {/* =========================================
                    TABLE
            ========================================= */}

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
                      (project, index) => (

                        <tr
                          key={
                            project._id ||
                            project.id ||
                            index
                          }
                        >

                          {/* ID */}

                          <td>

                            {index + 1}

                          </td>


                          {/* PROJECT */}

                          <td>

                            <strong>
                              {project.name}
                            </strong>

                          </td>


                          {/* CLIENT */}

                          <td>

                            {project.client}

                          </td>


                          {/* DEVELOPER */}

                          <td>

                            {project.developer}

                          </td>


                          {/* DEADLINE */}

                          <td>

                            {project.deadline || "-"}

                          </td>


                          {/* PROGRESS */}

                          <td>

                            <div className="progress-wrapper">

                              <div className="progress-bar">

                                <div

                                  className="progress-fill"

                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(
                                        0,
                                        Number(
                                          project.progress ||
                                          0
                                        )
                                      )
                                    )}%`,
                                  }}

                                />

                              </div>


                              <span>

                                {Number(
                                  project.progress || 0
                                )}
                                %

                              </span>

                            </div>

                          </td>


                          {/* STATUS */}

                          <td>

                            <select

                              className={`project-status ${getStatusClass(
                                project.status
                              )}`}

                              value={
                                project.status ||
                                "Pending"
                              }

                              onChange={(e) =>
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


                          {/* ACTIONS */}

                          <td>

                            <div className="project-actions">

                              <button

                                className="view-btn"

                                onClick={() =>
                                  handleView(project)
                                }

                              >

                                View

                              </button>


                              <button

                                className="edit-btn"

                                onClick={() =>
                                  openEditModal(project)
                                }

                              >

                                Edit

                              </button>


                              <button

                                className="delete-btn"

                                onClick={() =>
                                  handleDelete(project)
                                }

                              >

                                Delete

                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>


          </div>

        </div>

      </div>


      {/* =================================================
              ADD / EDIT MODAL
      ================================================= */}

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


      {/* =================================================
              VIEW MODAL
      ================================================= */}

      {showViewModal &&
        selectedProject && (

          <div className="modal-overlay">

            <div className="project-modal view-modal">


              <div className="modal-header">

                <h3>
                  Project Details
                </h3>


                <button

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
                    {selectedProject.name}
                  </span>

                </div>


                <div className="detail-row">

                  <strong>
                    Client
                  </strong>

                  <span>
                    {selectedProject.client}
                  </span>

                </div>


                <div className="detail-row">

                  <strong>
                    Developer
                  </strong>

                  <span>
                    {selectedProject.developer}
                  </span>

                </div>


                <div className="detail-row">

                  <strong>
                    Deadline
                  </strong>

                  <span>
                    {selectedProject.deadline || "-"}
                  </span>

                </div>


                <div className="detail-row">

                  <strong>
                    Progress
                  </strong>

                  <span>
                    {selectedProject.progress || 0}%
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

                    {selectedProject.status}

                  </span>

                </div>


              </div>


              <div className="modal-actions">

                <button

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