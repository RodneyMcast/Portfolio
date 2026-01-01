export type ProjectCategory = "web" | "mobile" | "games" | "api";
export type ProjectFilterCategory = "all" | ProjectCategory;
export type ProjectSortMode = "recent" | "name";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  year: number;
  category: ProjectCategory;
  techStack: string[];
  imageUrl: string;
  liveUrl: string;
  repoUrl: string;
}
