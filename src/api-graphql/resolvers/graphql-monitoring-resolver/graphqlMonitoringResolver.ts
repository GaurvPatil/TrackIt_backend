import {
  SuccessHandler,
  SuccessResponse,
} from "../../../utils/helper/responseHandeling";

const graphqlMonitoringResolver = {
  getServerStatusResponse: async (): Promise<SuccessResponse> => {
    return SuccessHandler.standardSuccessHandler(
      200,
      "ok",
      "GraphQL Server is running smoothly.",
      null
    );
  },
};

export default graphqlMonitoringResolver;
