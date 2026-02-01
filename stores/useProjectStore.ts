import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Project {
    id: string
    name: string
    filePath: string
}

interface ProjectState {
    projects: Project[]
    activeProjectId: string | null
    addProject: (project: Project) => void
    removeProject: (id: string) => void
    setActiveProject: (id: string) => void
}

const testprojects = [
    {
        id: '1',
        name: 'Project 1',
        filePath: '/home/kiri/Desktop/test'
    },
    {
        id: '2',
        name: 'Project 2',
        filePath: '/home/kiri/Desktop/test2'
    }
]

export const useProjectStore = create<ProjectState>()(
    persist(
        (set) => ({
            projects: process.env.NODE_ENV === 'development' ? testprojects : [],
            activeProjectId: null,

            addProject: (project) => set((state) => ({
                projects: [...state.projects, project]
            })),

            removeProject: (id) => set((state) => ({
                projects: state.projects.filter((p) => p.id !== id)
            })),

            setActiveProject: (id) => set({ activeProjectId: id }),
        }),
        {
            name: 'asset-drop-projects',
        }
    )
)