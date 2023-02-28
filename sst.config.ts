import type { SSTConfig } from "sst";
import { MyStack } from "./stacks/MyStack";

export default {
  config() {
    return {
      name: "clean-architecture-example",
      region: "us-east-1",
      profile: "admin-personal",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs16.x",
      architecture: "arm_64",
    });

    app.stack(MyStack);
  },
} satisfies SSTConfig;
