using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
using System;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Services.Implementations
{
    public class StatisticsService : IStatisticsService
    {
        private readonly MyContext context;

        public StatisticsService(MyContext context)
        {
            this.context = context;
        }

        public async Task<ServiceResult> GetTableCountsAsync()
        {
            var result = new List<TableCountDTO>();
            var entityTypes = context.Model.GetEntityTypes();

            foreach (var entityType in entityTypes)
            {
                var tableName = entityType.GetTableName();
                var clrType = entityType.ClrType;

                // Get the generic Set<YourEntityType>
                var method = typeof(DbContext).GetMethod(nameof(DbContext.Set), Type.EmptyTypes);
                var genericMethod = method!.MakeGenericMethod(clrType);
                var dbSet = genericMethod.Invoke(context, null);

                var queryable = dbSet as IQueryable;

                // Use reflection to call CountAsync
                var countAsyncMethod = typeof(EntityFrameworkQueryableExtensions)
                    .GetMethods()
                    .First(m => m.Name == nameof(EntityFrameworkQueryableExtensions.CountAsync)
                             && m.GetParameters().Length == 2); // (IQueryable<T>, CancellationToken)

                var genericCountMethod = countAsyncMethod.MakeGenericMethod(clrType);
                var task = (Task)genericCountMethod.Invoke(null, new object[] { queryable, CancellationToken.None })!;
                await task.ConfigureAwait(false);

                var countProperty = task.GetType().GetProperty("Result");
                var count = (int)(countProperty?.GetValue(task) ?? 0);

                result.Add(new TableCountDTO
                {
                    Table = tableName ?? clrType.Name,
                    Count = count
                });
            }

            return new ServiceResult
            {
                Success = true,
                Data = result
            };
        }
    }
}
