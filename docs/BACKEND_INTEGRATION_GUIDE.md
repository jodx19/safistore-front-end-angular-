# 🔌 Revised Backend Integration Guide - SafiStore with .NET Framework

### **A Corrected Guide for a Successful Integration**

This guide provides a corrected, complete, and consistent set of instructions to integrate the SafiStore Angular frontend with a production-ready **.NET Framework Web API** backend. It has been revised to resolve inconsistencies from the previous version and ensures a clear path to a working application.

### Architecture Overview

**Frontend (Angular)** ↔ **ASP.NET Web API 2 (OWIN)** ↔ **Entity Framework 6** ↔ **SQL Server Database**

- **Technology Stack**: .NET Framework 4.7.2+, ASP.NET Web API 2, Entity Framework 6, OWIN, SQL Server.
- **API Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT Bearer Tokens managed via the OWIN pipeline.

---

## Table of Contents

1.  [Phase 1: Correcting the Backend Setup](#phase-1-correcting-the-backend-setup)
2.  [Phase 2: Database Setup & Migrations](#phase-2-database-setup--migrations)
3.  [Phase 3: Implementing Services with AutoMapper](#phase-3-implementing-services-with-automapper)
4.  [Phase 4: Controllers & Global Error Handling](#phase-4-controllers--global-error-handling)
5.  [Phase 5: Authentication with OWIN](#phase-5-authentication-with-owin)
6.  [Phase 6: Running the Full Application](#phase-6-running-the-full-application)
7.  [Phase 7: Angular Frontend Integration](#phase-7-angular-frontend-integration)
8.  [Appendix: Full Code for Configuration Files](#appendix-full-code-for-configuration-files)

---

## **PHASE 1: Correcting the Backend Setup**

This phase corrects the project configuration, NuGet packages, and startup process.

### Step 1: Verify Project and Install Correct NuGet Packages

Ensure your project is an **ASP.NET Web Application (.NET Framework)** with the **Web API** template.

Open the **Package Manager Console** (`Tools > NuGet Package Manager > Package Manager Console`) and run these commands to install the correct packages for .NET Framework.

```powershell
Install-Package EntityFramework -Version 6.4.4
Install-Package Microsoft.AspNet.WebApi.Cors -Version 5.2.9
Install-Package System.IdentityModel.Tokens.Jwt -Version 5.6.0
Install-Package Microsoft.Owin.Security.Jwt -Version 4.2.2
Install-Package Microsoft.Owin.Security.OAuth -Version 4.2.2
Install-Package Microsoft.Owin.Host.SystemWeb -Version 4.2.2
Install-Package Swashbuckle.Core -Version 5.6.0
Install-Package Unity.AspNet.WebApi -Version 5.11.1
Install-Package AutoMapper -Version 10.1.1
Install-Package Newtonsoft.Json -Version 13.0.1
```

### Step 2: Configure `Web.config`

This is the primary configuration file for your application. Update it with the correct connection string and JWT settings.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <configSections>
    <section name="entityFramework" type="System.Data.Entity.Internal.ConfigFile.EntityFrameworkSection, EntityFramework, Version=6.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" requirePermission="false" />
  </configSections>
  
  <connectionStrings>
    <!-- SQL Server Local Database for development -->
    <add name="DefaultConnection"
         connectionString="Server=(localdb)\mssqllocaldb;Database=SafiStoreDb-Revised;Trusted_Connection=True;MultipleActiveResultSets=true;"
         providerName="System.Data.SqlClient" />
  </connectionStrings>

  <appSettings>
    <!-- IMPORTANT: Use a strong, unique secret and store it securely in production -->
    <add key="Jwt:Secret" value="YourVeryLongAndSecretKeyAtLeast32CharactersLongForSecurity123456" />
    <add key="Jwt:Issuer" value="SafiStoreApi" />
    <add key="Jwt:Audience" value="SafiStoreClient" />
    <add key="Jwt:AccessTokenExpiration" value="15" />
    <add key="Jwt:RefreshTokenExpiration" value="30" />
  </appSettings>

  <system.web>
    <compilation debug="true" targetFramework="4.7.2" />
    <httpRuntime targetFramework="4.7.2" />
  </system.web>
  
  <system.webServer>
    <handlers>
      <remove name="ExtensionlessUrlHandler-Integrated-4.0" />
      <remove name="OPTIONSVerbHandler" />
      <remove name="TRACEVerbHandler" />
      <add name="ExtensionlessUrlHandler-Integrated-4.0" path="*." verb="*" type="System.Web.Handlers.TransferRequestHandler" preCondition="integratedMode,runtimeVersionv4.0" />
    </handlers>
  </system.webServer>
  
  <runtime>
    <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
      <!-- Add assembly bindings here if you encounter version conflicts -->
    </assemblyBinding>
  </runtime>
  
  <entityFramework>
    <defaultConnectionFactory type="System.Data.Entity.Infrastructure.LocalDbConnectionFactory, EntityFramework">
      <parameters>
        <parameter value="mssqllocaldb" />
      </parameters>
    </defaultConnectionFactory>
    <providers>
      <provider invariantName="System.Data.SqlClient" type="System.Data.Entity.SqlServer.SqlProviderServices, EntityFramework.SqlServer" />
    </providers>
  </entityFramework>
</configuration>
```

### Step 3: Configure Dependency Injection, CORS, and API Routes

We need to configure startup logic in `App_Start`.

1.  **`UnityConfig.cs`**: This sets up the dependency injection container. Create this file in `App_Start`.
2.  **`WebApiConfig.cs`**: This configures API routing, formatters, CORS, and error handling.
3.  **`SwaggerConfig.cs`**: This configures API documentation.

**(See [Appendix](#appendix-full-code-for-configuration-files) for the full code for these files).**

### Step 4: Update `Global.asax.cs`

Modify your `Global.asax.cs` to initialize all the configurations at application start.

```csharp
using System.Web;
using System.Web.Http;

namespace SafiStore.Api
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            // The order of these calls is important.
            GlobalConfiguration.Configure(WebApiConfig.Register);
            UnityConfig.RegisterComponents();
            AutoMapperConfig.Initialize(); // We will create this in Phase 3
        }
    }
}
```

---

## **PHASE 2: Database Setup & Migrations**

This phase corrects the database seeding logic and adds the crucial, previously missing steps for creating the database with Entity Framework 6.

### Step 1: Correct the Database Seeding Logic

The `HasData()` method is for EF Core. In EF6, we use database initializers.

Create a new file `Data/SafiStoreDbInitializer.cs`:

```csharp
using SafiStore.Api.Models.Domain;
using System.Collections.Generic;
using System.Data.Entity;

namespace SafiStore.Api.Data
{
    public class SafiStoreDbInitializer : CreateDatabaseIfNotExists<ApplicationDbContext>
    {
        protected override void Seed(ApplicationDbContext context)
        {
            // Seed Categories
            var categories = new List<Category>
            {
                new Category { Name = "Electronics" },
                new Category { Name = "Clothing" },
                new Category { Name = "Books" },
                new Category { Name = "Home & Garden" }
            };
            categories.ForEach(c => context.Categories.Add(c));
            context.SaveChanges();

            // Seed Products
            var products = new List<Product>
            {
                new Product
                {
                    Title = "Laptop Pro",
                    Description = "High-performance laptop for professionals",
                    Price = 1299.99m,
                    Stock = 50,
                    CategoryId = categories[0].Id,
                    ImageUrl = "https://via.placeholder.com/300",
                    Rating = 4.5m
                },
                new Product
                {
                    Id = 2,
                    Title = "Wireless Mouse",
                    Description = "Ergonomic wireless mouse",
                    Price = 29.99m,
                    Stock = 200,
                    CategoryId = categories[0].Id,
                    ImageUrl = "https://via.placeholder.com/300",
                    Rating = 4.0m
                }
            };
            products.ForEach(p => context.Products.Add(p));
            context.SaveChanges();

            base.Seed(context);
        }
    }
}
```

Now, register this initializer. Add the following line to the `ApplicationDbContext` constructor in `Data/ApplicationDbContext.cs`:

```csharp
public ApplicationDbContext() : base("name=DefaultConnection")
{
    // This line registers the database initializer.
    Database.SetInitializer(new SafiStoreDbInitializer());
    this.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
}
```

### Step 2: Create the Database using EF6 Migrations

This is a critical new step.

1.  **Enable Migrations**: In the **Package Manager Console**, run:
    ```powershell
    Enable-Migrations
    ```
    This will create a `Migrations` folder and a `Configuration.cs` file.

2.  **Create Initial Migration**: In the console, run:
    ```powershell
    Add-Migration InitialCreate
    ```
    This creates a migration file based on your domain models.

3.  **Apply Migration to Create Database**: In the console, run:
    ```powershell
    Update-Database
    ```
    This command executes the migration, creates the `SafiStoreDb-Revised` database, and runs the `Seed` method to populate it with initial data.

Your database is now set up correctly.

---

## **PHASE 3: Implementing Services with AutoMapper**

To reduce repetitive code, we will use AutoMapper to map between your `Domain` models and `DTOs`.

### Step 1: Create AutoMapper Configuration

Create a new file `App_Start/AutoMapperConfig.cs`:

```csharp
using AutoMapper;
using SafiStore.Api.Models.Domain;
using SafiStore.Api.Models.DTOs;

public class AutoMapperConfig
{
    public static void Initialize()
    {
        Mapper.Initialize(cfg =>
        {
            // Maps Product domain model to ProductDto
            cfg.CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            // Add other mappings here
            cfg.CreateMap<Category, CategoryDto>();
            cfg.CreateMap<CartItem, CartItemDto>();
            // ... etc.
        });
    }
}
```

### Step 2: Use AutoMapper in Your Services

Now, refactor your services to use AutoMapper. First, inject `IMapper` into your service, then use `_mapper.Map()` to perform conversions.

Example in `ProductService.cs`:

```csharp
// Services/ProductService.cs
using AutoMapper; // Add this
using System.Collections.Generic;
using System.Threading.Tasks;
// ... other usings

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper; // Add this

    // Inject IMapper via the constructor
    public ProductService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper; // Add this
    }

    // Refactor methods to use AutoMapper
    public async Task<ProductDto> GetProductByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        // Use AutoMapper to map the result
        return _mapper.Map<ProductDto>(product);
    }

    // No longer need the manual MapToDto helper method.
}
```

Remember to update `UnityConfig.cs` to inject `IMapper`. **(See Appendix for the updated `UnityConfig.cs` code).**

---

## **PHASE 4: Controllers & Global Error Handling**

To avoid exposing stack traces in production, we will implement a global exception handler.

### Step 1: Create a Global Exception Handler

Create a new file `App_Start/GlobalExceptionHandler.cs`.

```csharp
using System.Net;
using System.Net.Http;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Results;

public class GlobalExceptionHandler : ExceptionHandler
{
    public override void Handle(ExceptionHandlerContext context)
    {
        // Log the exception here (e.g., using NLog, Serilog, etc.)
        // For now, we'll write to debug output
        System.Diagnostics.Debug.WriteLine(context.Exception);

        var response = new
        {
            Success = false,
            Message = "An unexpected error occurred. Please try again later.",
            // In development, you might want to include more detail:
            // Error = context.Exception.Message
        };

        context.Result = new ResponseMessageResult(
            context.Request.CreateResponse(HttpStatusCode.InternalServerError, response)
        );
    }
}
```

### Step 2: Register the Handler

Register this handler in `WebApiConfig.cs`. **(See Appendix for the updated `WebApiConfig.cs` code).**

---

## **PHASE 5: Authentication with OWIN**

This phase adds the critical authentication pipeline using OWIN, which was missing before.

### Step 1: Create the OWIN `Startup.cs` File

In the root of your project, add a new **OWIN Startup Class** file and name it `Startup.cs`.

```csharp
using Microsoft.Owin;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security;
using Owin;
using System.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// This attribute identifies the startup class for OWIN.
[assembly: OwinStartup(typeof(SafiStore.Api.Startup))]
namespace SafiStore.Api
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Configure JWT Bearer Token Authentication
            var issuer = ConfigurationManager.AppSettings["Jwt:Issuer"];
            var audience = ConfigurationManager.AppSettings["Jwt:Audience"];
            var secret = ConfigurationManager.AppSettings["Jwt:Secret"];

            app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions
                {
                    AuthenticationMode = AuthenticationMode.Active,
                    TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = issuer,
                        ValidAudience = audience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
                    }
                });
        }
    }
}
```

This code configures the OWIN pipeline to automatically validate JWT tokens on incoming requests that have the `[Authorize]` attribute.

### Step 2: Ensure Role Claims are Added to JWT

In your `JwtService` (or wherever you generate tokens), make sure you are adding the `role` claim.

```csharp
// Example in your token generation logic
var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Email, user.Email),
    new Claim(ClaimTypes.Role, user.Role) // This is crucial for [Authorize(Roles="...")]
};

// ... rest of token generation
```

---

## **PHASE 6: Running the Full Application**

Follow these steps to run the integrated application:

1.  **Create the Database**: If you haven't already, run `Update-Database` in the Package Manager Console.
2.  **Run the Backend**:
    *   Right-click your `SafiStore.Api` project in Visual Studio and select `Properties`.
    *   Go to the `Web` tab. Under `Servers`, select **Local IIS** and set the **Project Url** to `http://localhost:5000`. Click `Create Virtual Directory`.
    *   Press `Ctrl + F5` or the "Start" button to run the backend. A browser window should open, and you can navigate to `http://localhost:5000/swagger` to see the API documentation.
3.  **Run the Frontend**:
    *   Open a terminal in your Angular project's root directory.
    *   Run `npm install` to install dependencies.
    *   Run `ng serve` to start the development server.
    *   Open your browser to `http://localhost:4200`.

Your Angular app should now be successfully communicating with your .NET backend.

---

## **PHASE 7: Angular Frontend Integration**

The Angular setup from the previous guide is mostly correct. Ensure your `environment.ts` file points to the correct backend URL.

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api', // This must match your backend URL
  // ... rest of the configuration
};
```

---

## **Appendix: Full Code for Configuration Files**

### `App_Start/UnityConfig.cs`

```csharp
using AutoMapper;
using SafiStore.Api.Data;
using SafiStore.Api.Services;
using System.Web.Http;
using Unity;
using Unity.AspNet.WebApi;
using Unity.Injection;

public static class UnityConfig
{
    public static void RegisterComponents()
    {
        var container = new UnityContainer();

        // Register DbContext to have one instance per request
        container.RegisterType<ApplicationDbContext>(new PerRequestLifetimeManager());

        // Register AutoMapper instance
        var mapperConfig = new MapperConfiguration(cfg => {
            cfg.CreateMap<Product, ProductDto>()
               .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));
            cfg.CreateMap<Category, CategoryDto>();
            // Add all other mappings here
        });
        IMapper mapper = mapperConfig.CreateMapper();
        container.RegisterInstance(mapper);

        // Register Services
        container.RegisterType<IProductService, ProductService>();
        container.RegisterType<ICartService, CartService>();
        container.RegisterType<IAuthService, AuthService>();
        // ... register other services

        GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
    }
}
```

### `App_Start/WebApiConfig.cs`

```csharp
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.ExceptionHandling;

public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        // 1. Configure CORS
        var cors = new EnableCorsAttribute(
            origins: "http://localhost:4200", // Angular app URL
            headers: "*",
            methods: "*"
        );
        config.EnableCors(cors);

        // 2. Configure Web API routes
        config.MapHttpAttributeRoutes();

        config.Routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
        );

        // 3. Remove XML formatter, use JSON by default
        var formatters = GlobalConfiguration.Configuration.Formatters;
        formatters.Remove(formatters.XmlFormatter);

        // 4. Register Global Exception Handler
        config.Services.Replace(typeof(IExceptionHandler), new GlobalExceptionHandler());
    }
}
```

### `App_Start/SwaggerConfig.cs`

```csharp
using Swashbuckle.Application;
using System.Web.Http;

public class SwaggerConfig
{
    public static void Register()
    {
        var thisAssembly = typeof(SwaggerConfig).Assembly;

        GlobalConfiguration.Configuration
            .EnableSwagger(c =>
            {
                c.SingleApiVersion("v1", "SafiStore.Api");
                c.IncludeXmlComments(GetXmlCommentsPath());
            })
            .EnableSwaggerUi(c =>
            {
                // UI configuration
            });
    }

    protected static string GetXmlCommentsPath()
    {
        return System.String.Format(@"{0}\bin\SafiStore.Api.XML", System.AppDomain.CurrentDomain.BaseDirectory);
    }
}
```
*Note: To generate the XML documentation file, go to your project's Properties > Build tab, and check "XML documentation file".*