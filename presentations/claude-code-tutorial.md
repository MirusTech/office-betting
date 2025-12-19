---
title: Claude Code Tutorial
author: A Beginner's Guide
---

Claude Code Tutorial
===

## Learn to work effectively with your AI assistant

<!-- pause -->

> **Important Notice**
>
> The company has not yet released an AI policy permitting
> the use of Claude Code for work purposes.
>
> Please use **personal time and resources** only
> for any experimentation with this tool.

<!-- pause -->

**Topics covered:**

- Basic commands & navigation
- Understanding permissions
- Planning mode & workflows
- Tips for best results

<!-- end_slide -->

Starting Claude Code
===

## Open your terminal and type:

```bash
claude
```

<!-- pause -->

## You'll see a prompt like this:

```
╭────────────────────────────────────────╮
│ Claude Code                      v1.0  │
╰────────────────────────────────────────╯

  What would you like to do?

> █
```

<!-- pause -->

**Just type what you want in plain English!**

Example: "Create a simple to-do list app"

<!-- end_slide -->

Your First Conversation
===

## Talk to Claude naturally

```
> Can you help me create a Python script that
  converts temperatures from Celsius to Fahrenheit?
```

<!-- pause -->

## Claude will:

1. Understand your request
2. Write the code
3. Ask permission to save the file
4. Explain what it did

<!-- pause -->

**It's like texting with a programmer friend!**

<!-- end_slide -->

Understanding Permissions
===

## Claude always asks before making changes

<!-- pause -->

When Claude wants to create or edit a file:

```
╭─────────────────────────────────────────╮
│ Claude wants to create:                 │
│                                         │
│   temperature.py                        │
│                                         │
│ [Y]es  [N]o  [A]lways  [D]iff          │
╰─────────────────────────────────────────╯
```

<!-- pause -->

| Option | What it does |
|--------|--------------|
| **Y** | Allow this one time |
| **N** | Reject the change |
| **A** | Always allow (this session) |
| **D** | Show what will change |

<!-- end_slide -->

Permission Types
===

## File Operations

- **Read files** - Claude looks at your code
- **Write files** - Claude creates new files
- **Edit files** - Claude modifies existing files

<!-- pause -->

## Command Execution

Claude may need to run commands:

```
╭─────────────────────────────────────────╮
│ Claude wants to run:                    │
│                                         │
│   npm install express                   │
│                                         │
│ [Y]es  [N]o  [A]lways                  │
╰─────────────────────────────────────────╯
```

<!-- pause -->

> **Tip:** Read commands before approving.
> If unsure, ask Claude to explain first!

<!-- end_slide -->

Essential Slash Commands
===

## Type these anytime during your session

<!-- pause -->

| Command | What it does |
|---------|--------------|
| `/help` | Show all available commands |
| `/clear` | Clear conversation, start fresh |
| `/compact` | Summarize long conversations |
| `/cost` | Show how much you've used |
| `/quit` | Exit Claude Code |

<!-- pause -->

## More useful commands

| Command | What it does |
|---------|--------------|
| `/status` | Show current project info |
| `/undo` | Undo the last file change |
| `/diff` | Show recent changes |
| `/doctor` | Diagnose common problems |

<!-- end_slide -->

Keyboard Shortcuts
===

## See what Claude is doing

<!-- pause -->

| Shortcut | What it does |
|----------|--------------|
| `Ctrl + T` | Show current task/thinking |
| `Ctrl + O` | Show tool output details |

<!-- pause -->

## When to use these:

- Claude seems to be taking a while
- You want to see progress on a long task
- Curious what's happening "under the hood"

<!-- pause -->

> These are great for learning how Claude works!

<!-- end_slide -->

Background Tasks
===

## Claude can run tasks in the background

<!-- pause -->

Some operations run while you keep chatting:
- Installing packages
- Running tests
- Building projects

<!-- pause -->

## View background tasks

```
> /tasks
```

Shows all running and recent tasks.

<!-- pause -->

## Control background tasks

| Command | What it does |
|---------|--------------|
| `/tasks` | List all tasks |
| `/tasks kill <id>` | Stop a task |
| `/tasks output <id>` | View task output |

<!-- end_slide -->

Status and Doctor
===

## Check your setup with `/status`

```
> /status
```

Shows:
- Current working directory
- Files in context
- Active project settings
- Session information

<!-- pause -->

## Troubleshoot with `/doctor`

```
> /doctor
```

<!-- pause -->

Checks for common issues:
- Authentication problems
- Missing dependencies
- Configuration errors
- Permission issues

> Use `/doctor` first when something isn't working!

<!-- end_slide -->

Planning Mode
===

## For bigger tasks, ask Claude to plan first

<!-- pause -->

**How to activate:**

```
> /plan Create a website for my bakery business
```

Or just ask:

```
> Can you plan out how to build a recipe app?
```

<!-- pause -->

## What happens in Planning Mode:

1. Claude analyzes what's needed
2. Creates a step-by-step plan
3. Shows you the plan for approval
4. **Does NOT write code yet**

<!-- pause -->

> Great for complex projects!

<!-- end_slide -->

Working with Plans
===

## Claude shows you the plan first

```
╭─────────────────────────────────────────╮
│ Implementation Plan                     │
├─────────────────────────────────────────┤
│                                         │
│ 1. Set up project structure             │
│ 2. Create database models               │
│ 3. Build API endpoints                  │
│ 4. Design user interface                │
│ 5. Add authentication                   │
│                                         │
│ Proceed with this plan? [Y/N]           │
╰─────────────────────────────────────────╯
```

<!-- pause -->

**You can:**
- Approve and let Claude start
- Ask for changes to the plan
- Request more details on any step

<!-- end_slide -->

Accept Edit Mode
===

## Review changes before they're saved

<!-- pause -->

When Claude edits a file, you'll see:

```diff
  def calculate_total(items):
-     total = 0
+     total = 0.0
      for item in items:
-         total = total + item
+         total += item.price * item.quantity
      return total
```

<!-- pause -->

**The colors show:**
- **Red (-)** = Lines being removed
- **Green (+)** = Lines being added

<!-- pause -->

Press **Y** to accept, **N** to reject

<!-- end_slide -->

Common Workflows
===

## 1. Creating something new

```
> Create a simple website with a contact form
```

Claude will create all necessary files.

<!-- pause -->

## 2. Fixing a problem

```
> I'm getting an error when I click the submit
  button. Can you help fix it?
```

Claude will find and fix the issue.

<!-- pause -->

## 3. Learning & explaining

```
> Explain what the code in app.py does
```

Claude explains without changing anything.

<!-- end_slide -->

Workflow: Step by Step
===

## Best practice for new projects

<!-- pause -->

**Step 1: Describe your goal**
```
> I want to build a habit tracker app
```

<!-- pause -->

**Step 2: Let Claude plan**
```
> Can you plan this out before we start?
```

<!-- pause -->

**Step 3: Review and approve the plan**

<!-- pause -->

**Step 4: Let Claude implement**
```
> Looks good, let's start with step 1
```

<!-- pause -->

**Step 5: Test and iterate**
```
> The save button doesn't work, can you fix it?
```

<!-- end_slide -->

Tips for Best Results
===

## Be specific about what you want

<!-- pause -->

**Less helpful:**
```
> Make a website
```

<!-- pause -->

**More helpful:**
```
> Create a personal portfolio website with
  sections for About Me, My Projects, and
  Contact. Use a modern, clean design.
```

<!-- pause -->

> The more details, the better the result!

<!-- end_slide -->

More Tips
===

## Ask for explanations

```
> Before you make changes, can you explain
  what you're planning to do?
```

<!-- pause -->

## Work in small steps

Instead of: "Build me a complete e-commerce site"

Try: "Let's start with a simple product listing page"

<!-- pause -->

## Use undo when needed

```
> /undo
```

This reverses the last change Claude made.

<!-- end_slide -->

Choosing Your Model
===

## Claude Code can use different AI models

<!-- pause -->

| Model | Speed | Token Usage | Best for |
|-------|-------|-------------|----------|
| **Sonnet** | Fast | Lower | Most tasks |
| **Opus** | Slower | Higher | Complex reasoning |

<!-- pause -->

## Recommendation for Max plan users:

> **Use Sonnet for everyday tasks!**
>
> Opus uses significantly more tokens.
> Save Opus for complex architectural decisions
> or very difficult problems.

<!-- pause -->

## To switch models:

```
> /model sonnet
```

<!-- end_slide -->

Understanding Context
===

## What is "context"?

<!-- pause -->

Context = everything Claude remembers about your conversation

- What you've asked
- Files Claude has read
- Changes that were made
- Errors you've encountered

<!-- pause -->

## Why it matters

Claude uses context to understand your project.
More context = better, more relevant answers!

<!-- pause -->

> But too much context can slow things down
> or cause confusion in very long sessions.

<!-- end_slide -->

Managing Context
===

## Check what Claude knows

```
> /context
```

Shows files and information in current context.

<!-- pause -->

## Clear and start fresh

```
> /clear
```

Removes all conversation history.
Use when switching to a different task.

<!-- pause -->

## Compact long conversations

```
> /compact
```

Summarizes the conversation to save space
while keeping important information.

<!-- end_slide -->

When to Clear Context
===

## Good times to use `/clear`:

<!-- pause -->

- Starting a completely new task
- Claude seems confused about your project
- You want a fresh perspective
- Conversation is getting very long

<!-- pause -->

## When NOT to clear:

- In the middle of a task
- When Claude needs to remember earlier work
- When debugging a problem step by step

<!-- pause -->

> **Tip:** If unsure, use `/compact` instead!
> It keeps key info while freeing up space.

<!-- end_slide -->

CLAUDE.md Files
===

## Teach Claude about your preferences

<!-- pause -->

**CLAUDE.md** files contain instructions that
Claude reads automatically when you start.

<!-- pause -->

## Two types:

| Type | Location | Purpose |
|------|----------|---------|
| **Global** | `~/.claude/CLAUDE.md` | Your personal preferences |
| **Project** | `./CLAUDE.md` | Project-specific rules |

<!-- pause -->

> Project settings override global settings!

<!-- end_slide -->

What to Put in CLAUDE.md
===

## Global preferences (your home folder)

```markdown
# My Preferences

- Always explain code changes before making them
- Use Python for scripts unless I specify otherwise
- Keep code simple and well-commented
```

<!-- pause -->

## Project-specific rules

```markdown
# Project Guidelines

- This is a React TypeScript project
- Use Tailwind CSS for styling
- API endpoints are in /src/api
- Run tests with: npm test
```

<!-- pause -->

> Claude follows these instructions automatically!

<!-- end_slide -->

MCP Servers
===

## Extend Claude's capabilities

<!-- pause -->

**MCP** (Model Context Protocol) is an open standard
that lets you add extra tools to Claude Code.

<!-- pause -->

## Think of MCP servers as "plugins"

- They give Claude new abilities
- Many are available from the community
- You can even create your own!

<!-- pause -->

## Browse available servers:

`https://github.com/modelcontextprotocol/servers`

<!-- end_slide -->

How MCP Servers Work
===

## Claude gains new tools automatically

<!-- pause -->

1. You install and configure an MCP server
2. Restart Claude Code
3. Claude can now use those tools!

<!-- pause -->

## Example:

With a "weather" MCP server installed:

```
> What's the weather in Paris?
```

Claude calls the weather tool and gives you
a real answer - not just training data!

<!-- pause -->

> MCP servers connect Claude to live data & services

<!-- end_slide -->

Recommended: Context7
===

## Up-to-date library documentation

<!-- pause -->

**Problem:** Claude's training data has a cutoff date.
Library docs may be outdated.

<!-- pause -->

**Solution:** Context7 fetches current documentation!

```
> How do I use the new React 19 features?
```

Claude looks up the latest React docs for you.

<!-- pause -->

## Installation

Visit: `https://context7.com`

Follow the setup instructions for Claude Code.

<!-- end_slide -->

Recommended: Serena
===

## Intelligent code navigation

<!-- pause -->

**What Serena provides:**

- Find where functions are defined
- Find all references to a class
- Rename variables across your project
- Understand complex code structure

<!-- pause -->

## Example:

```
> Find all places where the User class
  is instantiated in this project
```

Serena searches intelligently, not just text matching.

<!-- pause -->

## Installation

Visit: `https://oraios.github.io/serena`

Follow the setup instructions for Claude Code.

<!-- end_slide -->

Using MCP Servers
===

## They work automatically!

<!-- pause -->

Once configured, just ask naturally:

```
> Look up the latest FastAPI documentation
  for dependency injection
```

<!-- pause -->

```
> What functions call the save_user method?
```

<!-- pause -->

Claude knows which tools to use based on your question.

> No special commands needed!

<!-- end_slide -->

Handling Errors
===

## When something goes wrong

<!-- pause -->

**Just tell Claude:**

```
> I got this error: "Cannot read property 'map'
  of undefined" - can you fix it?
```

<!-- pause -->

**Or paste the error:**

```
> Here's the error I'm seeing:

  TypeError: Cannot read property 'map'
  at UserList.js:15
```

<!-- pause -->

Claude will diagnose and fix the problem!

<!-- end_slide -->

Ending Your Session
===

## When you're done

<!-- pause -->

**Type:**
```
> /quit
```

or just press `Ctrl + C`

<!-- pause -->

## Your work is saved

All files Claude created or edited remain
in your project folder.

<!-- pause -->

## Next time

Just run `claude` again in the same folder
to continue where you left off!

<!-- end_slide -->

Quick Reference Card
===

## Commands to remember

| Command | Purpose |
|---------|---------|
| `claude` | Start Claude Code |
| `/help` | Get help |
| `/plan` | Enter planning mode |
| `/undo` | Undo last change |
| `/clear` | Fresh start |
| `/compact` | Summarize context |
| `/status` | Check project info |
| `/doctor` | Troubleshoot issues |
| `/cost` | Check usage |
| `/quit` | Exit Claude Code |

<!-- pause -->

## Permission responses

| Key | Meaning |
|-----|---------|
| `Y` | Yes, allow |
| `N` | No, reject |
| `A` | Always allow |
| `D` | Show diff |

<!-- pause -->

## Keyboard shortcuts

| Shortcut | Purpose |
|----------|---------|
| `Ctrl+T` | See current thinking |
| `Ctrl+O` | See tool output |
| `Ctrl+C` | Cancel / Exit |

<!-- end_slide -->

Installing Git
===

## You need Git to work with code repositories

<!-- pause -->

## Mac Installation

**Option 1:** Install Xcode Command Line Tools
```bash
xcode-select --install
```

**Option 2:** Using Homebrew
```bash
brew install git
```

<!-- pause -->

## Windows Installation

1. Download from `https://git-scm.com/download/win`
2. Run the installer
3. Accept default settings (click Next through all steps)
4. Restart your terminal

<!-- end_slide -->

Verify Git Installation
===

## Check that Git is working

```bash
git --version
```

<!-- pause -->

You should see something like:

```
git version 2.43.0
```

<!-- pause -->

## Configure your identity (first time only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

<!-- end_slide -->

Try the Demo Project
===

## Clone the Office Betting demo

<!-- pause -->

**1. Open your terminal and navigate to a folder**

```bash
cd ~/Documents
```

<!-- pause -->

**2. Clone the repository**

```bash
git clone https://github.com/MirusTech/office-betting.git
```

<!-- pause -->

**3. Enter the project folder**

```bash
cd office-betting
```

<!-- end_slide -->

Running the Demo
===

## Start the application

<!-- pause -->

**Backend (first terminal):**

```bash
cd backend
uv venv && uv pip install -e .
source .venv/bin/activate   # Mac/Linux
python -m mirustech.betting.seed
uvicorn mirustech.betting.main:app --port 8000
```

<!-- pause -->

**Frontend (second terminal):**

```bash
cd frontend
npm install
npm run dev
```

<!-- pause -->

## Open in browser

```
http://localhost:5173
```

Demo login: `demo` / `demo`

<!-- end_slide -->

Practice Exercise
===

## Try this on your own!

<!-- pause -->

**1. Start Claude Code**
```bash
claude
```

<!-- pause -->

**2. Ask for a simple project**
```
> Create a webpage that shows the current
  time and updates every second
```

<!-- pause -->

**3. Approve the files Claude creates**

<!-- pause -->

**4. Ask Claude to open it**
```
> Can you open this in my browser?
```

<!-- pause -->

**Congratulations - you're using Claude Code!**

<!-- end_slide -->

Need Help?
===

## Getting unstuck

<!-- pause -->

**If Claude seems confused:**
```
> Let's start over. Here's what I want: ...
```

<!-- pause -->

**If you're confused:**
```
> Can you explain that in simpler terms?
```

<!-- pause -->

**If something broke:**
```
> /undo
```

<!-- pause -->

---

## Remember: There are no stupid questions!

Claude is patient and happy to explain things
multiple times in different ways.

**Happy coding!**
