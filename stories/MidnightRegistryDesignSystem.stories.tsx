import type { Meta, StoryObj } from "@storybook/nextjs";
import { MidnightRegistryDesignSystem } from "@/components/midnight/MidnightRegistryDesignSystem";

const meta = {
  title: "Midnight Registry/Design System",
  component: MidnightRegistryDesignSystem,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MidnightRegistryDesignSystem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CompleteAssetLibrary: Story = {};
