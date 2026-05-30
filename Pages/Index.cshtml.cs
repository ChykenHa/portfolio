using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;

namespace Portfolio.Pages;

public class IndexModel : PageModel
{
    public List<Project> Projects { get; set; } = new();
    
    // MindConnect Research Project (Highlighted)
    public ResearchProject MindConnect { get; set; } = null!;

    public void OnGet()
    {
        // Load MindConnect Research in English
        MindConnect = new ResearchProject
        {
            Name = "MindConnect – Depression Detection Social Network",
            Description = "A pioneering social network applying Vietnamese NLP models and LLMs to detect early depression signs from user behavior and content, integrated with an AI mental health companion.",
            Role = "Independent Researcher & Developer",
            Award = "🥉 3rd Prize - Student Research Symposium on IT 2026",
            GithubUrl = "https://github.com/ChykenHa/Depression-Detection-Social-Network",
            DemoUrl = "https://depression-detection-social-network.onrender.com/",
            TechTags = new List<string> { "ASP.NET Core", "React Native", "Python (NLP)", "SQL Server", "OpenAI & Gemini" }
        };

        // Load other projects in English
        Projects = new List<Project>
        {
            new Project
            {
                Name = "Student Progress Management System",
                Description = "A comprehensive academic tracking system featuring layered architecture, role-based authorization (Admin, Lecturer, Student), and dashboard metrics.",
                Role = "Team Leader & Lead Backend",
                Category = "web",
                GithubUrl = "https://github.com/ChykenHa/QuanLyTienDoSinhVien",
                VisualClass = "bg-gradient-1",
                IconClass = "fa-solid fa-users-gear",
                TechTags = new List<string> { "ASP.NET Core", "EF Core", "SQL Server", "Razor Pages" }
            },
            new Project
            {
                Name = "E-commerce Website",
                Description = "Full-featured online shopping platform containing product catalogs, shopping cart logic, order processing, and administrative dashboards.",
                Role = "Fullstack Developer",
                Category = "web",
                GithubUrl = "https://github.com/ChykenHa/Ecommerce",
                VisualClass = "bg-gradient-2",
                IconClass = "fa-solid fa-cart-shopping",
                TechTags = new List<string> { "ASP.NET Core", "SQL Server", "Bootstrap", "JavaScript" }
            },
            new Project
            {
                Name = "Movie Android Application",
                Description = "Sleek movie discovery application leveraging TMDB API, structured under clean MVVM architecture, built with Java/Kotlin in Android Studio.",
                Role = "Mobile Developer",
                Category = "mobile",
                GithubUrl = "https://github.com/ChykenHa/MyAndroidAPP",
                VisualClass = "bg-gradient-3",
                IconClass = "fa-solid fa-mobile-screen-button",
                TechTags = new List<string> { "Java / Kotlin", "Android Studio", "Retrofit", "MVVM" }
            },
            new Project
            {
                Name = "Hotel Management System",
                Description = "A C# WinForms desktop software for hotel logistics, booking scheduling, invoice generation, and human resource tracking.",
                Role = "Windows Developer",
                Category = "other",
                GithubUrl = "https://github.com/ChykenHa/Hotel_Management",
                VisualClass = "bg-gradient-4",
                IconClass = "fa-solid fa-hotel",
                TechTags = new List<string> { "C#", ".NET WinForms", "SQL Server" }
            },
            new Project
            {
                Name = "Charging Station Management UI",
                Description = "Dynamic dashboard for smart electric vehicle charging stations, visualizing real-time operations, power statistics, and status alerts.",
                Role = "Frontend Developer",
                Category = "other",
                GithubUrl = "https://github.com/ChykenHa/charging-station",
                VisualClass = "bg-gradient-5",
                IconClass = "fa-solid fa-charging-station",
                TechTags = new List<string> { "HTML5", "CSS3", "JavaScript" }
            },
            new Project
            {
                Name = "Academic & CDIO3 Projects",
                Description = "Academic research repositories and CDIO projects focused on database optimizations, process mapping, and workflow automation.",
                Role = "Academic Research",
                Category = "web",
                GithubUrl = "https://github.com/ChykenHa/NCKH_SV",
                DemoUrl = "https://github.com/ChykenHa/CDIO3",
                VisualClass = "bg-gradient-6",
                IconClass = "fa-solid fa-flask",
                TechTags = new List<string> { "ASP.NET Core", "SQL Server", "EF Core" }
            }
        };
    }
}

public class Project
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string GithubUrl { get; set; } = string.Empty;
    public string DemoUrl { get; set; } = string.Empty;
    public string VisualClass { get; set; } = string.Empty;
    public string IconClass { get; set; } = string.Empty;
    public List<string> TechTags { get; set; } = new();
}

public class ResearchProject
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Award { get; set; } = string.Empty;
    public string GithubUrl { get; set; } = string.Empty;
    public string DemoUrl { get; set; } = string.Empty;
    public List<string> TechTags { get; set; } = new();
}
