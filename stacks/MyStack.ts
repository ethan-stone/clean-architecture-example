import { StackContext, Api } from "sst/constructs";

export function MyStack({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    routes: {
      "POST /": "services/functions/subscribeUser/handler.main",
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
