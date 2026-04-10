#!/usr/bin/env python3
"""Parse ideas.md + project folders and generate dashboard index.html."""

import json
import os
import re
import subprocess
from datetime import datetime, date
from pathlib import Path

IDEAS_FILE = os.path.expanduser("~/.claude/ideas.md")
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_JSON = os.path.join(SCRIPT_DIR, "dashboard-data.json")
OUTPUT_HTML = os.path.join(SCRIPT_DIR, "index.html")
TEMPLATE_HTML = os.path.join(SCRIPT_DIR, "template.html")
PROTOTYPES_DIR = Path(os.path.expanduser("~/prototypes"))

# ── Category mapping ─────────────────────────────────────────────
# Keys are substrings matched against project name (case-insensitive)
CATEGORIES = {
    # Pracovní
    "Figma MCP": "work",
    "Personas": "work",
    "Mentoring": "work",
    "Global sub-agenti": "work",
    "UX Enablement": "work",
    # Pracovní — AI learning
    "Custom slash": "ai-learning",
    "CLAUDE.md": "ai-learning",
    "AI Adoption": "ai-learning",
    "TTS": "ai-learning",
    "Image folder": "ai-learning",
    "Notion workspace": "ai-learning",
    "GH Pages": "ai-learning",
    # Osobní
    "Knihovna": "personal",
    "Dashboard": "personal",
}

# ── Priority projects ─────────────────────────────────────────────
# Substrings matched against project name (case-insensitive)
PRIORITY = ["GH Pages"]

# ── Enrichments ───────────────────────────────────────────────────
ENRICHMENTS = {
    "Knihovna": {
        "path": "~/.claude/books",
        "stats": lambda p: _count_csv_rows(p / "books.csv"),
    },
    "Global sub-agenti": {
        "path": "~/.claude/agents",
        "stats": lambda p: _count_files(p, "*.md"),
    },
    "Personas": {
        "path": "~/personas",
        "stats": lambda p: _count_files(p, "*.md"),
    },
    "Custom slash": {
        "path": "~/.claude/commands",
        "stats": lambda p: _count_files(p, "*.md"),
    },
}


def _count_csv_rows(filepath):
    try:
        with open(filepath) as f:
            return {"label": "knih v databázi", "value": sum(1 for _ in f) - 1}
    except FileNotFoundError:
        return None


def _count_files(dirpath, pattern):
    try:
        return {"label": "souborů", "value": len(list(dirpath.glob(pattern)))}
    except Exception:
        return None


def _git_last_date(path):
    """Get last commit date for a path inside prototypes repo."""
    try:
        out = subprocess.check_output(
            ["git", "log", "--format=%aI", "-1", "--", str(path)],
            cwd=str(PROTOTYPES_DIR),
            stderr=subprocess.DEVNULL,
        ).decode().strip()
        if out:
            return out[:10]  # YYYY-MM-DD
    except Exception:
        pass
    return None


def _categorize(name):
    for fragment, cat in CATEGORIES.items():
        if fragment.lower() in name.lower():
            return cat
    return "work"  # default


def parse_ideas(filepath):
    with open(filepath, encoding="utf-8") as f:
        content = f.read()

    projects = []
    blocks = re.split(r"^## ", content, flags=re.MULTILINE)[1:]

    for block in blocks:
        lines = block.strip().split("\n")
        name = lines[0].strip()
        data = {"name": name}

        for line in lines[1:]:
            line = line.strip()
            if line.startswith("- "):
                line = line[2:]
                if ": " in line:
                    key, val = line.split(": ", 1)
                    key = key.strip().lower()
                    val = val.strip()
                    field_map = {
                        "status": "status",
                        "přidáno": "added",
                        "poslední práce": "lastWork",
                        "umístění": "location",
                        "odhad náročnosti": "estimate",
                        "stráveno": "spent",
                        "long goal": "longGoal",
                        "short goal": "shortGoal",
                        "poznámky": "notes",
                    }
                    if key in field_map:
                        data[field_map[key]] = val

        # Days since last work
        if data.get("lastWork") and data["lastWork"] != "—":
            try:
                last = datetime.strptime(data["lastWork"], "%Y-%m-%d").date()
                data["daysSinceWork"] = (date.today() - last).days
            except ValueError:
                data["daysSinceWork"] = None
        else:
            data["daysSinceWork"] = None

        # Category
        data["category"] = _categorize(name)

        # Priority flag
        data["priority"] = any(
            frag.lower() in name.lower() for frag in PRIORITY
        )

        # Enrichments
        for key_fragment, enrichment in ENRICHMENTS.items():
            if key_fragment.lower() in name.lower():
                path = Path(os.path.expanduser(enrichment["path"]))
                if path.exists():
                    stat = enrichment["stats"](path)
                    if stat:
                        data["extraStat"] = stat
                break

        # Sub-projects for Figma MCP / Prototypes
        if "figma" in name.lower() or "prototyp" in name.lower():
            data["subProjects"] = _scan_prototypes()

        projects.append(data)

    return projects


def _scan_prototypes():
    """Scan live/ and mocks/ for individual prototypes."""
    subs = []
    gh_pages_base = "https://yvetalonda-maker.github.io/prototypes"

    for kind in ["live", "mocks"]:
        folder = PROTOTYPES_DIR / kind
        if not folder.exists():
            continue
        for child in sorted(folder.iterdir()):
            if not child.is_dir():
                continue
            name = child.name
            last_date = _git_last_date(f"{kind}/{name}")
            days = None
            if last_date:
                try:
                    d = datetime.strptime(last_date, "%Y-%m-%d").date()
                    days = (date.today() - d).days
                except ValueError:
                    pass

            # Determine status from folder contents
            has_html = any(child.glob("*.html"))
            has_files = any(child.iterdir())

            if not has_files:
                status = "placeholder"
            elif has_html:
                status = "hotovo" if kind == "mocks" else "ongoing"
            else:
                status = "placeholder"

            # Build GH Pages URL for live prototypes with HTML
            url = None
            if kind == "live" and has_html:
                url = f"{gh_pages_base}/{kind}/{name}/"

            subs.append({
                "name": name,
                "kind": kind,
                "lastDate": last_date,
                "daysSince": days,
                "status": status,
                "url": url,
            })

    return subs


def main():
    projects = parse_ideas(IDEAS_FILE)

    output = {
        "generated": datetime.now().isoformat(timespec="minutes"),
        "totalProjects": len(projects),
        "projects": projects,
    }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    with open(TEMPLATE_HTML, encoding="utf-8") as f:
        template = f.read()

    data_json = json.dumps(output, ensure_ascii=False)
    html = template.replace("__DASHBOARD_DATA__", data_json)

    with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Generated index.html with {len(projects)} projects")


if __name__ == "__main__":
    main()
