\# Peerlyy MVP Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement the primary features of the Peerlyy MVP including User Schema extensions, Onboarding Flow, and Feed sorting.

**Architecture:** Extend Prisma schema, create user onboarding endpoints in Express, and integrate heavily with Next.js client onboarding.

**Tech Stack:** Prisma, Express.js (Node), Next.js (React), TypeScript, ImageKit (Media).

---

### Task 1: Update Database Schema for User Profiles

**Files:**
- Modify: `server/src/prisma/schema.prisma`

**Step 1: Write the failing test**
*N/A for schema modification.*

**Step 2: Run test to verify it fails**
*N/A*

**Step 3: Write minimal implementation**
```prisma
// Locate the User model and add name and username
model User {
  id       String  @id @default(uuid())
  email    String  @unique
  password String?
  name     String?   // [NEW] Real name
  username String?   @unique // [NEW] Public username for feed
  
  // existing fields...
  provider     AuthProvider @default(EMAIL)
  googleId     String?
  accessToken  String?
  refreshToken String?

  isVerified        Boolean @default(false)
  isProfileComplete Boolean @default(false)

  college   College? @relation(fields: [collegeId], references: [id])
  collegeId String?

  role   UserRole   @default(STUDENT)
  status UserStatus @default(ACTIVE)

  posts    Post[]
  votes    Vote[]
  comments Comment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([collegeId])
}
```

**Step 4: Run test to verify it passes**

Run: `cd server; npx prisma format` (or standard `db:push` / migration depending on local dev process)
Expected: PASS without syntax errors.

**Step 5: Commit**

```bash
git add server/src/prisma/schema.prisma
git commit -m "feat(db): add name and username to User schema"
```

---

### Task 2: Create Profile Onboarding API

**Files:**
- Modify: `server/src/modules/user/user.routes.ts` (or equivalent)
- Modify: `server/src/modules/user/user.controller.ts`

**Step 1: Write the failing test**
*(Assuming basic supertest setup or manual postman testing if tests are not present)*
```typescript
// tests/user.test.ts
// it("should complete profile and return updated user", async () => { ... })
```

**Step 2: Run test to verify it fails**
Run: `npm test`
Expected: Route not found 404

**Step 3: Write minimal implementation**

```typescript
// user.controller.ts
import { Request, Response } from 'express';
import prisma from '../../prisma/client'; // Adjust path based on workspace

export const completeProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { name, username, collegeId } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        collegeId,
        isProfileComplete: true
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to complete profile" });
  }
};
```

**Step 4: Run test to verify it passes**
Run: Start dev server, curl the endpoint.
Expected: PASS (200 OK)

**Step 5: Commit**

```bash
git add server/src/modules/user/
git commit -m "feat(api): implement complete profile endpoint"
```

---

### Task 3: Feed API "Hot" Sorting & Multi-Tenant Query

**Files:**
- Modify: `server/src/modules/post/post.controller.ts`

**Step 1: Write the failing test**
*Write tests to hit `/api/posts?feed=college` vs `/api/posts?feed=global` and check sorting.*

**Step 2: Run test to verify it fails**
Expected: Missing parameters or incorrect sorting.

**Step 3: Write minimal implementation**

```typescript
// post.controller.ts
export const getFeeds = async (req: Request, res: Response) => {
  try {
    const { feedType } = req.query; // 'global' or 'college'
    const collegeId = req.user.collegeId;

    let whereClause = {};
    if (feedType === 'college') {
      whereClause = { collegeId: collegeId };
    } else {
      whereClause = { visibility: 'PUBLIC' };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: [
        { score: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 50,
      include: {
        author: { select: { username: true } },
        college: { select: { name: true } }
      }
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch feed" });
  }
}
```

**Step 4: Run test to verify it passes**
Run: Target via Postman/curl.
Expected: PASS Returns sorted posts.

**Step 5: Commit**

```bash
git add server/src/modules/post/
git commit -m "feat(api): implement multi-tenant hot feed"
```
