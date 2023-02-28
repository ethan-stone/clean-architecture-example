import { APIGatewayProxyResultV2 } from "aws-lambda";

export const internalError = () => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      name: "INTERNAL_ERROR",
      message: "An unknown internal error occurred.",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
