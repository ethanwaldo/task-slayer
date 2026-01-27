# Task Slayer: Contribution Guidelines

Welcome to the team! Since we are deploying live to Person D's Raspberry Pi, we have some strict rules to ensure we don't break the high-performance deployment environment.

## ⚔️ The Workflow

1. **NEVER push directly to `main`**. Direct pushes are disabled.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit often**, but keep your messages clear.
4. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request (PR)** on GitHub to merge into `main`.

## 🛡️ Integration Rules (The "Slayer" Standards)

* **Code Review**: At least one other team member (preferably Person D) must approve your PR.
* **Build Check**: Ensure your code doesn't break the build before requesting a review.
* **Separation of Concerns**: 
  - If you're working on UI, stay in `client/`.
  - If you're working on Data, stay in `server/models/`.

## 🚀 Deployment

Only merges to `main` trigger the auto-deployment to the production server. 

**Person D (DevOps)** is the final authority on merges to `main`.
