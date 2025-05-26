using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Bcpg;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsController : MainController
    {
        private readonly IStatisticsService _statisticsService;

        public StatisticsController(IStatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }

        [HttpGet("table-counts")]
        public Task<IActionResult> GetTableCounts()
            => HandleService(() => _statisticsService.GetTableCountsAsync());
    }
}
