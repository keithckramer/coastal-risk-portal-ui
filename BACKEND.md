# .NET Backend Implementation Guide

This document outlines the backend API requirements for the Coastal Risk Portal.

## Authentication Endpoints

### 1. POST /api/auth/login

**Purpose**: Authenticate user and issue JWT token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "optional-refresh-token",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["user", "admin"]
  },
  "expiresIn": 3600
}
```

**Error Response (401)**:
```json
{
  "message": "Invalid email or password"
}
```

### 2. POST /api/auth/logout

**Purpose**: Invalidate current session

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response (200)**:
```json
{
  "message": "Logged out successfully"
}
```

### 3. POST /api/auth/refresh

**Purpose**: Refresh expired JWT token

**Request Body**:
```json
{
  "refreshToken": "refresh-token-string"
}
```

**Success Response (200)**:
```json
{
  "token": "new-jwt-token"
}
```

### 4. GET /api/auth/me

**Purpose**: Get current authenticated user profile

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response (200)**:
```json
{
  "id": "1",
  "email": "user@example.com",
  "name": "John Doe",
  "roles": ["user", "admin"]
}
```

## .NET Core Implementation Example

### 1. Install Required NuGet Packages

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package BCrypt.Net-Next
```

### 2. Create Models

**LoginRequest.cs**:
```csharp
namespace CoastalRiskPortal.API.Models.Auth
{
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
```

**AuthResponse.cs**:
```csharp
namespace CoastalRiskPortal.API.Models.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string? RefreshToken { get; set; }
        public UserDto User { get; set; } = new();
        public int ExpiresIn { get; set; }
    }

    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new();
    }
}
```

### 3. JWT Service

**JwtService.cs**:
```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace CoastalRiskPortal.API.Services
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(string userId, string email, List<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Email, email),
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Add role claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"))
            );

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
```

### 4. Authentication Controller

**AuthController.cs**:
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CoastalRiskPortal.API.Models.Auth;
using CoastalRiskPortal.API.Services;

namespace CoastalRiskPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(JwtService jwtService, ILogger<AuthController> logger)
        {
            _jwtService = jwtService;
            _logger = logger;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // TODO: Validate against database
            // For demo purposes, accepting demo credentials
            if (request.Email == "demo@amcoastal.com" && request.Password == "demo123")
            {
                var user = new UserDto
                {
                    Id = "1",
                    Email = request.Email,
                    Name = "Demo User",
                    Roles = new List<string> { "user", "viewer" }
                };

                var token = _jwtService.GenerateToken(user.Id, user.Email, user.Roles);

                var response = new AuthResponse
                {
                    Token = token,
                    User = user,
                    ExpiresIn = 3600
                };

                return Ok(response);
            }

            return Unauthorized(new { message = "Invalid email or password" });
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // Token invalidation logic here (e.g., add to blacklist)
            _logger.LogInformation("User logged out");
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

            var user = new UserDto
            {
                Id = userId ?? "",
                Email = email ?? "",
                Name = "Current User",
                Roles = roles
            };

            return Ok(user);
        }
    }
}
```

### 5. Configure JWT in Program.cs

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CoastalRiskPortal.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register JWT Service
builder.Services.AddScoped<JwtService>();

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException())
            )
        };
    });

builder.Services.AddAuthorization();

// Configure CORS for React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite dev server
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

### 6. Add to appsettings.json

```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong123456",
    "Issuer": "CoastalRiskPortal",
    "Audience": "CoastalRiskPortalUsers"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

## Testing the API

### Using cURL:

```bash
# Login
curl -X POST https://localhost:7246/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@amcoastal.com","password":"demo123"}'

# Get current user
curl -X GET https://localhost:7246/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Logout
curl -X POST https://localhost:7246/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Next Steps

1. Implement actual database user lookup (Entity Framework)
2. Add password hashing with BCrypt
3. Implement refresh token rotation
4. Add token blacklisting for logout
5. Integrate with Azure AD for SSO
6. Add rate limiting to prevent brute force attacks
7. Implement password reset functionality
8. Add email verification
