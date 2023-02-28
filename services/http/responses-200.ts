import { APIGatewayProxyResultV2 } from "aws-lambda";

export const ok = (body: Record<string, unknown>): APIGatewayProxyResultV2 => {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
