using cookiesid.Data;
using cookiesid.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options =>  options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddRazorPages();
builder.Services.AddMvc();

var origins = builder.Configuration.GetSection("AllowedOrigins").GetChildren().Select(k=>k.Value).ToArray();

builder.Services.AddCors(o =>
{
    o.AddPolicy("extension", p =>
    {
        p.WithOrigins(origins);
        p.AllowAnyMethod();
        p.AllowAnyHeader();
        p.AllowCredentials();
    });
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Events.OnRedirectToAccessDenied = RedirectHelper.ReplaceRedirector(HttpStatusCode.Forbidden, options.Events.OnRedirectToAccessDenied);
    options.Events.OnRedirectToLogin = RedirectHelper.ReplaceRedirector(HttpStatusCode.Unauthorized, options.Events.OnRedirectToLogin);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseCors("extension");
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(c =>
{
    c.MapControllers();
    c.MapRazorPages();
});

app.Run();
