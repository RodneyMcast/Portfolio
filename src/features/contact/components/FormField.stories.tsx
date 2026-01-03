import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./FormField";

const meta: Meta<typeof FormField> = {
  title: "Contact/FormField",
  component: FormField,
  argTypes: {
    onChange: { action: "onChange" },
    multiline: { control: "boolean" },
    rows: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    id: "name",
    label: "Name",
    value: "",
    error: null,
  },
};

export const WithError: Story = {
  args: {
    id: "email",
    label: "Email",
    value: "rodney@",
    error: "Enter a valid email address.",
    type: "email",
  },
};

export const Disabled: Story = {
  args: {
    id: "subject",
    label: "Subject",
    value: "Disabled field",
    error: null,
  },
  render: (args) => (
    <div className="form-field">
      <label htmlFor={args.id}>{args.label}</label>
      <input id={args.id} value={args.value} disabled onChange={() => {}} />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};
