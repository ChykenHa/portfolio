from pathlib import Path
import subprocess
import sys

BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR / "dist"
REPO_NAME = "portfolio"
USERNAME = "ChykenHa"
REMOTE_URL = f"https://github.com/{USERNAME}/{REPO_NAME}.git"

print(f"Deploying to: {REMOTE_URL}")


def run_cmd(args, cwd=None):
    print(f"Running: {' '.join(args)} in {cwd or BASE_DIR}")
    res = subprocess.run(args, cwd=str(cwd or BASE_DIR), stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"Error: {res.stderr.strip()}")
        return False, res.stderr
    if res.stdout.strip():
        print(res.stdout.strip())
    return True, res.stdout


# --- PHASE 1: Push ASP.NET Core source to main branch ---
print("\n--- Phase 1: Uploading C# Source Code to 'main' branch ---")
if not (BASE_DIR / ".git").exists():
    run_cmd(["git", "init"])

has_main, _ = run_cmd(["git", "rev-parse", "--verify", "main"])
if has_main:
    run_cmd(["git", "checkout", "main"])
else:
    run_cmd(["git", "checkout", "-b", "main"])

run_cmd(["git", "add", "."])
status_main = subprocess.run(["git", "status", "--porcelain"], cwd=str(BASE_DIR), stdout=subprocess.PIPE, text=True)
if status_main.stdout.strip():
    run_cmd(["git", "commit", "-m", "Update portfolio with latest CV and redesigned UX/UI"])
else:
    print("No changes to commit on main.")

run_cmd(["git", "remote", "remove", "origin"])
run_cmd(["git", "remote", "add", "origin", REMOTE_URL])

success, _ = run_cmd(["git", "push", "-u", "origin", "main"])
if not success:
    print("Warning: Push to main branch failed or required credential input. Trying static site push...")

# --- PHASE 2: Push static site to gh-pages branch ---
print("\n--- Phase 2: Deploying Static Site to 'gh-pages' branch ---")
if not DIST_DIR.exists():
    print("Error: dist/ folder does not exist! Please run export_static.py first.")
    sys.exit(1)

if not (DIST_DIR / ".git").exists():
    run_cmd(["git", "init"], cwd=DIST_DIR)
    run_cmd(["git", "checkout", "-b", "gh-pages"], cwd=DIST_DIR)
    run_cmd(["git", "remote", "add", "origin", REMOTE_URL], cwd=DIST_DIR)
else:
    run_cmd(["git", "remote", "remove", "origin"], cwd=DIST_DIR)
    run_cmd(["git", "remote", "add", "origin", REMOTE_URL], cwd=DIST_DIR)

run_cmd(["git", "add", "-A"], cwd=DIST_DIR)
status_res = subprocess.run(["git", "status", "--porcelain"], cwd=str(DIST_DIR), stdout=subprocess.PIPE, text=True)
if status_res.stdout.strip():
    run_cmd(["git", "commit", "-m", "Deploy updated portfolio static site to GitHub Pages"], cwd=DIST_DIR)
else:
    print("No changes to commit in dist/.")

success, err = run_cmd(["git", "push", "-f", "origin", "gh-pages"], cwd=DIST_DIR)
if success:
    print("\n=============================================")
    print("DEPLOYMENT COMPLETED SUCCESSFULLY!")
    print(f"Repository: {REMOTE_URL}")
    print(f"Live URL:   https://{USERNAME}.github.io/{REPO_NAME}/")
    print("=============================================")
else:
    print(f"\nDeployment failed: {err}")
