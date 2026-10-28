export interface ProjectStackItem {
  name: string
  icon: string
}

export interface Project {
  id: string
  number: string
  title: string
  type: string
  timeline: string
  role: string
  image: string
  summary: string
  detail: string
  stack: ProjectStackItem[]
}

export interface Skill {
  name: string
  icon: string
  used: string
}

export interface SkillGroup {
  name: string
  skills: Skill[]
}

export interface ContactFormValues {
  dear: string
  subject: string
  senderName: string
  from: string
  via: string
  body: string
}
