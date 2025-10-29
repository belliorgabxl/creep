export type Project = {
  id: string
  name: string
  owner: string
  role?: "owner" | "assignee" | "viewer"
  status: "draft" | "in_progress" | "on_hold" | "done"
  progress: number 
  updatedAt: string 
}