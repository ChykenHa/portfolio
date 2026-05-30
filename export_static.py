import subprocess
import time
import urllib.request
import os
import shutil
import re
import sys

print("Starting export script with version-stripping enabled...")

# 1. Start the ASP.NET Core app in background
cmd = ["dotnet", "run", "--no-launch-profile", "--urls", "http://localhost:5000"]
print(f"Executing: {' '.join(cmd)}")
process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, cwd="d:\\Portfolio")

# Wait and monitor output
url = "http://localhost:5000/"
server_started = False

print("Waiting for server to report listening status...")
start_time = time.time()
while time.time() - start_time < 15:
    line = process.stdout.readline()
    if not line:
        break
    print(f"[Dotnet] {line.strip()}")
    if "Now listening on:" in line or "http://localhost:5000" in line:
        server_started = True
        print("Server is listening!")
        break

if not server_started:
    print("Warning: Did not catch 'Now listening on' message. Waiting 3 seconds...")
    time.sleep(3)

html_content = ""
try:
    print(f"Fetching {url}...")
    with urllib.request.urlopen(url, timeout=5) as response:
        html_content = response.read().decode("utf-8")
    print("Page fetched successfully!")
except Exception as e:
    print(f"Error fetching page: {e}")
finally:
    print("Stopping ASP.NET Core server...")
    process.terminate()
    try:
        process.wait(timeout=3)
    except subprocess.TimeoutExpired:
        process.kill()

if not html_content:
    print("Failed to get HTML content. Aborting.")
    sys.exit(1)

# 4. Strip .NET 10 static web assets version fingerprints from paths
processed_html = html_content

# We want to replace `/css/portfolio.[hash].css` with `css/portfolio.css`
processed_html = re.sub(r'href="/css/portfolio\.[a-zA-Z0-9]+\.css"', 'href="css/portfolio.css"', processed_html)
processed_html = re.sub(r'src="/js/portfolio\.[a-zA-Z0-9]+\.js"', 'src="js/portfolio.js"', processed_html)
processed_html = re.sub(r'src="/images/avatar\.[a-zA-Z0-9]+\.jpg"', 'src="images/avatar.jpg"', processed_html)

# Handle cases where quotes or formatting differs:
processed_html = re.sub(r'/css/portfolio\.[a-zA-Z0-9]+\.css', 'css/portfolio.css', processed_html)
processed_html = re.sub(r'/js/portfolio\.[a-zA-Z0-9]+\.js', 'js/portfolio.js', processed_html)
processed_html = re.sub(r'/images/avatar\.[a-zA-Z0-9]+\.jpg', 'images/avatar.jpg', processed_html)

# Handle the PDF CV which also might get fingerprinted
processed_html = re.sub(r'href="/Le-Phung-Ha-TopCV\.vn-250526\.75757\.[a-zA-Z0-9]+\.pdf"', 'href="Le-Phung-Ha-TopCV.vn-250526.75757.pdf"', processed_html)
processed_html = re.sub(r'/Le-Phung-Ha-TopCV\.vn-250526\.75757\.[a-zA-Z0-9]+\.pdf', 'Le-Phung-Ha-TopCV.vn-250526.75757.pdf', processed_html)

# Let's verify that the output has been cleaned
print("\nVerifying path cleaning in HTML:")
if "portfolio.ebee0xqh1s.css" in processed_html or "portfolio.buiolxt4hy.js" in processed_html:
    print("WARNING: Fingerprint hashes were not successfully cleaned!")
else:
    print("SUCCESS: Fingerprint hashes cleaned!")

# 5. Recreate dist folder structure
dist_dir = "d:\\Portfolio\\dist"
if os.path.exists(dist_dir):
    print(f"Cleaning existing {dist_dir} (preserving .git)...")
    import stat
    for root, dirs, files in os.walk(dist_dir, topdown=False):
        if '.git' in root.split(os.sep):
            continue
        for name in files:
            filepath = os.path.join(root, name)
            try:
                os.chmod(filepath, stat.S_IWRITE)
                os.remove(filepath)
            except Exception as e:
                print(f"Error removing file {filepath}: {e}")
        for name in dirs:
            if name == '.git':
                continue
            dirpath = os.path.join(root, name)
            try:
                os.chmod(dirpath, stat.S_IWRITE)
                os.rmdir(dirpath)
            except Exception as e:
                print(f"Error removing dir {dirpath}: {e}")

os.makedirs(dist_dir, exist_ok=True)
os.makedirs(os.path.join(dist_dir, "css"), exist_ok=True)
os.makedirs(os.path.join(dist_dir, "js"), exist_ok=True)
os.makedirs(os.path.join(dist_dir, "images"), exist_ok=True)

# 6. Copy static files to dist/
print("Copying static assets to dist/...")
shutil.copy("wwwroot/css/portfolio.css", os.path.join(dist_dir, "css", "portfolio.css"))
shutil.copy("wwwroot/js/portfolio.js", os.path.join(dist_dir, "js", "portfolio.js"))
shutil.copy("wwwroot/images/avatar.jpg", os.path.join(dist_dir, "images", "avatar.jpg"))
shutil.copy("wwwroot/Le-Phung-Ha-TopCV.vn-250526.75757.pdf", os.path.join(dist_dir, "Le-Phung-Ha-TopCV.vn-250526.75757.pdf"))

# 7. Write index.html
with open(os.path.join(dist_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(processed_html)

print("\nStatic export completed successfully!")
print(f"Static files are available at: {dist_dir}")
