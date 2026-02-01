import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Project {
    id: string
    name: string
    filePath: string
}

interface ProjectState {
    projects: Project[]
    activeProject: Project | null
    addProject: (project: Project) => void
    removeProject: (id: string) => void
    setActiveProject: (id: string) => void
}

const testprojects = [
    {
        id: '1',
        name: 'Test Project 1',
        filePath: '/home/kiri/Desktop/test'
    },
    {
        id: '2',
        name: 'Test Project 2',
        filePath: '/home/kiri/Desktop/test2'
    }
]

export const useProjectStore = create<ProjectState>()(
    persist(
        (set) => ({
            projects: process.env.NODE_ENV === 'development' ? testprojects : [],
            activeProject: testprojects[0] || null,

            addProject: (project) => set((state) => ({
                projects: [...state.projects, project]
            })),

            removeProject: (id) => set((state) => ({
                projects: state.projects.filter((p) => p.id !== id)
            })),

            setActiveProject: (id) => set((state) => ({
                activeProject: state.projects.find((p) => p.id === id) || null
            })),
        }),
        {
            name: 'asset-drop-projects',
        }
    )
)