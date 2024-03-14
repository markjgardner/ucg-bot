using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace UCGBot
{
    public class Status
    {
        private readonly ILogger _logger;

        public Status(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<Status>();
        }

        [Function("status")]
        public HttpResponseData Get(
            [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequestData req,
            [BlobInput("ucgpurchased/state")]string state)
        {
            _logger.LogInformation($"Current state: {state}");
            var status = HttpStatusCode.OK;
            if (state == "Purchased")
            {
                status = HttpStatusCode.Created;
            }

            return req.CreateResponse(status);
        }

        [Function("bought")]
        [BlobOutput("ucgpurchased/state")]
        public string Put([HttpTrigger(AuthorizationLevel.Function, "put")]HttpRequestData req)
        {
            _logger.LogInformation("UCG purchased");
            return "Purchased";
        }
    }
}
