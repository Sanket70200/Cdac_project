using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using P20_Tran.Models;
using P20_Tran.Service;
using Steeltoe.Discovery.Client;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers()
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling =
                    Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

        builder.Services.AddScoped<UserService>();
        builder.Services.AddScoped<TripsService>();
        builder.Services.AddScoped<CompanyService>();
        builder.Services.AddScoped<AdminService>();

        builder.Services.AddDbContext<p20_safar1Context>(options =>
        {
            options.UseMySql(
                    builder.Configuration.GetConnectionString("SafarDB"),
                    new MySqlServerVersion(new Version(8, 0, 21))
                )
                .EnableDetailedErrors()
                .EnableSensitiveDataLogging()
                .ConfigureWarnings(warnings =>
                    warnings.Ignore(CoreEventId.DetachedLazyLoadingWarning));
        });

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddDiscoveryClient(builder.Configuration);

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseDiscoveryClient();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}