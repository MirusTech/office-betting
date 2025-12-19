---
title: Getting Started with Claude Code
author: A Step-by-Step Guide
---

Getting Started with Claude Code
===

## Your AI coding assistant in the terminal

<!-- pause -->

> **Important Notice**
>
> The company has not yet released an AI policy permitting
> the use of Claude Code for work purposes.
>
> Please use **personal time and resources** only
> for any experimentation with this tool.

<!-- pause -->

**What you'll learn:**

1. Subscribe to Claude Pro or Max
2. Install Claude Code
3. Authenticate and start coding!

<!-- pause -->

**Time needed:** ~10 minutes

<!-- end_slide -->

What is Claude Code?
===

Think of it as having an expert programmer sitting next to you

<!-- pause -->

**Claude Code can:**

- Write code for you
- Fix bugs in your projects
- Explain how code works
- Set up entire applications

<!-- pause -->

**You don't need to be a programmer to use it!**

Just describe what you want in plain English.

<!-- end_slide -->

Step 1: Get a Claude Subscription
===

## You need Claude Pro or Claude Max

<!-- pause -->

**Go to:** `https://claude.ai`

<!-- pause -->

**Click** "Sign Up" or "Log In"

<!-- pause -->

**Choose your plan:**

| Plan | Price | Best for |
|------|-------|----------|
| Pro | $20/month | Individual use |
| Max | $100/month | Heavy usage |

<!-- pause -->

> Both plans include Claude Code access!

<!-- end_slide -->

Step 2a: Install on Mac
===

## Option 1: Using Homebrew (recommended)

Open **Terminal** app and paste:

```bash
brew install claude-code
```

<!-- pause -->

## Option 2: Using npm

If you have Node.js installed:

```bash
npm install -g @anthropic-ai/claude-code
```

<!-- pause -->

**Don't have Terminal?**
Press `Cmd + Space`, type "Terminal", press Enter

<!-- end_slide -->

Step 2b: Install on Windows
===

## First: Install Node.js

1. Go to `https://nodejs.org`
2. Download the **LTS** version
3. Run the installer, click Next through all steps

<!-- pause -->

## Then: Install Claude Code

Open **Command Prompt** or **PowerShell** and type:

```bash
npm install -g @anthropic-ai/claude-code
```

<!-- pause -->

**How to open Command Prompt:**
Press `Windows + R`, type `cmd`, press Enter

<!-- end_slide -->

Step 3: Get Your Authentication Token
===

## Log in to Claude.ai

1. Open your browser
2. Go to `https://claude.ai`
3. Sign in with your Pro/Max account

<!-- pause -->

## Find your token

1. Click your **profile icon** (bottom left)
2. Click **"Settings"**
3. Go to **"Claude Code"** section
4. Click **"Copy Token"**

<!-- pause -->

> Keep this token secret - it's like a password!

<!-- end_slide -->

Step 4: Start Claude Code
===

## Open your terminal

**Mac:** Terminal app
**Windows:** Command Prompt or PowerShell

<!-- pause -->

## Type the command

```bash
claude
```

<!-- pause -->

## First time? You'll see:

```
Welcome to Claude Code!

Please enter your authentication token:
█
```

**Paste your token** (Cmd+V or Ctrl+V) and press Enter

<!-- end_slide -->

You're Ready!
===

## What you'll see

```
╭─────────────────────────────────────────╮
│  Claude Code                            │
│                                         │
│  How can I help you today?              │
│                                         │
╰─────────────────────────────────────────╯

>
```

<!-- pause -->

## Try saying:

> "Create a simple webpage that says Hello World"

<!-- pause -->

Claude will write the code and save it for you!

<!-- end_slide -->

Helpful Tips
===

## Basic commands to remember

| What to type | What it does |
|--------------|--------------|
| `claude` | Start Claude Code |
| `/help` | Show help menu |
| `/clear` | Start fresh |
| `exit` | Quit Claude Code |

<!-- pause -->

## Talk to it naturally

- "Fix the error in my code"
- "Explain what this file does"
- "Add a button to my webpage"

<!-- pause -->

**Claude understands plain English!**

<!-- end_slide -->

Need Help?
===

## Common issues

**"Command not found"**
→ Restart your terminal and try again

<!-- pause -->

**"Invalid token"**
→ Get a fresh token from claude.ai

<!-- pause -->

**"npm not found" (Windows)**
→ Reinstall Node.js and restart your computer

<!-- pause -->

---

## Resources

- Documentation: `https://docs.anthropic.com`
- Claude.ai: `https://claude.ai`

<!-- pause -->

**Questions? Ask your friendly neighborhood developer!**
