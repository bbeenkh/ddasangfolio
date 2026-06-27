import { config as reactInternalConfig } from "@fblg/eslint-config/react-internal";

export default [
  ...reactInternalConfig,
  { ignores: ["dist/", "storybook-static/", ".storybook/"] },
];
