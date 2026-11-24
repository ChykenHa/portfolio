from pathlib import Path
import re
import shutil
import stat
import subprocess
import sys
import time
import urllib.request

BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR / "dist"
WWWROOT_DIR = BASE_DIR / "wwwroot"
PORT = 5055
URL = f"http://127.0.0.1:{PORT}/"

print("Starting static export from ASP.NET Core Razor Pages...")

cmd = ["dotnet", "run", "--no-launch-profile", "--urls", URL]
print(f"Executing: {' '.join(cmd)}")
process = subprocess.Popen(
    cmd,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    cwd=str(BASE_DIR),
)

server_started = False
start_time = time.time()
while time.time() - start_time < 30:
    line = process.stdout.readline() if process.stdout else ""
    if not line:
        if process.poll() is not None:
            break
        time.sleep(0.2)
        continue
    print(f"[dotnet] {line.strip()}")
    if "Now listening on:" in line or f"127.0.0.1:{PORT}" in line:
        server_started = True
        break

if not server_started:
    print("Waiting briefly for server readiness...")
    time.sleep(2)

html_content = ""
try:
    print(f"Fetching {URL}...")
    with urllib.request.urlopen(URL, timeout=10) as response:
        html_content = response.read().decode("utf-8")
    print("HTML fetched successfully.")
except Exception as exc:
    print(f"Error fetching page: {exc}")
finally:
    print("Stopping ASP.NET Core server...")
    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()

if not html_content:
    print("Failed to fetch HTML content. Aborting.")
    sys.exit(1)

# Strip .NET 10 static web assets fingerprints and normalize leading slashes
# so GitHub Pages subpath (/portfolio/) resolves every asset reliably.
processed_html = html_content
replacements = [
    (r'(?:/?css/portfolio)(?:\.[a-zA-Z0-9_-]+)?\.css(?:\?v=[^"\'\s>]+)?', "css/portfolio.css?v=2.0.0"),
    (r'(?:/?js/portfolio)(?:\.[a-zA-Z0-9_-]+)?\.js(?:\?v=[^"\'\s>]+)?', "js/portfolio.js?v=2.0.0"),
    (r'(?:/?images/avatar)(?:\.[a-zA-Z0-9_-]+)?\.jpg(?:\?v=[^"\'\s>]+)?', "images/avatar.jpg"),
    (r'(?:/?favicon)(?:\.[a-zA-Z0-9_-]+)?\.ico(?:\?v=[^"\'\s>]+)?', "favicon.ico"),
    (r'(?:/?Le-Phung-Ha-CV)(?:\.[a-zA-Z0-9_-]+)?\.pdf(?:\?v=[^"\'\s>]+)?', "Le-Phung-Ha-CV.pdf"),
]
for pattern, target in replacements:
    processed_html = re.sub(pattern, target, processed_html)

# Clean dist/ while preserving dist/.git if present
if DIST_DIR.exists():
    for path in sorted(DIST_DIR.rglob("*"), reverse=True):
        if ".git" in path.parts:
            continue
        try:
            path.chmod(stat.S_IWRITE)
            if path.is_file() or path.is_symlink():
                path.unlink()
            elif path.is_dir():
                path.rmdir()
        except Exception as exc:
            print(f"Warning removing {path}: {exc}")

(DIST_DIR / "css").mkdir(parents=True, exist_ok=True)
(DIST_DIR / "js").mkdir(parents=True, exist_ok=True)
(DIST_DIR / "images").mkdir(parents=True, exist_ok=True)

assets = [
    (WWWROOT_DIR / "css" / "portfolio.css", DIST_DIR / "css" / "portfolio.css"),
    (WWWROOT_DIR / "js" / "portfolio.js", DIST_DIR / "js" / "portfolio.js"),
    (WWWROOT_DIR / "images" / "avatar.jpg", DIST_DIR / "images" / "avatar.jpg"),
    (WWWROOT_DIR / "favicon.ico", DIST_DIR / "favicon.ico"),
    (WWWROOT_DIR / "Le-Phung-Ha-CV.pdf", DIST_DIR / "Le-Phung-Ha-CV.pdf"),
]
for src, dst in assets:
    if not src.exists():
        print(f"ERROR: Missing required asset {src}")
        sys.exit(1)
    shutil.copy2(src, dst)

(DIST_DIR / ".nojekyll").write_text("", encoding="utf-8")
(DIST_DIR / "index.html").write_text(processed_html, encoding="utf-8")

# Self-check exported HTML & files
assert (DIST_DIR / "index.html").exists()
assert (DIST_DIR / "css" / "portfolio.css").exists()
assert (DIST_DIR / "js" / "portfolio.js").exists()
assert (DIST_DIR / "images" / "avatar.jpg").exists()
assert (DIST_DIR / "favicon.ico").exists()
assert (DIST_DIR / "Le-Phung-Ha-CV.pdf").exists()
assert 'href="css/portfolio.css?v=2.0.0"' in processed_html, "CSS path normalization failed"
assert 'src="js/portfolio.js?v=2.0.0"' in processed_html, "JS path normalization failed"
assert 'src="images/avatar.jpg"' in processed_html, "Avatar path normalization failed"
assert 'href="Le-Phung-Ha-CV.pdf"' in processed_html, "CV PDF path normalization failed"
assert "Le-Phung-Ha-TopCV" not in processed_html, "Old CV PDF reference still present!"

print(f"\nStatic export completed and verified at: {DIST_DIR}")
