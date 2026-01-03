import type { Meta, StoryObj } from "@storybook/react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "../types";
import { withMemoryRouter } from "../../../storybook/decorators";

const baseProject: Project = {
  id: "project-1",
  title: "Portfolio Dashboard",
  description: "A clean dashboard layout for tracking projects.",
  longDescription:
    "A longer description for the project detail page. It covers goals and features.",
  year: 2024,
  category: "web",
  techStack: ["React", "TypeScript", "Redux"],
  imageUrl: "/images/project-placeholder.svg",
  liveUrl: "https://example.com",
  repoUrl: "https://github.com/example",
};

const meta: Meta<typeof ProjectCard> = {
  title: "Projects/ProjectCard",
  component: ProjectCard,
  decorators: [withMemoryRouter()],
  argTypes: {
    project: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

export const Default: Story = {
  args: {
    project: baseProject,
  },
};

export const WithLongTitle: Story = {
  args: {
    project: {
      ...baseProject,
      id: "project-2",
      title:
        "A Very Long Project Title That Stresses The Layout On Smaller Screens",
    },
  },
};

export const WithoutLinks: Story = {
  args: {
    project: {
      ...baseProject,
      id: "project-3",
      title: "No Links Project",
      liveUrl: "",
      repoUrl: "",
    },
  },
};

export const FeaturedOrHighlighted: Story = {
  args: {
    project: {
      ...baseProject,
      id: "project-4",
      title: "Featured: Unity Mini Game",
      category: "games",
      techStack: ["Unity", "C#", "Shader Graph"],
    },
  },
};
