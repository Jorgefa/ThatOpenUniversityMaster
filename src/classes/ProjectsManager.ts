import { IProject, Project } from "./Project"

export class ProjectsManager {
  list: Project[] = []
  ui: HTMLElement
  curProject: Project

  constructor(container: HTMLElement) {
    this.ui = container
    this.newProject({
      name: "Default Project",
      description: "This is just a default app project",
      status: "pending",
      userRole: "architect",
      finishDate: new Date()
    })
  }


  newProject(data: IProject) {
    const projectNames = this.list.map((project) => {
      return project.name
    })
    const nameInUse = projectNames.includes(data.name)
    if (nameInUse) {
      throw new Error(`A project with the name "${data.name}" already exists`)
    }
    if (data.name.length < 5) {
      throw new Error('Project name must have at least 5 characters')
    }
    if(isNaN(data.finishDate.getTime())) {
      data.finishDate = new Date()
    }
    const project = new Project(data)
    project.ui.addEventListener("click", () => {
      const projectsPage = document.getElementById("projects-page")
      const detailsPage = document.getElementById("project-details")
      if (!(projectsPage && detailsPage)) { return }
      projectsPage.style.display = "none"
      detailsPage.style.display = "flex"
      this.setDetailsPage(project)
    })
    this.ui.append(project.ui)
    this.list.push(project)	
    return project
  }

  private setDetailsPage(project: Project) {
    if(!project) { return}
    this.curProject = project
    const detailsPage = document.getElementById("project-details")
    if (!detailsPage) { return }
    const name = detailsPage.querySelector("[data-project-info='name']")
    if (name) { name.textContent = project.name }
    const description = detailsPage.querySelector("[data-project-info='description']")
    if (description) { description.textContent = project.description }
    const cardName = detailsPage.querySelector("[data-project-info='cardName']")
    if (cardName) { cardName.textContent = project.name }
    const cardDescription = detailsPage.querySelector("[data-project-info='cardDescription']")
  }

  selectProject(id: string){
    const project = this.getProject(id)
    if (!project) {return}
    console.log(`Selected "${project.name}" project`);
    
  }

  getProject(id: string) {
    const project = this.list.find((project) => {
      return project.id === id
    })
    return project
  }
  
  deleteProject(id: string) {
    const project = this.getProject(id)
    if (!project) { return }
    project.ui.remove()
    const remaining = this.list.filter((project) => {
      return project.id !== id
    })
    this.list = remaining
  }

  editProject(id: string, data: IProject) {
    const project = this.getProject(id)
    if (!project) { return }

    const projectNames = this.list.map((project) => {
      return project.name
    })
    const nameInUse = projectNames.includes(data.name)
    if (nameInUse) {
      throw new Error(`A project with the name "${data.name}" already exists`)
    }
    if (data.name.length < 5) {
      throw new Error('Project name must have at least 5 characters')
    }
    project.name = data.name

    if(isNaN(data.finishDate.getTime())) {
      data.finishDate = new Date()
    }
    project.finishDate = data.finishDate    

    this.setDetailsPage(project)
    
    return project
  }
  
  exportToJSON(fileName: string = "projects") {
    const json = JSON.stringify(this.list, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }
  
  importFromJSON() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      const json = reader.result
      if (!json) { return }
      const projects: IProject[] = JSON.parse(json as string)
      for (const project of projects) {
        try {
          this.newProject(project)
        } catch (error) {
          
        }
      }
    })
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) { return }
      reader.readAsText(filesList[0])
    })
    input.click()
  }
}