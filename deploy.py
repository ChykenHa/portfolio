import subprocess
import os
import sys

repo_name = "portfolio" # default repo name
username = "ChykenHa"
remote_url = f"https://github.com/{username}/{repo_name}.git"

print(f"Deploying to: {remote_url}")

def run_cmd(args, cwd=None):
    print(f"Running: {' '.join(args)} in {cwd or 'current dir'}")
    res = subprocess.run(args, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"Error executing command: {res.stderr}")
        return False, res.stderr
    print(res.stdout)
    return True, res.stdout

# --- PHASE 1: Initialize root repo and push ASP.NET Core source to main branch ---
print("\n--- Phase 1: Uploading C# Source Code to 'main' branch ---")
if not os.path.exists(".git"):
    run_cmd(["git", "init"])

run_cmd(["git", "checkout", "-b", "main"])
run_cmd(["git", "add", "."])

# Create a clean gitignore so we don't upload build binaries (bin/, obj/)
gitignore_content = """
bin/
obj/
.vs/
*.user
_ReSharper.Caches/
"""
with open(".gitignore", "w") as f:
    f.write(gitignore_content.strip())
run_cmd(["git", "add", ".gitignore"])

run_cmd(["git", "commit", "-m", "Initial commit (ASP.NET Core Source)"])

# Add remote
run_cmd(["git", "remote", "remove", "origin"]) # clean if exists
run_cmd(["git", "remote", "add", "origin", remote_url])

# Push C# source to main branch
success, err = run_cmd(["git", "push", "-u", "origin", "main", "-f"])
if not success:
    print("Warning: Push to main branch failed or required credential input. We will try pushing the static site now.")

# --- PHASE 2: Initialize dist repo and push static files to gh-pages branch ---
print("\n--- Phase 2: Deploying Static Site to 'gh-pages' branch ---")
dist_dir = "d:\\Portfolio\\dist"

if not os.path.exists(dist_dir):
    print("Error: dist/ folder does not exist! Please run export_static.py first.")
    sys.exit(1)

# Init git inside dist/
dist_git = os.path.join(dist_dir, ".git")
if os.path.exists(dist_git):
    import shutil
    shutil.rmtree(dist_git) # Clean inner git if any

run_cmd(["git", "init"], cwd=dist_dir)
run_cmd(["git", "checkout", "-b", "gh-pages"], cwd=dist_dir)
run_cmd(["git", "add", "."], cwd=dist_dir)
run_cmd(["git", "commit", "-m", "Deploy portfolio static site to GitHub Pages"], cwd=dist_dir)
run_cmd(["git", "remote", "add", "origin", remote_url], cwd=dist_dir)

# Force push to gh-pages branch
success, err = run_cmd(["git", "push", "-f", "origin", "gh-pages"], cwd=dist_dir)

if success:
    print("\n=============================================")
    print("DEPLOYMENT COMPLETED SUCCESSFULLY!")
    print(f"Your project is uploaded to: {remote_url}")
    print(f"Your live website will be available shortly at:")
    print(f"https://{username}.github.io/{repo_name}/")
    print("=============================================")
else:
    print(f"\nDeployment failed: {err}")
    print("If you see a credential or permission error, it means Git could not authenticate automatically.")
