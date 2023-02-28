import { APIGatewayProxyResultV2 } from "aws-lambda";

export const badRequest = (message: string): APIGatewayProxyResultV2 => {
  return {
    statusCode: 400,
    body: JSON.stringify({
      name: "BAD_REQUEST",
      message,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
