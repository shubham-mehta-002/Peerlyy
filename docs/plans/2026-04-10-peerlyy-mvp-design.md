# Peerlyy MVP Design Specification

## Overview
Peerlyy is a multi-tenant college-oriented chat/discussion forum. Students can find help, share thoughts, and stay connected. Access is bounded to specific colleges based on verified domains, with the option to engage in a global cross-college feed.

## 1. Authentication & Onboarding
- **Email/Password Auth**: Core MVP will utilize standard email and password registration. (Google OAuth integration planned for post-MVP).
- **Domain Verification**: Signups require official college email accounts. The domain is checked against the database to map the student to the correct `College`. If a domain maps to multiple colleges/campuses, the user must explicitly select their campus.
- **"Complete Your Profile" Gate**: After auth, but before reaching the home page, the user must complete their profile.
  - Generates or selects a unique `username` (e.g., via bloom filters or custom choice).
  - Inputs real `name` (kept private, while `username` is public on the feed).
  - The email ID is never publicly exposed.

## 2. Admin Portal
- **Status**: Already implemented and fully correct. Handles college/domain management, user moderation, and application analytics.

## 3. Feed Architecture
- **Dual Feed System**: 
  - **College Specific**: Posts bounded to the user's own `collegeId`.
  - **Global Feed**: Posts visible across all colleges (`visibility === 'PUBLIC'`).
- **Filters & Search**: 
  - Text-based search for post captions/subjects.
  - Sorting toggles (New, Trending, Top).

## 4. Post Management (CRUD)
- **Create**: Users can post text/media. Specify visibility (College-only vs. Global).
- **Media Uploads**: Utilizes ImageKit for handling all image and video uploads.
- **Update**: Only the original author can edit the post.
- **Delete**: Only the original author (or an Admin via the admin portal) can delete the post.

## 5. Engagement Systems
- **Scoring**: Upvote and downvote actions aggregated into a `score`.
- **Comments**: 
  - Threaded nested comment architecture.
  - **Frontend Handling**: To preserve UI cleanliness, nesting is flattened or hidden behind "View more replies" after 3-to-4 levels deep.
- **Sharing**: Ability to copy post links to share externally.

## 6. Ranking Algorithm
- **Trending Metric**: The default feed sorting will utilize an algorithm calculating relevance.
  - **Variables**: Ratio of Upvotes to Downvotes (`score`), Comment Volume, and Time Decay (newer posts rank higher).
