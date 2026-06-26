import { config as reactInternalConfig } from "@ddsf/eslint-config/react-internal";

export default [
  ...reactInternalConfig,
  { ignores: ["dist/", "storybook-static/", ".storybook/"] },
];
