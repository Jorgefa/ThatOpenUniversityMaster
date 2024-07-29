import { IProject, ProjectStatus, UserRole } from "./classes/Project"
import { ProjectsManager } from "./classes/ProjectsManager"

function showModal(id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}

function closeModal(id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
// Sidebar
// Projects page button
const PageProjectsBtn = document.getElementById("page-projects-btn")
if (PageProjectsBtn) {
  PageProjectsBtn.addEventListener("click", () => {
    const projectsPage = document.getElementById("projects-page")
    const detailsPage = document.getElementById("project-details")
    if (!(projectsPage && detailsPage)) { return }
    projectsPage.style.display = "flex"
    detailsPage.style.display = "none"
  })
} else {
  console.warn("Page projects button was not found")
}

// Users page button
// TO DO

// Header
// New project
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
  console.warn("New projects button was not found")
}

// Export projects
const exportProjectsBtn= document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()
  })
}

// Import projects
const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}

// Project details
// Edit project
const editProjectBtn = document.getElementById("edit-project-btn")
if (editProjectBtn) {
  editProjectBtn.addEventListener("click", () => {
    try {
      console.log("EDITTING");
      showModal("new-project-modal");
    } catch (err) {
      alert(err)
    }
  })
} else {
  console.warn("Edit projects button was not found")
}

// New project form
// Cancel Btn
const cancelBtn = document.getElementById("new-project-form-cancelBtn")
if (cancelBtn && cancelBtn instanceof HTMLButtonElement) {
  cancelBtn.addEventListener("click", () => {
  try {
    closeModal("new-project-modal")
  } catch (err) {
    alert(err)
  }}
)}
;

// Submitting
const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus,
      userRole: formData.get("userRole") as UserRole,
      finishDate: new Date(formData.get("finishDate") as string)
    }
    try {
      const project = projectsManager.newProject(projectData)
      console.log(project)
      projectForm.reset()
      closeModal("new-project-modal")
    } catch (err) {
      alert(err)
    }
  })
} else {
	console.warn("The project form was not found. Check the ID!")
}