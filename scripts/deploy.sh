#!/bin/bash
# Deploy script for Pulse & Heritage
# - Pushes full repo (project files, plans, CLAUDE.md) to Gitea
# - Pushes website code only (no project files) to GitHub for DigitalOcean deployment

set -e

echo "Deploying Pulse & Heritage..."

# Push everything to Gitea (primary source control)
echo "Pushing to Gitea (full repo)..."
git push origin main

# Create temporary branch without project files for GitHub
echo "Preparing GitHub deployment (website only)..."
CURRENT_BRANCH=$(git branch --show-current)
TEMP_BRANCH="github-deploy-$(date +%s)"

git checkout -b "$TEMP_BRANCH" --quiet
git rm -r --cached plans/ --quiet 2>/dev/null || true
git rm --cached CLAUDE.md --quiet 2>/dev/null || true
git rm -r --cached .claude/ --quiet 2>/dev/null || true
git commit -m "Deploy: website code only" --quiet 2>/dev/null || true

echo "Pushing to GitHub (website only)..."
git push github "$TEMP_BRANCH":main --force --quiet

git checkout "$CURRENT_BRANCH" --force --quiet
git branch -D "$TEMP_BRANCH" --quiet

echo "Deploy complete!"
echo "  Gitea:  full repo with project files"
echo "  GitHub: website code only (triggers DigitalOcean deploy)"
