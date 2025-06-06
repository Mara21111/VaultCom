using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IMessageInfoService
    {
        Task<ServiceResult> ViewMessageAsync(MessageInfoDTO dto);
    }
}
