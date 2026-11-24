using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;

namespace Portfolio.Pages;

public class IndexModel : PageModel
{
    public ProfileInfo Profile { get; set; } = new();
    public List<HeroStat> HeroStats { get; set; } = new();
    public List<ExperienceItem> Experiences { get; set; } = new();
    public ResearchProject MindConnect { get; set; } = new();
    public List<ProjectItem> Projects { get; set; } = new();
    public List<SkillGroup> SkillGroups { get; set; } = new();
    public List<SoftSkillItem> SoftSkills { get; set; } = new();
    public List<CredentialItem> Certifications { get; set; } = new();
    public CredentialItem Award { get; set; } = new("", "", "");
    public string ProjectsJson { get; set; } = "[]";

    public void OnGet()
    {
        Profile = new ProfileInfo
        {
            FullName = "Le Phung Ha",
            Title = "Software Developer Fresher",
            Subtitle = "Aspiring C# & ASP.NET Core Backend Developer",
            Objective = "Aspiring C# Developer seeking a Software Developer / Internship position specializing in ASP.NET Core, database systems, and scalable backend architectures.",
            Location = "Hoa Khanh Nam, Da Nang, Vietnam",
            Phone = "034 737 2061",
            PhoneHref = "tel:0347372061",
            Email = "lephungha1203@gmail.com",
            GithubHandle = "ChykenHa",
            GithubUrl = "https://github.com/ChykenHa",
            LinkedInUrl = "https://www.linkedin.com/in/h%C3%A0-l%C3%AA-ph%C3%B9ng-24110137b/",
            PortfolioUrl = "https://chykenha.github.io/portfolio/",
            CvFileName = "Le-Phung-Ha-CV.pdf",
            University = "Duy Tan University",
            EducationPeriod = "2023 – 2027",
            Major = "Software Engineer",
            Gpa = "3.27 / 4.0"
        };

        HeroStats = new List<HeroStat>
        {
            new("2", "Tech Internships", "Samsung R&D · Wisdom Brain"),
            new("3.27", "University GPA", "Out of 4.0 · DTU 2023–2027"),
            new("3rd", "Research Award", "IT Symposium 2026"),
            new("6.5", "IELTS Band", "+ TOEIC Certified 2026")
        };

        Experiences = new List<ExperienceItem>
        {
            new ExperienceItem
            {
                Company = "Samsung R&D Center Vietnam",
                Role = "Software Engineer Intern",
                Period = "08/2026 – 09/2026",
                CategoryTag = "Android & DSA",
                IconClass = "fa-solid fa-mobile-screen-button",
                TechTags = new List<string> { "Java", "Kotlin", "Android Studio", "Retrofit", "MVVM", "DSA" },
                Highlights = new List<string>
                {
                    "Solved advanced Data Structures & Algorithms (DSA) problems, optimizing time and space complexity.",
                    "Developed a native Android app with Java/Kotlin using MVVM architecture and Retrofit for API handling.",
                    "Participated in daily code reviews and resolved UI/performance bottlenecks in Android Studio."
                }
            },
            new ExperienceItem
            {
                Company = "Wisdom Brain",
                Role = "DevOps Engineer Intern",
                Period = "02/2026 – 06/2026",
                CategoryTag = "Cloud & Observability",
                IconClass = "fa-solid fa-server",
                TechTags = new List<string> { "Docker", "Kubernetes", "Prometheus", "Grafana", "Microservices" },
                Highlights = new List<string>
                {
                    "Containerized microservices applications using Docker to ensure consistent runtime environments across stages.",
                    "Deployed, managed, and monitored application workloads on a local Kubernetes cluster.",
                    "Configured Prometheus and Grafana dashboards to track real-time resource utilization and system performance metrics."
                }
            }
        };

        MindConnect = new ResearchProject
        {
            Name = "MindConnect – Depression Detection Social Network",
            Period = "09/2025 – 05/2026",
            Event = "Annual Student Research Symposium on Information Technology",
            Role = "Independent Researcher & Developer",
            Award = "Third Student Project Award – Student Research Symposium on Information Technology (2026)",
            Description = "Cross-platform mental health social network combining Python NLP text classification, Google Gemini AI support, and smartwatch biometric tracking (PEWS) on a unified ASP.NET Core backend.",
            GithubUrl = "https://github.com/ChykenHa/Depression-Detection-Social-Network",
            TechTags = new List<string>
            {
                "ASP.NET Core", "Entity Framework Core", "PostgreSQL",
                "Razor Pages", "Python", "FastAPI", "React Native", "Google Gemini"
            },
            Pillars = new List<ResearchPillar>
            {
                new("fa-solid fa-layer-group", "Unified Cross-Platform Architecture", "ASP.NET Core + EF Core + PostgreSQL unified backend & RESTful APIs powering Razor Pages web and React Native (Android & iOS) apps with auth, posts, comments & real-time updates."),
                new("fa-solid fa-brain", "Python NLP & Sentiment Pipeline", "Trained Python ML/NLP models served via FastAPI for text classification, sentiment analysis, and early depression-pattern detection from user content."),
                new("fa-solid fa-sparkles", "Google Gemini AI Support", "Integrated Google Gemini services for contextual chatbot counseling and mental health guidance."),
                new("fa-solid fa-heart-pulse", "Smartwatch Biometrics → PEWS", "Tracks Hv (Heart Rate), St (Sleep Time), and Dv (Emotions) from smartwatch telemetry into PEWS risk monitoring.")
            }
        };

        Projects = new List<ProjectItem>
        {
            new ProjectItem
            {
                Id = "student-progress",
                Name = "Student Progress Management System",
                Period = "11/2025 – 02/2026",
                Role = "Technical Team Leader & Backend Developer",
                Category = "web",
                IsFeatured = true,
                IconClass = "fa-solid fa-users-gear",
                GithubUrl = "https://github.com/ChykenHa/QuanLyTienDoSinhVien",
                Summary = "Team-led academic management platform with layered architecture, role-based access control (Admin, Lecturer, Student), and progress analytics dashboards.",
                TechTags = new List<string> { "ASP.NET Core", "Entity Framework Core", "SQL Server", "Razor Pages" },
                Highlights = new List<string>
                {
                    "Led a team to develop a student academic management system.",
                    "Designed system architecture and assigned tasks to team members.",
                    "Developed core backend features using ASP.NET Core.",
                    "Implemented role-based authentication (Admin, Lecturer, Student).",
                    "Built dashboards and academic tracking functionalities.",
                    "Designed and managed database using SQL Server and Entity Framework Core while reviewing code quality."
                }
            },
            new ProjectItem
            {
                Id = "ecommerce-website",
                Name = "E-commerce Website",
                Period = "08/2025 – 10/2025",
                Role = "Fullstack Developer",
                Category = "web",
                IsFeatured = true,
                IconClass = "fa-solid fa-cart-shopping",
                GithubUrl = "https://github.com/ChykenHa/Ecommerce",
                Summary = "Full-stack online storefront implementing end-to-end product catalog management, shopping cart workflows, order processing, and admin controls.",
                TechTags = new List<string> { "ASP.NET", "SQL Server", "Entity Framework", "Bootstrap", "JavaScript" },
                Highlights = new List<string>
                {
                    "Built an online shopping website with core e-commerce functionalities.",
                    "Developed product management, shopping cart, and order processing workflows.",
                    "Integrated user authentication and admin management system.",
                    "Designed responsive UI using Bootstrap and JavaScript.",
                    "Managed database operations with SQL Server and Entity Framework ORM."
                }
            },
            new ProjectItem
            {
                Id = "movie-android",
                Name = "Movie Android Application",
                Period = "GitHub Showcase",
                Role = "Mobile Developer",
                Category = "mobile",
                IsFeatured = false,
                IconClass = "fa-solid fa-film",
                GithubUrl = "https://github.com/ChykenHa/MyAndroidAPP",
                Summary = "Native Android movie discovery app built in Android Studio using MVVM architecture, Retrofit networking, and clean reactive state handling.",
                TechTags = new List<string> { "Java", "Kotlin", "Android Studio", "Retrofit", "MVVM" },
                Highlights = new List<string>
                {
                    "Implemented movie listing, search, and detailed information display.",
                    "Structured codebase with clean MVVM architecture and LiveData/ViewModel.",
                    "Integrated REST APIs via Retrofit for fetching movie data."
                }
            },
            new ProjectItem
            {
                Id = "hotel-management",
                Name = "Hotel Management System",
                Period = "GitHub Showcase",
                Role = "Windows Developer",
                Category = "desktop",
                IsFeatured = false,
                IconClass = "fa-solid fa-hotel",
                GithubUrl = "https://github.com/ChykenHa/Hotel_Management",
                Summary = "C# WinForms desktop application for hotel operations, room booking schedules, billing/invoices, and staff management backed by SQL Server.",
                TechTags = new List<string> { "C#", ".NET WinForms", "SQL Server" },
                Highlights = new List<string>
                {
                    "Built room availability and booking scheduling workflows.",
                    "Automated invoice generation and customer billing tracking.",
                    "Persisted operational and staff records in SQL Server."
                }
            },
            new ProjectItem
            {
                Id = "charging-station",
                Name = "Charging Station Management UI",
                Period = "GitHub Showcase",
                Role = "Frontend Developer",
                Category = "desktop",
                IsFeatured = false,
                IconClass = "fa-solid fa-charging-station",
                GithubUrl = "https://github.com/ChykenHa/charging-station",
                Summary = "Interactive monitoring dashboard UI for smart EV charging stations featuring real-time status cards, power usage views, and alert indicators.",
                TechTags = new List<string> { "HTML5", "CSS3", "JavaScript" },
                Highlights = new List<string>
                {
                    "Designed responsive dashboard layout for EV station monitoring.",
                    "Visualized station availability, power output statistics, and status alerts."
                }
            }
        };

        SkillGroups = new List<SkillGroup>
        {
            new SkillGroup
            {
                Title = "Programming Languages",
                IconClass = "fa-solid fa-code",
                Items = new List<SkillBadge>
                {
                    new("C#", true),
                    new("Java", true),
                    new("SQL", true),
                    new("Kotlin", false),
                    new("Python", false),
                    new("JavaScript", false)
                }
            },
            new SkillGroup
            {
                Title = "Frameworks & Platforms",
                IconClass = "fa-solid fa-layer-group",
                Items = new List<SkillBadge>
                {
                    new("ASP.NET Core", true),
                    new("Entity Framework Core", true),
                    new("Razor Pages", false),
                    new("FastAPI", false),
                    new("React Native", false),
                    new("Bootstrap", false)
                }
            },
            new SkillGroup
            {
                Title = "Databases",
                IconClass = "fa-solid fa-database",
                Items = new List<SkillBadge>
                {
                    new("SQL Server", true),
                    new("MongoDB", true),
                    new("PostgreSQL", false)
                }
            },
            new SkillGroup
            {
                Title = "DevOps, Mobile & Tools",
                IconClass = "fa-solid fa-sliders",
                Items = new List<SkillBadge>
                {
                    new("Git", true),
                    new("Docker", true),
                    new("Visual Studio", true),
                    new("Kubernetes", false),
                    new("Prometheus", false),
                    new("Grafana", false),
                    new("Android Studio", false),
                    new("Retrofit", false),
                    new("MVVM", false)
                }
            }
        };

        SoftSkills = new List<SoftSkillItem>
        {
            new("fa-solid fa-people-group", "Teamwork", "Technical team leadership, task delegation, and daily code reviews across university & Samsung R&D projects."),
            new("fa-solid fa-lightbulb", "Problem-solving", "Algorithmic optimization (DSA), UI/performance bottleneck resolution, and end-to-end system debugging."),
            new("fa-solid fa-clock", "Time management", "Delivering two industry internships, an award-winning research project, and a 3.27 GPA in parallel.")
        };

        Certifications = new List<CredentialItem>
        {
            new("IELTS – Band 6.5", "2023", "English Proficiency"),
            new("TOEIC", "2026", "Business & Technical English")
        };

        Award = new CredentialItem(
            "Third Student Project Award – Student Research Symposium on Information Technology",
            "2026",
            "MindConnect Research"
        );

        ProjectsJson = JsonSerializer.Serialize(Projects, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });
    }
}

public class ProfileInfo
{
    public string FullName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Objective { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string PhoneHref { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string GithubHandle { get; set; } = string.Empty;
    public string GithubUrl { get; set; } = string.Empty;
    public string LinkedInUrl { get; set; } = string.Empty;
    public string PortfolioUrl { get; set; } = string.Empty;
    public string CvFileName { get; set; } = string.Empty;
    public string University { get; set; } = string.Empty;
    public string EducationPeriod { get; set; } = string.Empty;
    public string Major { get; set; } = string.Empty;
    public string Gpa { get; set; } = string.Empty;
}

public record HeroStat(string Value, string Label, string Sub);

public class ExperienceItem
{
    public string Company { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public string CategoryTag { get; set; } = string.Empty;
    public string IconClass { get; set; } = string.Empty;
    public List<string> TechTags { get; set; } = new();
    public List<string> Highlights { get; set; } = new();
}

public class ResearchProject
{
    public string Name { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public string Event { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Award { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string GithubUrl { get; set; } = string.Empty;
    public List<string> TechTags { get; set; } = new();
    public List<ResearchPillar> Pillars { get; set; } = new();
}

public record ResearchPillar(string IconClass, string Title, string Description);

public class ProjectItem
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public string IconClass { get; set; } = string.Empty;
    public string GithubUrl { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public List<string> TechTags { get; set; } = new();
    public List<string> Highlights { get; set; } = new();
}

public class SkillGroup
{
    public string Title { get; set; } = string.Empty;
    public string IconClass { get; set; } = string.Empty;
    public List<SkillBadge> Items { get; set; } = new();
}

public record SkillBadge(string Name, bool IsCore);
public record SoftSkillItem(string IconClass, string Title, string Description);
public record CredentialItem(string Title, string Year, string Meta);
