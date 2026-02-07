/**
 * Centralized copy for GitQuest (English).
 * All user-facing text lives here for i18n readiness.
 * Keys are dot-path strings, e.g. "quest.level1.title"
 */
export const en = {
  app: {
    name: "GitQuest",
    tagline: "Learn Git by playing. Level by level.",
  },
  home: {
    startPlaying: "Start playing",
    viewLevels: "View levels",
  },
  nav: {
    back: "← Home",
    level: "Level",
  },
  play: {
    title: "GitQuest",
  },
  levels: {
    title: "Levels",
    description: "Complete quests to earn XP and unlock new levels.",
    levelUnavailable: "Level {level} is not available yet.",
    viewAvailableLevels: "View available levels",
    locked: "Locked",
    notStarted: "Not started",
    done: "Done",
    play: "Play",
    completed: "Completed",
    currentLocation: "Current Location",
  },
  levelList: {
    one: "Quest 1: First Repository",
    two: "Quest 2: Stage Your Changes",
    three: "Quest 3: Your First Commit",
  },
  levelMap: {
    one: "git init",
    two: "git add & commit",
    three: "Branching",
    starterCottage: "The Starter Cottage",
    neonForest: "Stage & Commit",
    branching: "Branching Paths",
  },
  quest: {
    level1: {
      title: "Quest 1: First Repository",
      subtitle: "Initialize a repository",
      hint: "Use git init to turn this folder into a Git repository.",
      objectiveInit: "Initialize the repository",
      buttonInit: "Run git init",
      buttonAlreadyInit: "Already initialized",
      questComplete: "Quest complete",
      welcome: "Welcome! Your first task is to create a new Git repository. Run git init to initialize one in this folder.",
      success: "Nice! You've initialized a repository. Git created a .git folder and set up the default branch \"main\". Quest complete!",
      already: "This folder is already a Git repository. You've completed this quest!",
    },
    level2: {
      title: "Quest 2: Stage & Commit",
      subtitle: "Stage changes and create your first commit",
      hint: "Use git add to stage files, then git commit -m \"message\" to save them to history.",
      objectiveStage: "Stage the modified file(s)",
      objectiveCommit: "Create a commit with a message",
      buttonStage: "Stage",
      buttonUnstage: "Unstage",
      buttonCommit: "Commit",
      commitPlaceholder: "Commit message…",
      questComplete: "Quest complete",
      welcome: "Your repo has a modified file. Stage it with git add, then create a commit with git commit -m \"your message\".",
      staged: "File staged! Now add a commit message and click Commit.",
      success: "Your first commit is in the history. You've learned the basic Git workflow!",
      already: "You've already completed this quest. Great work!",
    },
  },
  avatar: {
    title: "Git Guide",
    waiting: "Waiting for instructions…",
    mood: {
      idle: "I'm here when you need me. Try the objective above!",
      encouraging: "You've got this! Follow the quest steps.",
      success: "Nice work! Keep going.",
      celebrating: "Amazing! Quest complete!",
      levelComplete: "You did it! Quest complete.",
    },
  },
  repo: {
    title: "Repository",
    branches: "Branches",
    workingDir: "Working directory",
    commits: "Commits",
    staged: "Staged",
    notAGitRepo: "Not a git repository (no .git directory)",
    noCommitsYet: "(no commits yet)",
    currentBranch: "current branch",
    modified: "modified",
    untracked: "untracked",
  },
  progression: {
    xp: "XP",
    xpEarned: "+{amount} XP",
    badges: "Badges",
    firstSteps: "First Steps",
    firstStepsDesc: "Complete your first quest",
  },
} as const;

// Use dot paths with t(), e.g. t("quest.level1.title")
