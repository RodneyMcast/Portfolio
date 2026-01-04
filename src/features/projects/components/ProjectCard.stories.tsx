import { withMemoryRouter } from '../../../storybook/decorators';

import { ProjectCard } from './ProjectCard';

import type { Project } from '../types';
import type { Meta, StoryObj } from '@storybook/react';

const baseProject: Project = {
  id: 'project-1',
  title: 'Portfolio Dashboard',
  description: 'A clean dashboard layout for tracking projects.',
  longDescription:
    'A longer description for the project detail page. It covers goals and features.',
  year: 2024,
  category: 'web',
  techStack: ['React', 'TypeScript', 'Redux'],
  imageUrl: '/images/project-placeholder.svg',
  liveUrl: 'https://example.com',
  repoUrl: 'https://github.com/example',
};

const meta: Meta<typeof ProjectCard> = {
  title: 'Projects/ProjectCard',
  component: ProjectCard,
  decorators: [withMemoryRouter()],
  argTypes: {
    project: { control: 'object' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

export const Default: Story = {
  args: {
    project: baseProject,
  },
};

export const Active: Story = {
  args: {
    project: {
      ...baseProject,
      id: 'project-2',
      title: 'Featured: Unity Mini Game',
      category: 'games',
      techStack: ['Unity', 'C#', 'Shader Graph'],
    },
  },
};

export const Disabled: Story = {
  args: {
    project: baseProject,
    disabled: true,
  },
};

export const HoverPreview: Story = {
  args: {
    project: baseProject,
  },
  render: (args) => (
    <div className="story-hover card-hover">
      <style>{`
        .card-hover .project-card {
          border-color: var(--color-border-strong);
          background: var(--color-card-strong);
          box-shadow: 0 16px 32px var(--color-shadow),
            0 0 18px var(--color-glow-faint);
          transform: translateY(-4px);
        }
      `}</style>
      <ProjectCard {...args} />
    </div>
  ),
};

export const WithLongTitle: Story = {
  args: {
    project: {
      ...baseProject,
      id: 'project-3',
      title: 'A Very Long Project Title That Stresses The Layout On Smaller Screens',
    },
  },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

export const WithoutLinks: Story = {
  args: {
    project: {
      ...baseProject,
      id: 'project-4',
      title: 'No Links Project',
      liveUrl: '',
      repoUrl: '',
    },
  },
};
