export type ProjectCategory = "web" | "mobile" | "blockchain" | "ai";
export type ProjectFilterCategory = "all" | ProjectCategory;
export type ProjectSortMode = "recent" | "name";

export interface Project {
  id: string;
  title: string;
  description: string;
  year: number;
  category: ProjectCategory;
  techStack: string[];
  liveUrl: string;
  repoUrl: string;
}
