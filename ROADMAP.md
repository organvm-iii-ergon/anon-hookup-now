# Anon Hookup Now - Exhaustive Development Roadmap

**Version 1.0** | Last Updated: 2025-11-19

This document provides a complete breakdown of all features and tasks from macro phases to atomic implementation steps.

---

## 📋 Table of Contents

1. [Phase 0: Foundation & Setup](#phase-0-foundation--setup)
2. [Phase 1: Core Backend](#phase-1-core-backend)
3. [Phase 2: Authentication & User Management](#phase-2-authentication--user-management)
4. [Phase 3: Location Services](#phase-3-location-services)
5. [Phase 4: Hookup Mode (Grid View)](#phase-4-hookup-mode-grid-view)
6. [Phase 5: Hookup Mode (Map View)](#phase-5-hookup-mode-map-view)
7. [Phase 6: Real-time Chat](#phase-6-real-time-chat)
8. [Phase 7: Love Mode - Matching](#phase-7-love-mode---matching)
9. [Phase 8: Love Mode - Progressive Unlocking](#phase-8-love-mode---progressive-unlocking)
10. [Phase 9: Love Mode - Interactive Games](#phase-9-love-mode---interactive-games)
11. [Phase 10: Media & Photos](#phase-10-media--photos)
12. [Phase 11: Safety & Moderation](#phase-11-safety--moderation)
13. [Phase 12: Mobile App (React Native)](#phase-12-mobile-app-react-native)
14. [Phase 13: Web App & PWA](#phase-13-web-app--pwa)
15. [Phase 14: Advanced Privacy & Security](#phase-14-advanced-privacy--security)
16. [Phase 15: Performance & Optimization](#phase-15-performance--optimization)
17. [Phase 16: Analytics & Insights](#phase-16-analytics--insights)
18. [Phase 17: Notifications](#phase-17-notifications)
19. [Phase 18: Premium Features (Optional)](#phase-18-premium-features-optional)
20. [Phase 19: Testing & Quality Assurance](#phase-19-testing--quality-assurance)
21. [Phase 20: Deployment & DevOps](#phase-20-deployment--devops)
22. [Phase 21: Documentation](#phase-21-documentation)
23. [Phase 22: Community & Growth](#phase-22-community--growth)

---

## Phase 0: Foundation & Setup

**Status**: ✅ COMPLETED

### Macro: Project Infrastructure

#### Feature 0.1: Repository Setup
- [x] Initialize Git repository
- [x] Create branch structure
- [x] Set up .gitignore
- [x] Add LICENSE (GPL-3.0)
- [x] Create initial README

#### Feature 0.2: Documentation Foundation
- [x] Write ARCHITECTURE.md
- [x] Write PROJECT_README.md
- [x] Create roadmap (this document)
- [x] Document API structure
- [x] Create contributing guidelines template

#### Feature 0.3: Development Environment
- [x] Set up Docker Compose
- [x] Configure PostgreSQL with PostGIS
- [x] Configure Redis
- [x] Configure MinIO
- [x] Configure Nginx reverse proxy
- [x] Create .env.example

---

## Phase 1: Core Backend

**Status**: ✅ COMPLETED (Base structure)

### Macro: API Infrastructure

#### Feature 1.1: Express.js Server Setup
- [x] Initialize Node.js project
- [x] Configure TypeScript
- [x] Set up Express.js
- [x] Configure middleware (helmet, cors, compression)
- [x] Set up error handling
- [x] Configure logging (Winston)
- [x] Add health check endpoint

**Micro Tasks:**
- [x] Create package.json with dependencies
- [x] Create tsconfig.json
- [x] Create src/index.ts entry point
- [x] Add middleware/errorHandler.ts
- [x] Add middleware/rateLimiter.ts
- [x] Add utils/logger.ts
- [x] Configure environment variables

#### Feature 1.2: Database Setup
- [x] Set up Prisma ORM
- [x] Design database schema
- [x] Create User model
- [x] Create Profile model
- [x] Create UserLocation model
- [x] Create Message model
- [x] Create Match model
- [x] Create Block/Report models
- [x] Create Game participation models

**Micro Tasks:**
- [x] Install Prisma packages
- [x] Create prisma/schema.prisma
- [x] Define enums (UserMode, UnlockLevel, etc.)
- [x] Define relations between models
- [x] Add indexes for performance
- [x] Configure PostGIS extension
- [ ] Create initial migration
- [ ] Seed database with test data

#### Feature 1.3: Redis Integration
- [x] Connect to Redis
- [x] Configure session storage
- [x] Add cache utilities
- [ ] Implement rate limiting store
- [ ] Add pub/sub for real-time features

**Micro Tasks:**
- [x] Install ioredis
- [x] Create Redis client in index.ts
- [x] Add retry strategy
- [ ] Create utils/cache.ts
- [ ] Create utils/pubsub.ts
- [ ] Add cache invalidation logic

#### Feature 1.4: WebSocket Server
- [x] Set up Socket.io
- [x] Configure CORS for WebSocket
- [x] Create authentication middleware
- [x] Set up room/namespace structure
- [x] Add connection/disconnection handlers

**Micro Tasks:**
- [x] Install socket.io
- [x] Create services/websocket.service.ts
- [x] Add JWT verification for WebSocket
- [x] Implement user rooms (user:${id})
- [x] Add presence tracking
- [ ] Add reconnection handling
- [ ] Add message queueing for offline users

---

## Phase 2: Authentication & User Management

**Status**: ✅ COMPLETED (Base implementation)

### Macro: User Identity & Access

#### Feature 2.1: Registration
- [x] Email/password registration
- [ ] Phone number registration
- [ ] OAuth (Google)
- [ ] OAuth (Apple Sign In)
- [ ] OAuth (Facebook)
- [ ] Age verification (18+)
- [ ] Terms of service acceptance
- [ ] Privacy policy acceptance

**Micro Tasks:**
- [x] Create POST /api/auth/register endpoint
- [x] Add email validation
- [x] Add password strength validation
- [x] Hash passwords with bcrypt
- [x] Create user + profile in transaction
- [x] Generate email verification token
- [ ] Send verification email
- [ ] Add phone number validation
- [ ] Integrate Twilio for SMS
- [ ] Set up Google OAuth
- [ ] Set up Apple OAuth
- [ ] Set up Facebook OAuth
- [ ] Add CAPTCHA for bot prevention
- [ ] Add age verification modal
- [ ] Store consent timestamps

#### Feature 2.2: Login
- [x] Email/password login
- [x] JWT token generation
- [x] Refresh token mechanism
- [ ] Remember me functionality
- [ ] Device fingerprinting
- [ ] Login history tracking
- [ ] Suspicious activity detection

**Micro Tasks:**
- [x] Create POST /api/auth/login endpoint
- [x] Verify password with bcrypt
- [x] Generate access token (15min)
- [x] Generate refresh token (7d)
- [x] Store refresh token in Redis
- [x] Update last_seen timestamp
- [ ] Add device_id field
- [ ] Create LoginHistory model
- [ ] Add IP address logging
- [ ] Add geolocation from IP
- [ ] Send email on new device login
- [ ] Add account lockout after failed attempts

#### Feature 2.3: Email Verification
- [x] Generate verification token
- [ ] Send verification email
- [ ] Verify token endpoint
- [ ] Resend verification email
- [ ] Email verification reminder

**Micro Tasks:**
- [x] Create verification token (UUID)
- [x] Store token in Redis (24h TTL)
- [x] Create POST /api/auth/verify-email endpoint
- [ ] Set up SMTP configuration
- [ ] Create email templates
- [ ] Send welcome email on verification
- [ ] Add POST /api/auth/resend-verification
- [ ] Add reminder job (3 days unverified)

#### Feature 2.4: Password Management
- [x] Forgot password
- [x] Reset password
- [ ] Change password (authenticated)
- [ ] Password strength meter
- [ ] Password history (prevent reuse)

**Micro Tasks:**
- [x] Create POST /api/auth/forgot-password
- [x] Generate reset token (1h TTL)
- [x] Create POST /api/auth/reset-password
- [ ] Create PATCH /api/users/me/password
- [ ] Verify current password
- [ ] Add PasswordHistory model
- [ ] Check against last 5 passwords
- [ ] Add password strength library (zxcvbn)
- [ ] Return strength score to client

#### Feature 2.5: Two-Factor Authentication (2FA)
- [ ] TOTP setup (Google Authenticator)
- [ ] SMS 2FA
- [ ] Backup codes generation
- [ ] 2FA enforcement option

**Micro Tasks:**
- [ ] Install speakeasy for TOTP
- [ ] Create POST /api/auth/2fa/setup
- [ ] Generate QR code
- [ ] Store 2FA secret encrypted
- [ ] Create POST /api/auth/2fa/verify
- [ ] Add 2FA to login flow
- [ ] Generate 10 backup codes
- [ ] Add SMS 2FA option
- [ ] Add recovery email option

#### Feature 2.6: Session Management
- [x] Token refresh endpoint
- [x] Logout (invalidate tokens)
- [ ] Logout all devices
- [ ] View active sessions
- [ ] Revoke specific session

**Micro Tasks:**
- [x] Create POST /api/auth/refresh
- [x] Verify refresh token
- [x] Create POST /api/auth/logout
- [x] Delete refresh token from Redis
- [ ] Create Session model
- [ ] Create GET /api/auth/sessions
- [ ] Create DELETE /api/auth/sessions/:id
- [ ] Create DELETE /api/auth/sessions/all
- [ ] Show device, location, last active

#### Feature 2.7: Profile Management
- [x] Get current user
- [x] Update profile
- [ ] Deactivate account
- [ ] Delete account
- [ ] Export user data (GDPR)

**Micro Tasks:**
- [x] Create GET /api/users/me
- [x] Create PATCH /api/users/me
- [x] Filter allowed update fields
- [ ] Create POST /api/users/me/deactivate
- [ ] Set deleted_at timestamp
- [ ] Hide from discovery
- [ ] Create DELETE /api/users/me
- [ ] Add 30-day grace period
- [ ] Create data export job
- [ ] Generate ZIP with all user data
- [ ] Email download link

---

## Phase 3: Location Services

**Status**: 🔄 IN PROGRESS

### Macro: Geospatial Features

#### Feature 3.1: Location Updates
- [x] Update user location
- [ ] Background location updates
- [ ] Location accuracy validation
- [ ] Location update throttling
- [ ] Detect location spoofing

**Micro Tasks:**
- [x] Create POST /api/users/me/location
- [x] Validate latitude/longitude
- [x] Store in UserLocation table
- [ ] Add background task for mobile
- [ ] Check accuracy < 100m
- [ ] Throttle to 1 update/30s
- [ ] Add impossible speed detection
- [ ] Add known VPN IP detection
- [ ] Add GPS vs IP location check

#### Feature 3.2: Privacy Controls
- [x] Location fuzzing/jittering
- [x] Approximate distance display
- [ ] Hide exact location option
- [ ] Invisible mode (hide from discovery)
- [ ] Location history management

**Micro Tasks:**
- [x] Implement jitterLocation() in utils
- [x] Implement roundDistance() in utils
- [x] Add LOCATION_JITTER_METERS env var
- [ ] Add exact_location toggle to Profile
- [ ] Add invisible_mode toggle
- [ ] Hide from all queries when invisible
- [ ] Create LocationHistory model
- [ ] Add retention policy (30 days)
- [ ] Add DELETE /api/users/me/locations

#### Feature 3.3: Geospatial Queries
- [x] Find nearby users (bounding box)
- [ ] PostGIS distance queries
- [ ] Spatial indexing
- [ ] Clustering for map view
- [ ] Hot spots detection

**Micro Tasks:**
- [x] Implement getBoundingBox() in utils
- [x] Basic distance filtering in controller
- [ ] Add ST_Distance_Sphere in Prisma
- [ ] Create spatial index (GIST)
- [ ] Implement ST_ClusterDBSCAN for map
- [ ] Add density-based clustering
- [ ] Identify popular locations
- [ ] Cache hot spots in Redis

#### Feature 3.4: Travel Mode
- [ ] Explore other cities
- [ ] Save favorite locations
- [ ] Recently viewed locations
- [ ] Travel distance limits

**Micro Tasks:**
- [ ] Add explore_mode flag
- [ ] Allow manual location selection
- [ ] Create SavedLocation model
- [ ] Add POST /api/users/me/locations/saved
- [ ] Add GET /api/users/me/locations/saved
- [ ] Create RecentLocation model
- [ ] Limit explore to 100km from saved
- [ ] Add cooldown (1h between changes)

---

## Phase 4: Hookup Mode (Grid View)

**Status**: 🔄 IN PROGRESS

### Macro: Grindr-Style Discovery

#### Feature 4.1: Grid View API
- [x] Basic nearby users endpoint
- [ ] Infinite scroll/pagination
- [ ] Distance-based sorting
- [ ] Last active sorting
- [ ] Favorite users first

**Micro Tasks:**
- [x] Create GET /api/discover/grid
- [x] Add limit/offset parameters
- [x] Calculate distances
- [x] Filter by max distance
- [ ] Add cursor-based pagination
- [ ] Add sort parameter (distance, active, new)
- [ ] Query favorites table
- [ ] Boost favorited users in results
- [ ] Add has_photos filter
- [ ] Add online_now filter

#### Feature 4.2: Advanced Filtering
- [ ] Age range filter
- [ ] Height filter
- [ ] Body type filter
- [ ] Ethnicity filter
- [ ] Tribes/tags filter
- [ ] "Looking for" filter
- [ ] Has photos filter
- [ ] Verified only filter

**Micro Tasks:**
- [ ] Add filter parameters to endpoint
- [ ] Add WHERE clauses for each filter
- [ ] Create FilterPreferences model
- [ ] Save user's filter preferences
- [ ] Add GET /api/users/me/filters
- [ ] Add PATCH /api/users/me/filters
- [ ] Add "apply filters" toggle
- [ ] Add "recently active" filter
- [ ] Add "new users" filter

#### Feature 4.3: Profile Cards
- [ ] Profile preview design
- [ ] Quick actions (tap, favorite, block)
- [ ] Last active indicator
- [ ] Distance display
- [ ] Online status badge
- [ ] Verification badge

**Micro Tasks:**
- [ ] Design profile card component
- [ ] Show display name, age, distance
- [ ] Show primary photo
- [ ] Show online indicator (green dot)
- [ ] Show verification checkmark
- [ ] Add quick tap gesture
- [ ] Add long-press menu
- [ ] Show preview of bio (2 lines)
- [ ] Show tribes as chips

#### Feature 4.4: Favorites System
- [x] Add to favorites API
- [x] Remove from favorites API
- [ ] View favorites list
- [ ] Favorite notifications
- [ ] Mutual favorites

**Micro Tasks:**
- [x] Create POST /api/discover/users/:id/favorite
- [x] Create DELETE /api/discover/users/:id/favorite
- [ ] Create GET /api/users/me/favorites
- [ ] Add favorite_count to Profile
- [ ] Emit WebSocket event on new favorite
- [ ] Check if both favorited
- [ ] Create notification for mutual favorite
- [ ] Add favorites section in app

#### Feature 4.5: Blocking System
- [x] Block user API
- [ ] View blocked users
- [ ] Unblock user
- [ ] Hide from blocked users

**Micro Tasks:**
- [x] Create POST /api/discover/users/:id/block
- [x] Filter blocked users from discovery
- [ ] Create GET /api/users/me/blocks
- [ ] Create DELETE /api/users/me/blocks/:id
- [ ] Prevent messaging when blocked
- [ ] Remove from matches if blocked
- [ ] Add block reason (optional)
- [ ] Add abuse report on block

---

## Phase 5: Hookup Mode (Map View)

**Status**: 📋 PLANNED

### Macro: Sniffies-Style Real-time Map

#### Feature 5.1: Map View API
- [ ] Map bounds query
- [ ] Clustering for privacy
- [ ] Real-time updates
- [ ] Heat map data

**Micro Tasks:**
- [ ] Create GET /api/discover/map
- [ ] Accept bounds parameter (minLat,minLon,maxLat,maxLon)
- [ ] Implement ST_ClusterDBSCAN
- [ ] Return cluster centers and counts
- [ ] Add zoom level parameter
- [ ] Adjust cluster radius by zoom
- [ ] WebSocket event for location updates
- [ ] Generate heat map coordinates
- [ ] Cache heat map in Redis (5min)

#### Feature 5.2: Privacy Protection
- [ ] Minimum cluster size
- [ ] Prevent exact location reveal
- [ ] Cluster at different zoom levels
- [ ] Hide single users at far zoom

**Micro Tasks:**
- [ ] Set MIN_CLUSTER_SIZE = 3
- [ ] Only show clusters with 3+ users
- [ ] Don't show exact markers
- [ ] Implement zoom-based clustering
- [ ] Hide individuals at zoom < 14
- [ ] Add noise to cluster centers
- [ ] Detect stalking behavior
- [ ] Rate limit map queries

#### Feature 5.3: Interactive Map Features
- [ ] Click cluster to zoom
- [ ] Hover to see count
- [ ] Filter on map
- [ ] Draw radius circle

**Micro Tasks:**
- [ ] Implement map clustering UI
- [ ] Add onClick handler for clusters
- [ ] Zoom to cluster bounds
- [ ] Show tooltip with user count
- [ ] Add filter controls overlay
- [ ] Draw circle for max distance
- [ ] Allow dragging circle
- [ ] Update results on circle change

#### Feature 5.4: Heat Map
- [ ] Activity heat map
- [ ] Time-based heat map
- [ ] Popular areas highlight

**Micro Tasks:**
- [ ] Generate grid of lat/lon points
- [ ] Count users in each grid cell
- [ ] Return density values
- [ ] Add time_of_day parameter
- [ ] Filter by last_seen hour
- [ ] Highlight cells with density > threshold
- [ ] Add gradient color scale
- [ ] Cache heat map per city

---

## Phase 6: Real-time Chat

**Status**: 🔄 IN PROGRESS (Base structure done)

### Macro: Messaging System

#### Feature 6.1: Conversation Management
- [x] List conversations
- [x] Get messages
- [ ] Search conversations
- [ ] Archive conversation
- [ ] Delete conversation
- [ ] Pin conversation

**Micro Tasks:**
- [x] Create GET /api/chat/conversations
- [x] Create GET /api/chat/conversations/:userId/messages
- [x] Show last message preview
- [x] Show unread count
- [ ] Add full-text search on messages
- [ ] Create ConversationState model
- [ ] Add archived flag
- [ ] Filter archived from list
- [ ] Add pinned flag
- [ ] Sort pinned first

#### Feature 6.2: Sending Messages
- [x] Send text message
- [ ] Send image
- [ ] Send video
- [ ] Send audio message
- [ ] Send location
- [ ] Send GIF
- [ ] Message encryption

**Micro Tasks:**
- [x] Create POST /api/chat/conversations/:userId/messages
- [x] Store encrypted content
- [x] Emit WebSocket event to recipient
- [ ] Add image upload endpoint
- [ ] Resize images (max 2048px)
- [ ] Store in MinIO
- [ ] Add video upload endpoint
- [ ] Compress videos
- [ ] Add audio recording
- [ ] Store audio in MinIO
- [ ] Add location sharing
- [ ] Integrate GIPHY API
- [ ] Implement E2E encryption (Phase 14)

#### Feature 6.3: Message Features
- [x] Mark as read
- [ ] Typing indicators
- [ ] Edit message
- [ ] React to message (emoji)
- [ ] Reply to specific message
- [ ] Forward message
- [ ] Message expiration

**Micro Tasks:**
- [x] Update read_at on message view
- [x] Emit read receipt via WebSocket
- [ ] WebSocket event: chat:typing
- [ ] Throttle typing events (3s)
- [ ] Add edited_at timestamp
- [ ] Create PATCH /api/chat/messages/:id
- [ ] Create MessageReaction model
- [ ] Add POST /api/chat/messages/:id/react
- [ ] Add reply_to_id field
- [ ] Fetch replied message
- [ ] Add forward functionality
- [ ] Add expires_at timestamp
- [ ] Auto-delete job for expired messages

#### Feature 6.4: Rich Media
- [ ] Image preview/lightbox
- [ ] Video player
- [ ] Audio player
- [ ] Link preview
- [ ] File sharing

**Micro Tasks:**
- [ ] Generate image thumbnails
- [ ] Add zoom/pan for images
- [ ] Implement video player controls
- [ ] Add playback progress
- [ ] Implement audio waveform
- [ ] Add play/pause controls
- [ ] Scrape Open Graph tags
- [ ] Show link title/description/image
- [ ] Add generic file upload
- [ ] Limit file size (50MB)
- [ ] Scan files for malware

#### Feature 6.5: Moderation
- [ ] Report message
- [ ] Delete message
- [ ] Unsend message
- [ ] Screenshot detection (mobile)

**Micro Tasks:**
- [x] Create DELETE /api/chat/messages/:id
- [x] Set deleted_at timestamp
- [ ] Add report_reason field
- [ ] Create POST /api/chat/messages/:id/report
- [ ] Allow unsend within 1 hour
- [ ] Emit WebSocket event on unsend
- [ ] Detect screenshot on mobile
- [ ] Notify sender on screenshot
- [ ] Add screenshot count

---

## Phase 7: Love Mode - Matching

**Status**: 🔄 IN PROGRESS (Base structure done)

### Macro: Compatibility-Based Matching

#### Feature 7.1: Matching Algorithm
- [ ] Calculate compatibility score
- [ ] Interest-based matching
- [ ] Values-based matching
- [ ] Goal-based matching
- [ ] Collaborative filtering

**Micro Tasks:**
- [ ] Create matching algorithm service
- [ ] Define interest categories
- [ ] Weight interests (0-1)
- [ ] Calculate Jaccard similarity
- [ ] Define value categories
- [ ] Weight values higher (2x)
- [ ] Parse relationship goals
- [ ] Score goal compatibility
- [ ] Implement user-based CF
- [ ] Find similar users
- [ ] Combine scores (weighted average)
- [ ] Store in compatibility_score

#### Feature 7.2: Match Generation
- [ ] Daily match batch
- [ ] Smart matching queue
- [ ] Rematch prevention
- [ ] Match expiration

**Micro Tasks:**
- [ ] Create cron job (daily 6am)
- [ ] Find users in same area
- [ ] Filter already matched
- [ ] Run compatibility algorithm
- [ ] Create top 10 matches per user
- [ ] Set status = ACTIVE
- [ ] Emit match notification
- [ ] Add matched_at timestamp
- [ ] Add expires_at (30 days)
- [ ] Auto-expire old matches

#### Feature 7.3: Match Discovery
- [x] Get matches list
- [ ] Match suggestions
- [ ] Like/pass system
- [ ] Mutual like = instant match
- [ ] Undo last pass

**Micro Tasks:**
- [x] Create GET /api/matches
- [x] Filter by unlock level
- [x] Progressive disclosure logic
- [ ] Create GET /api/matches/suggestions
- [ ] Add POST /api/matches/suggestions/:id/like
- [ ] Add POST /api/matches/suggestions/:id/pass
- [ ] Check if both liked
- [ ] Create match on mutual like
- [ ] Store last_action in cache
- [ ] Implement undo (1 minute window)

#### Feature 7.4: Match Filters
- [ ] Age range preference
- [ ] Distance preference
- [ ] Looking for preference
- [ ] Deal breakers

**Micro Tasks:**
- [ ] Add MatchPreferences model
- [ ] Add min_age, max_age fields
- [ ] Add max_distance field
- [ ] Add looking_for filter
- [ ] Add deal_breakers array
- [ ] Filter matches by preferences
- [ ] Create GET/PATCH /api/users/me/match-preferences
- [ ] Show why matched (shared interests)

---

## Phase 8: Love Mode - Progressive Unlocking

**Status**: 🔄 IN PROGRESS (Base structure done)

### Macro: Gamified Profile Revelation

#### Feature 8.1: Unlock Level 1 (Matched)
- [x] Show match notification
- [x] Show compatibility score
- [ ] Show initials only
- [ ] Show silhouette avatar
- [ ] Show one random interest

**Micro Tasks:**
- [x] Set unlockLevel = MATCHED on create
- [x] Return compatibility score
- [x] Extract initials from displayName
- [ ] Generate silhouette image
- [ ] Randomly select 1 interest
- [ ] Add "mysterious match" flavor text
- [ ] Show unlock progress bar

#### Feature 8.2: Unlock Level 2 (Personality)
- [x] Unlock via conversation
- [ ] Unlock via game completion
- [ ] Unlock via time (3 days)
- [ ] Show full name, age, bio
- [ ] Show all interests and values

**Micro Tasks:**
- [x] Track message count per match
- [ ] Unlock at 20 messages
- [x] Create UnlockAction on unlock
- [ ] Check game_participations
- [ ] Unlock on game complete
- [ ] Check days since match
- [ ] Auto-unlock after 3 days
- [ ] Return full personality data
- [ ] Show unlock animation

#### Feature 8.3: Unlock Level 3 (Photos)
- [ ] Unlock via games (2+ complete)
- [ ] Unlock via voice message
- [ ] Unlock via video call
- [ ] Unlock via mutual unlock request
- [ ] Show all photos

**Micro Tasks:**
- [ ] Count completed games
- [ ] Unlock at 2 games
- [ ] Detect voice message sent
- [ ] Unlock on voice exchange
- [ ] Detect video call (5+ min)
- [ ] Unlock post-call
- [ ] Add unlock request button
- [ ] Create UnlockRequest model
- [ ] Unlock on both request
- [ ] Return all photo URLs
- [ ] Show photo reveal animation

#### Feature 8.4: Unlock Level 4 (Full Access)
- [ ] Unlock via extended engagement
- [ ] Unlock via in-person meeting verification
- [ ] Show location (if shared)
- [ ] Show full profile

**Micro Tasks:**
- [ ] Track total interactions
- [ ] Unlock at 100 interactions
- [ ] Add "met in person" button
- [ ] Both must confirm meeting
- [ ] Unlock on confirmation
- [ ] Show approximate location
- [ ] Show all profile fields
- [ ] Add to "fully unlocked" list

#### Feature 8.5: Unlock Mechanics
- [x] Track unlock actions
- [ ] Show unlock progress
- [ ] Unlock notifications
- [ ] Unlock achievements

**Micro Tasks:**
- [x] Create UnlockAction on each unlock
- [ ] Calculate progress per level
- [ ] Show progress percentage
- [ ] Emit WebSocket event on unlock
- [ ] Push notification for unlock
- [ ] Create Achievement model
- [ ] Award badges (Fast Unlocker, etc.)
- [ ] Show achievements on profile

---

## Phase 9: Love Mode - Interactive Games

**Status**: 📋 PLANNED

### Macro: Engagement Gamification

#### Feature 9.1: 20 Questions Game
- [ ] Game initialization
- [ ] Question selection
- [ ] Answer submission
- [ ] Scoring
- [ ] Completion rewards

**Micro Tasks:**
- [ ] Create Question bank (200+ questions)
- [ ] Categorize (personal, values, fun, deep)
- [ ] Create POST /api/matches/:id/games/20_questions/start
- [ ] Randomly select 20 questions
- [ ] Store in GameParticipation.gameData
- [ ] Create POST /api/matches/:id/games/20_questions/answer
- [ ] Validate answer format
- [ ] Store answers in gameData
- [ ] Calculate compatibility from answers
- [ ] Award 50 points on completion
- [ ] Trigger Level 2 unlock

#### Feature 9.2: Would You Rather Game
- [ ] Scenario database
- [ ] Present scenarios
- [ ] Reveal matches
- [ ] Scoring based on agreement

**Micro Tasks:**
- [ ] Create Scenario bank (100+ scenarios)
- [ ] Create game start endpoint
- [ ] Randomly select 10 scenarios
- [ ] Create answer endpoint
- [ ] Store A or B choice
- [ ] Compare with match's answers
- [ ] Show agreement percentage
- [ ] Award points for matches
- [ ] Award 30 points on completion

#### Feature 9.3: Two Truths and a Lie
- [ ] User submission
- [ ] Guessing mechanic
- [ ] Reveal truth
- [ ] Points for correct guess

**Micro Tasks:**
- [ ] Create submission form
- [ ] Validate 3 statements
- [ ] Store in gameData
- [ ] Notify match to guess
- [ ] Create guess endpoint
- [ ] Store guess
- [ ] Reveal correct answer
- [ ] Award 20 points for correct
- [ ] Award 40 points on completion

#### Feature 9.4: Compatibility Quiz
- [ ] Question categories
- [ ] Multi-choice questions
- [ ] Calculate match score
- [ ] Detailed results

**Micro Tasks:**
- [ ] Create 50 compatibility questions
- [ ] Categories: lifestyle, values, intimacy, future
- [ ] Create quiz start endpoint
- [ ] Present all questions
- [ ] Create submit endpoint
- [ ] Calculate category scores
- [ ] Compare with match's answers
- [ ] Generate compatibility report
- [ ] Show strengths and potential conflicts
- [ ] Award 60 points on completion

#### Feature 9.5: Icebreaker Prompts
- [ ] Daily prompts
- [ ] Shared prompt responses
- [ ] Reaction system

**Micro Tasks:**
- [ ] Create 365 daily prompts
- [ ] Rotate daily
- [ ] Create POST /api/matches/:id/prompts/:promptId/respond
- [ ] Store response
- [ ] Show match's response
- [ ] Add reaction (emoji)
- [ ] Award 10 points per prompt

#### Feature 9.6: Voice Challenges
- [ ] Record voice message
- [ ] Prompt-based recordings
- [ ] Playback
- [ ] Voice verification

**Micro Tasks:**
- [ ] Add voice recording UI
- [ ] Upload to MinIO
- [ ] Create voice message type
- [ ] Send via chat
- [ ] Create voice prompts (10+)
- [ ] "Tell me about your day"
- [ ] "What makes you laugh?"
- [ ] Trigger Level 3 unlock on exchange

---

## Phase 10: Media & Photos

**Status**: 📋 PLANNED

### Macro: Visual Content Management

#### Feature 10.1: Photo Upload
- [ ] Single photo upload
- [ ] Multi-photo upload
- [ ] Drag & drop interface
- [ ] Progress indicator

**Micro Tasks:**
- [ ] Set up multer middleware
- [ ] Configure file size limit (10MB)
- [ ] Validate image types (jpg, png, webp)
- [ ] Create POST /api/users/me/photos
- [ ] Upload to MinIO
- [ ] Generate unique filename
- [ ] Store URL in Profile.photos array
- [ ] Return photo URL
- [ ] Show upload progress
- [ ] Handle upload errors

#### Feature 10.2: Photo Processing
- [ ] Image resizing
- [ ] Thumbnail generation
- [ ] Format conversion
- [ ] EXIF data removal

**Micro Tasks:**
- [ ] Install sharp library
- [ ] Resize to max 2048x2048
- [ ] Generate thumbnail (300x300)
- [ ] Generate medium (800x800)
- [ ] Convert all to WebP
- [ ] Strip EXIF metadata
- [ ] Remove GPS coordinates
- [ ] Store multiple sizes
- [ ] Serve appropriate size

#### Feature 10.3: Photo Management
- [ ] Reorder photos
- [ ] Set primary photo
- [ ] Delete photo
- [ ] Photo albums

**Micro Tasks:**
- [x] Create DELETE /api/users/me/photos/:photoId
- [ ] Remove from photos array
- [ ] Delete from MinIO
- [ ] Create PATCH /api/users/me/photos/reorder
- [ ] Update photos array order
- [ ] Set photos[0] as primary
- [ ] Update avatarUrl
- [ ] Create Album model
- [ ] Create public/private albums
- [ ] Share album with specific users

#### Feature 10.4: Photo Verification
- [ ] Submit verification photo
- [ ] AI face matching
- [ ] Manual review queue
- [ ] Verification badge

**Micro Tasks:**
- [ ] Create verification instructions
- [ ] Require specific pose (thumbs up)
- [ ] Upload verification photo
- [ ] Store in verificationPhotoUrl
- [ ] Integrate face-api.js
- [ ] Extract face descriptors
- [ ] Compare with profile photos
- [ ] Calculate similarity score
- [ ] Auto-approve if > 0.6 similarity
- [ ] Queue for manual review if uncertain
- [ ] Admin review interface
- [ ] Set verificationStatus = VERIFIED
- [ ] Show checkmark badge

#### Feature 10.5: Media Moderation
- [ ] NSFW detection
- [ ] Auto-blur NSFW content
- [ ] Report photo
- [ ] Takedown system

**Micro Tasks:**
- [ ] Integrate NSFW detection API
- [ ] Score each uploaded image
- [ ] Add nsfw_score field
- [ ] Auto-blur if score > 0.7
- [ ] Add "view NSFW" toggle
- [ ] Create PhotoReport model
- [ ] Create POST /api/photos/:id/report
- [ ] Manual review queue
- [ ] Takedown confirmed violations
- [ ] Ban users with repeated violations

---

## Phase 11: Safety & Moderation

**Status**: 🔄 IN PROGRESS (Base structure done)

### Macro: User Safety & Content Moderation

#### Feature 11.1: Reporting System
- [x] Report user
- [ ] Report message
- [ ] Report photo
- [ ] Report profile content
- [ ] Report categories

**Micro Tasks:**
- [x] Create POST /api/moderation/reports
- [x] Store reporter, reported user, reason
- [ ] Add report_type field (user, message, photo)
- [ ] Add reference_id for reported item
- [ ] Define categories: spam, harassment, fake, inappropriate, underage, violence
- [ ] Add screenshots/evidence upload
- [ ] Deduplicate reports
- [ ] Create alert for high report volume

#### Feature 11.2: Moderation Queue
- [ ] Admin dashboard
- [ ] Review reported content
- [ ] Approve/reject actions
- [ ] Ban user
- [ ] Warning system

**Micro Tasks:**
- [ ] Create admin authentication
- [ ] Create GET /admin/reports
- [ ] Filter by status (pending, reviewed, resolved)
- [ ] Show report details
- [ ] Show user history
- [ ] Create PATCH /admin/reports/:id/review
- [ ] Add reviewer notes
- [ ] Create POST /admin/users/:id/warn
- [ ] Track warning count
- [ ] Auto-ban at 3 warnings
- [ ] Create POST /admin/users/:id/ban
- [ ] Set user.banned = true

#### Feature 11.3: Content Filtering
- [ ] Profanity filter
- [ ] Hate speech detection
- [ ] Spam detection
- [ ] Auto-moderation rules

**Micro Tasks:**
- [ ] Install bad-words library
- [ ] Filter messages for profanity
- [ ] Replace with asterisks
- [ ] Create hate speech keyword list
- [ ] Flag messages for review
- [ ] Detect spam patterns (repeated messages)
- [ ] Rate limit messages (10/min)
- [ ] Detect copypasta
- [ ] Auto-delete obvious spam
- [ ] Create moderation rules engine

#### Feature 11.4: Safety Features
- [x] Block user
- [ ] Mute user
- [ ] Share location with friend
- [ ] Emergency contact
- [ ] Safety check-in

**Micro Tasks:**
- [x] Block prevents all interaction
- [ ] Create Mute model
- [ ] Mute hides messages without blocking
- [ ] Add "share date location" feature
- [ ] Create ShareLocation model
- [ ] Send location link to friend
- [ ] Add emergency_contact_id field
- [ ] Auto-notify on panic button
- [ ] Create check-in reminder
- [ ] Auto-alert if no check-in

#### Feature 11.5: Safety Resources
- [x] Safety tips
- [ ] Crisis hotlines
- [ ] STI resources
- [ ] Consent education
- [ ] Community guidelines

**Micro Tasks:**
- [x] Create GET /api/moderation/safety
- [x] Return safety tips array
- [x] Return crisis hotlines
- [ ] Add links to STI testing centers
- [ ] Add educational content
- [ ] Create consent guide
- [ ] Create community guidelines page
- [ ] Require acceptance on signup
- [ ] In-app safety center

---

## Phase 12: Mobile App (React Native)

**Status**: 📋 PLANNED

### Macro: iOS & Android Application

#### Feature 12.1: Project Setup
- [ ] Initialize React Native project
- [ ] Configure TypeScript
- [ ] Set up navigation
- [ ] Configure state management
- [ ] Set up API client

**Micro Tasks:**
- [ ] Run `npx react-native init mobile`
- [ ] Add TypeScript support
- [ ] Install React Navigation
- [ ] Configure stack navigator
- [ ] Configure tab navigator
- [ ] Install Zustand
- [ ] Install React Query
- [ ] Create API client (axios)
- [ ] Add auth interceptor
- [ ] Add token refresh logic

#### Feature 12.2: Authentication Screens
- [ ] Splash screen
- [ ] Onboarding screens
- [ ] Login screen
- [ ] Registration screen
- [ ] Email verification
- [ ] Forgot password

**Micro Tasks:**
- [ ] Design splash screen
- [ ] Add app logo animation
- [ ] Create 3-5 onboarding slides
- [ ] Create LoginScreen component
- [ ] Add email/password inputs
- [ ] Add form validation
- [ ] Create RegisterScreen component
- [ ] Add multi-step form
- [ ] Create VerificationScreen
- [ ] Add OTP input
- [ ] Create ForgotPasswordScreen

#### Feature 12.3: Main Navigation
- [ ] Bottom tab navigation
- [ ] Discover tab
- [ ] Matches tab
- [ ] Messages tab
- [ ] Profile tab

**Micro Tasks:**
- [ ] Configure bottom tabs
- [ ] Add icons for each tab
- [ ] Add badge for unread messages
- [ ] Create DiscoverScreen
- [ ] Create MatchesScreen
- [ ] Create MessagesScreen
- [ ] Create ProfileScreen
- [ ] Add smooth transitions

#### Feature 12.4: Discover (Grid View)
- [ ] Grid layout
- [ ] Profile cards
- [ ] Infinite scroll
- [ ] Pull to refresh
- [ ] Filters modal

**Micro Tasks:**
- [ ] Use FlatList for grid
- [ ] Set numColumns={2}
- [ ] Create ProfileCard component
- [ ] Show photo, name, age, distance
- [ ] Add onEndReached for pagination
- [ ] Add RefreshControl
- [ ] Create FiltersModal component
- [ ] Age range slider
- [ ] Distance slider
- [ ] Multi-select filters

#### Feature 12.5: Discover (Map View)
- [ ] Map integration
- [ ] User markers
- [ ] Clustering
- [ ] Current location
- [ ] Filter overlay

**Micro Tasks:**
- [ ] Install react-native-maps
- [ ] Add MapView component
- [ ] Get user's current location
- [ ] Add markers for users
- [ ] Implement marker clustering
- [ ] Custom marker icons
- [ ] Add filter controls
- [ ] Add radius circle

#### Feature 12.6: Profile View
- [ ] Photo gallery/carousel
- [ ] Profile information
- [ ] Action buttons
- [ ] About section
- [ ] Interests chips

**Micro Tasks:**
- [ ] Create ProfileViewScreen
- [ ] Add image carousel (Swiper)
- [ ] Show all photos
- [ ] Display name, age, distance
- [ ] Add Message button
- [ ] Add Favorite button
- [ ] Add Block button
- [ ] Show bio
- [ ] Show interests as chips
- [ ] Show last active

#### Feature 12.7: Messaging
- [ ] Conversation list
- [ ] Chat screen
- [ ] Message bubbles
- [ ] Input bar
- [ ] Media picker

**Micro Tasks:**
- [ ] Create ConversationListScreen
- [ ] Show last message, time
- [ ] Show unread badge
- [ ] Create ChatScreen
- [ ] Use GiftedChat library
- [ ] Implement custom message bubbles
- [ ] Add typing indicator
- [ ] Create InputToolbar
- [ ] Add image picker
- [ ] Add camera integration

#### Feature 12.8: Real-time Updates
- [ ] WebSocket connection
- [ ] New message notifications
- [ ] Match notifications
- [ ] Presence updates

**Micro Tasks:**
- [ ] Install socket.io-client
- [ ] Connect on app launch
- [ ] Store connection in context
- [ ] Listen for 'message:new'
- [ ] Update conversation list
- [ ] Show in-app notification
- [ ] Listen for 'match:new'
- [ ] Show match modal
- [ ] Listen for 'presence:update'
- [ ] Update online indicators

#### Feature 12.9: Push Notifications
- [ ] FCM setup (Android)
- [ ] APNs setup (iOS)
- [ ] Notification permissions
- [ ] Handle notifications

**Micro Tasks:**
- [ ] Install @react-native-firebase/messaging
- [ ] Configure Firebase project
- [ ] Request notification permission
- [ ] Get FCM token
- [ ] Send token to backend
- [ ] Create Notification model
- [ ] Send notifications for new messages
- [ ] Send notifications for matches
- [ ] Handle notification tap
- [ ] Navigate to relevant screen

#### Feature 12.10: Location Services
- [ ] Location permissions
- [ ] Background location
- [ ] Location updates
- [ ] Location accuracy

**Micro Tasks:**
- [ ] Install @react-native-community/geolocation
- [ ] Request location permission
- [ ] Get current position
- [ ] Set up geofencing
- [ ] Configure background location
- [ ] Send location updates to API
- [ ] Throttle updates (30s)
- [ ] Show accuracy indicator

#### Feature 12.11: Profile Management
- [ ] Edit profile screen
- [ ] Photo upload
- [ ] Settings screen
- [ ] Preferences

**Micro Tasks:**
- [ ] Create EditProfileScreen
- [ ] Add form fields
- [ ] Add photo picker
- [ ] Crop images
- [ ] Upload multiple photos
- [ ] Create SettingsScreen
- [ ] Add privacy toggles
- [ ] Add notification settings
- [ ] Add account settings
- [ ] Add logout button

#### Feature 12.12: Love Mode Features
- [ ] Matches list
- [ ] Progressive reveal UI
- [ ] Games interface
- [ ] Unlock animations

**Micro Tasks:**
- [ ] Create MatchesListScreen
- [ ] Show unlock progress
- [ ] Create blurred photo effect
- [ ] Create UnlockAnimation component
- [ ] Create GamesScreen
- [ ] List available games
- [ ] Create 20QuestionsGame component
- [ ] Create WouldYouRatherGame component
- [ ] Show completion rewards

---

## Phase 13: Web App & PWA

**Status**: 📋 PLANNED

### Macro: Web Application

#### Feature 13.1: Project Setup
- [ ] Initialize React + Vite
- [ ] Configure TypeScript
- [ ] Set up routing
- [ ] Configure state management
- [ ] Set up API client

**Micro Tasks:**
- [ ] Run `npm create vite@latest web -- --template react-ts`
- [ ] Install React Router
- [ ] Install Zustand
- [ ] Install TanStack Query
- [ ] Create API client
- [ ] Add axios interceptors
- [ ] Configure base URL

#### Feature 13.2: Responsive Design
- [ ] Mobile breakpoints
- [ ] Tablet breakpoints
- [ ] Desktop layout
- [ ] Touch & click optimization

**Micro Tasks:**
- [ ] Install Tailwind CSS
- [ ] Configure breakpoints (sm, md, lg, xl)
- [ ] Create responsive grid layouts
- [ ] Use mobile-first approach
- [ ] Add touch gestures for mobile
- [ ] Add hover states for desktop
- [ ] Test on all screen sizes

#### Feature 13.3: PWA Configuration
- [ ] Service worker
- [ ] Web manifest
- [ ] Offline support
- [ ] Install prompt
- [ ] App icons

**Micro Tasks:**
- [ ] Install Workbox
- [ ] Create service worker
- [ ] Cache API responses
- [ ] Cache static assets
- [ ] Create manifest.json
- [ ] Add app name, description
- [ ] Add icon sizes (192, 512)
- [ ] Add theme color
- [ ] Show install banner
- [ ] Handle A2HS event

#### Feature 13.4: Core Pages
- [ ] Landing page
- [ ] Login/register
- [ ] Discover page
- [ ] Matches page
- [ ] Messages page
- [ ] Profile page

**Micro Tasks:**
- [ ] Create LandingPage component
- [ ] Add hero section
- [ ] Add features section
- [ ] Add CTA buttons
- [ ] Create AuthPage component
- [ ] Toggle login/register
- [ ] Create DiscoverPage
- [ ] Desktop: split view (list + detail)
- [ ] Mobile: single view
- [ ] Create MatchesPage
- [ ] Create MessagesPage
- [ ] Create ProfilePage

#### Feature 13.5: Map Integration
- [ ] Mapbox GL JS integration
- [ ] Map controls
- [ ] Custom markers
- [ ] Clustering

**Micro Tasks:**
- [ ] Install mapbox-gl
- [ ] Add access token
- [ ] Create MapView component
- [ ] Add navigation controls
- [ ] Add geolocate control
- [ ] Create custom marker SVGs
- [ ] Implement marker clustering
- [ ] Add popup on marker click

#### Feature 13.6: Real-time Features
- [ ] WebSocket connection
- [ ] Live updates
- [ ] Notifications

**Micro Tasks:**
- [ ] Connect to Socket.io
- [ ] Reconnect on disconnect
- [ ] Listen for events
- [ ] Update UI on new message
- [ ] Update UI on new match
- [ ] Show toast notifications
- [ ] Play notification sound

#### Feature 13.7: Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] ARIA labels
- [ ] Color contrast

**Micro Tasks:**
- [ ] Add tabindex to interactive elements
- [ ] Add focus styles
- [ ] Add ARIA labels
- [ ] Add alt text to images
- [ ] Use semantic HTML
- [ ] Test with NVDA/JAWS
- [ ] Check color contrast (WCAG AA)
- [ ] Add skip to content link

---

## Phase 14: Advanced Privacy & Security

**Status**: 📋 PLANNED

### Macro: Enhanced Privacy Features

#### Feature 14.1: End-to-End Encryption
- [ ] Signal Protocol implementation
- [ ] Key exchange
- [ ] Message encryption
- [ ] Media encryption

**Micro Tasks:**
- [ ] Research libsignal-protocol-javascript
- [ ] Generate identity key pair
- [ ] Generate signed pre-key
- [ ] Generate one-time pre-keys
- [ ] Upload pre-keys to server
- [ ] Implement X3DH key agreement
- [ ] Implement Double Ratchet
- [ ] Encrypt message before send
- [ ] Decrypt message on receive
- [ ] Encrypt media files
- [ ] Store encrypted locally

#### Feature 14.2: Privacy Modes
- [ ] Incognito mode
- [ ] Screenshot prevention
- [ ] View-once messages
- [ ] Disappearing messages

**Micro Tasks:**
- [ ] Add incognito_mode toggle
- [ ] Hide from discovery in incognito
- [ ] Don't save messages in incognito
- [ ] Prevent screenshots (Android)
- [ ] Detect screenshots (iOS)
- [ ] Add view_once flag to messages
- [ ] Delete after view
- [ ] Add expires_in field
- [ ] Auto-delete after time
- [ ] Add timer UI (5s, 30s, 1h, 1d)

#### Feature 14.3: Data Privacy
- [ ] Data encryption at rest
- [ ] Secure data deletion
- [ ] Data export (GDPR)
- [ ] Data retention policies

**Micro Tasks:**
- [ ] Encrypt sensitive fields in DB
- [ ] Use pgcrypto extension
- [ ] Implement secure deletion (overwrite)
- [ ] Create data export job
- [ ] Export all user data (JSON)
- [ ] Export messages
- [ ] Export photos
- [ ] Create ZIP file
- [ ] Define retention: messages (1 year), locations (30 days)
- [ ] Create cleanup jobs

#### Feature 14.4: Anonymity Features
- [ ] Anonymous profiles
- [ ] Disposable profiles
- [ ] No-trace mode
- [ ] Metadata stripping

**Micro Tasks:**
- [ ] Add anonymous flag
- [ ] Generate random display name
- [ ] Use generic avatar
- [ ] Create temporary profiles
- [ ] Auto-delete after 24h
- [ ] Enable no-trace mode
- [ ] Don't store messages
- [ ] Don't store location history
- [ ] Strip all EXIF from photos
- [ ] Strip metadata from videos

---

## Phase 15: Performance & Optimization

**Status**: 📋 PLANNED

### Macro: Speed & Efficiency

#### Feature 15.1: Database Optimization
- [ ] Query optimization
- [ ] Indexing strategy
- [ ] Connection pooling
- [ ] Read replicas

**Micro Tasks:**
- [ ] Analyze slow queries
- [ ] Add EXPLAIN ANALYZE
- [ ] Optimize N+1 queries
- [ ] Add composite indexes
- [ ] Index foreign keys
- [ ] Configure Prisma pool size
- [ ] Set up PgBouncer
- [ ] Configure read replicas
- [ ] Route read queries to replicas

#### Feature 15.2: Caching Strategy
- [ ] Redis caching
- [ ] Cache invalidation
- [ ] CDN for media
- [ ] Browser caching

**Micro Tasks:**
- [ ] Cache user profiles (5min)
- [ ] Cache discovery results (1min)
- [ ] Cache heat map (5min)
- [ ] Implement cache-aside pattern
- [ ] Add cache invalidation on updates
- [ ] Set up CloudFlare/Fastly
- [ ] Cache photos on CDN
- [ ] Set Cache-Control headers
- [ ] Configure ETag headers

#### Feature 15.3: API Optimization
- [ ] Response compression
- [ ] Pagination
- [ ] Field selection
- [ ] Rate limiting

**Micro Tasks:**
- [ ] Enable gzip compression
- [ ] Implement cursor pagination
- [ ] Add GraphQL layer (optional)
- [ ] Add `fields` query param
- [ ] Return only requested fields
- [ ] Implement token bucket
- [ ] Different limits per endpoint
- [ ] Return rate limit headers

#### Feature 15.4: Frontend Performance
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Bundle size reduction

**Micro Tasks:**
- [ ] Use React.lazy()
- [ ] Split by route
- [ ] Lazy load components
- [ ] Use Intersection Observer
- [ ] Implement virtual scrolling
- [ ] Use WebP images
- [ ] Responsive images (srcset)
- [ ] Tree-shake unused code
- [ ] Analyze bundle with Webpack Bundle Analyzer

#### Feature 15.5: Mobile Performance
- [ ] App size optimization
- [ ] Memory management
- [ ] Battery optimization
- [ ] Network efficiency

**Micro Tasks:**
- [ ] Use Hermes engine (Android)
- [ ] Enable Proguard
- [ ] Reduce APK/IPA size
- [ ] Profile memory usage
- [ ] Fix memory leaks
- [ ] Throttle background tasks
- [ ] Reduce location update frequency
- [ ] Batch API requests
- [ ] Implement retry with backoff

---

## Phase 16: Analytics & Insights

**Status**: 📋 PLANNED

### Macro: Data & Metrics

#### Feature 16.1: User Analytics (Privacy-Preserving)
- [ ] Active users tracking
- [ ] Engagement metrics
- [ ] Retention analysis
- [ ] Funnel analysis

**Micro Tasks:**
- [ ] Track DAU/MAU (no PII)
- [ ] Track session duration
- [ ] Track feature usage
- [ ] Calculate retention rate
- [ ] Day 1, 7, 30 retention
- [ ] Track signup funnel
- [ ] Track onboarding completion
- [ ] Track message funnel
- [ ] Use local analytics (no third-party)

#### Feature 16.2: Platform Health
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] API latency

**Micro Tasks:**
- [ ] Set up Sentry (optional)
- [ ] Track error rates
- [ ] Track crash rates
- [ ] Set up APM tool
- [ ] Monitor endpoint latency
- [ ] Monitor database query time
- [ ] Set up health checks
- [ ] Monitor uptime
- [ ] Set up alerts

#### Feature 16.3: Business Metrics
- [ ] Match success rate
- [ ] Message response rate
- [ ] Photo verification rate
- [ ] Report resolution time

**Micro Tasks:**
- [ ] Calculate matches per user
- [ ] Calculate mutual matches
- [ ] Track first message response
- [ ] Track conversation length
- [ ] Track verification completions
- [ ] Track report volume
- [ ] Track time to resolution
- [ ] Track moderator efficiency

---

## Phase 17: Notifications

**Status**: 📋 PLANNED

### Macro: User Engagement & Alerts

#### Feature 17.1: Push Notifications
- [ ] New message notifications
- [ ] New match notifications
- [ ] Unlock notifications
- [ ] Nearby user notifications

**Micro Tasks:**
- [ ] Set up FCM/APNs
- [ ] Create notification templates
- [ ] Send on new message
- [ ] Send on new match
- [ ] Send on unlock level up
- [ ] Detect nearby users
- [ ] Send proximity alert
- [ ] Add notification preferences
- [ ] Allow muting notifications

#### Feature 17.2: Email Notifications
- [ ] Welcome email
- [ ] Verification email
- [ ] Password reset email
- [ ] Weekly digest
- [ ] Re-engagement emails

**Micro Tasks:**
- [ ] Set up email service (SendGrid/SES)
- [ ] Create email templates (HTML)
- [ ] Send welcome email on signup
- [ ] Send verification link
- [ ] Send password reset link
- [ ] Generate weekly summary
- [ ] Send to inactive users (7 days)
- [ ] Add unsubscribe link
- [ ] Honor unsubscribe preferences

#### Feature 17.3: In-App Notifications
- [ ] Notification center
- [ ] Notification badges
- [ ] Toast notifications
- [ ] Activity feed

**Micro Tasks:**
- [ ] Create Notification model
- [ ] Create GET /api/notifications
- [ ] Mark as read endpoint
- [ ] Show badge count
- [ ] Clear on view
- [ ] Show toast on events
- [ ] Auto-dismiss (5s)
- [ ] Create activity feed
- [ ] "X viewed your profile"

---

## Phase 18: Premium Features (Optional)

**Status**: 📋 PLANNED

### Macro: Monetization (Optional for Self-Hosters)

#### Feature 18.1: Freemium Model
- [ ] Free tier definition
- [ ] Premium tier definition
- [ ] Feature gating
- [ ] Upgrade prompts

**Micro Tasks:**
- [ ] Add subscription_tier field
- [ ] Define free limits (20 messages/day)
- [ ] Define premium benefits
- [ ] Check tier before features
- [ ] Show upgrade modal
- [ ] Soft-paywall approach
- [ ] Allow self-hosters to disable

#### Feature 18.2: Payment Integration
- [ ] Stripe integration
- [ ] Subscription management
- [ ] Receipt generation
- [ ] Refund handling

**Micro Tasks:**
- [ ] Set up Stripe account
- [ ] Create products/prices
- [ ] Implement checkout flow
- [ ] Handle webhooks
- [ ] Update subscription_tier
- [ ] Generate invoices
- [ ] Email receipts
- [ ] Handle failed payments
- [ ] Process refund requests

#### Feature 18.3: Premium Features
- [ ] Unlimited messages
- [ ] See who viewed you
- [ ] Advanced filters
- [ ] Read receipts
- [ ] Rewind (undo pass)

**Micro Tasks:**
- [ ] Remove message limit for premium
- [ ] Create ProfileView tracking
- [ ] Show view list to premium
- [ ] Unlock all filters
- [ ] Add ethnicity, height filters
- [ ] Show read receipts
- [ ] Store last swipe action
- [ ] Allow undo within 5min

---

## Phase 19: Testing & Quality Assurance

**Status**: 📋 PLANNED

### Macro: Code Quality

#### Feature 19.1: Unit Testing
- [ ] Backend unit tests
- [ ] Frontend unit tests
- [ ] Test coverage (80%+)

**Micro Tasks:**
- [ ] Set up Jest
- [ ] Test auth controller
- [ ] Test discovery controller
- [ ] Test matching algorithm
- [ ] Test location utilities
- [ ] Set up React Testing Library
- [ ] Test UI components
- [ ] Test hooks
- [ ] Add coverage reporting
- [ ] Add coverage to CI

#### Feature 19.2: Integration Testing
- [ ] API integration tests
- [ ] Database integration tests
- [ ] WebSocket tests

**Micro Tasks:**
- [ ] Set up supertest
- [ ] Test auth flow end-to-end
- [ ] Test message sending
- [ ] Test match creation
- [ ] Set up test database
- [ ] Use transactions for tests
- [ ] Test WebSocket events
- [ ] Test reconnection logic

#### Feature 19.3: E2E Testing
- [ ] User flows testing
- [ ] Mobile E2E
- [ ] Web E2E

**Micro Tasks:**
- [ ] Set up Playwright
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test discovery flow
- [ ] Test messaging flow
- [ ] Set up Detox (React Native)
- [ ] Test mobile navigation
- [ ] Test mobile gestures

#### Feature 19.4: Security Testing
- [ ] Penetration testing
- [ ] Dependency scanning
- [ ] OWASP top 10 checks
- [ ] SQL injection tests

**Micro Tasks:**
- [ ] Run OWASP ZAP scan
- [ ] Test for XSS vulnerabilities
- [ ] Test for CSRF
- [ ] Test for SQL injection
- [ ] Set up Snyk/Dependabot
- [ ] Scan dependencies weekly
- [ ] Update vulnerable packages
- [ ] Conduct security audit

---

## Phase 20: Deployment & DevOps

**Status**: 🔄 IN PROGRESS (Docker done)

### Macro: Production Infrastructure

#### Feature 20.1: Container Orchestration
- [x] Docker Compose (development)
- [ ] Kubernetes setup (production)
- [ ] Helm charts
- [ ] Auto-scaling

**Micro Tasks:**
- [x] Create docker-compose.yml
- [ ] Create Kubernetes manifests
- [ ] Create deployment.yaml
- [ ] Create service.yaml
- [ ] Create ingress.yaml
- [ ] Package as Helm chart
- [ ] Configure HPA
- [ ] Set CPU/memory limits
- [ ] Configure cluster autoscaler

#### Feature 20.2: CI/CD Pipeline
- [ ] GitHub Actions
- [ ] Automated testing
- [ ] Automated deployment
- [ ] Rollback mechanism

**Micro Tasks:**
- [ ] Create .github/workflows/test.yml
- [ ] Run tests on PR
- [ ] Run linter
- [ ] Create .github/workflows/deploy.yml
- [ ] Deploy on merge to main
- [ ] Tag releases
- [ ] Deploy to staging first
- [ ] Manual approval for prod
- [ ] Implement blue-green deployment
- [ ] Add rollback script

#### Feature 20.3: Monitoring & Logging
- [ ] Centralized logging
- [ ] Metrics collection
- [ ] Alerting
- [ ] Dashboards

**Micro Tasks:**
- [ ] Set up ELK stack
- [ ] Ship logs to Elasticsearch
- [ ] Create Kibana dashboards
- [ ] Set up Prometheus
- [ ] Scrape metrics
- [ ] Set up Grafana
- [ ] Create system dashboard
- [ ] Configure alert rules
- [ ] Set up PagerDuty/Opsgenie
- [ ] Alert on high error rate

#### Feature 20.4: Backup & Recovery
- [ ] Database backups
- [ ] Object storage backups
- [ ] Disaster recovery plan
- [ ] Backup testing

**Micro Tasks:**
- [ ] Configure pg_dump cron
- [ ] Upload to S3
- [ ] Retain 30 days of backups
- [ ] Backup MinIO data
- [ ] Use MinIO replication
- [ ] Document recovery steps
- [ ] Create recovery scripts
- [ ] Test backup restoration monthly

#### Feature 20.5: Infrastructure as Code
- [ ] Terraform configuration
- [ ] Environment management
- [ ] Secret management

**Micro Tasks:**
- [ ] Create Terraform modules
- [ ] Define VPC, subnets
- [ ] Define RDS instance
- [ ] Define ElastiCache
- [ ] Define ECS/EKS cluster
- [ ] Create dev/staging/prod envs
- [ ] Use Terraform workspaces
- [ ] Set up Vault
- [ ] Rotate secrets
- [ ] Use encrypted env files

---

## Phase 21: Documentation

**Status**: 🔄 IN PROGRESS

### Macro: Knowledge Base

#### Feature 21.1: Developer Documentation
- [x] Architecture docs
- [ ] API reference
- [ ] Setup guides
- [ ] Contributing guide

**Micro Tasks:**
- [x] Write ARCHITECTURE.md
- [ ] Generate OpenAPI spec
- [ ] Create Postman collection
- [ ] Write API examples
- [ ] Document authentication
- [ ] Document rate limits
- [ ] Write setup guide (local)
- [ ] Write setup guide (production)
- [ ] Create CONTRIBUTING.md
- [ ] Define code style
- [ ] Define PR process

#### Feature 21.2: User Documentation
- [ ] User guide
- [ ] FAQ
- [ ] Privacy policy
- [ ] Terms of service

**Micro Tasks:**
- [ ] Write getting started guide
- [ ] Create feature tutorials
- [ ] Write safety guide
- [ ] Compile common questions
- [ ] Write detailed answers
- [ ] Draft privacy policy (GDPR compliant)
- [ ] Draft terms of service
- [ ] Review with legal counsel
- [ ] Create help center
- [ ] Add search function

#### Feature 21.3: Self-Hosting Documentation
- [ ] Installation guide
- [ ] Configuration guide
- [ ] Scaling guide
- [ ] Troubleshooting

**Micro Tasks:**
- [ ] Write Docker deployment guide
- [ ] Write Kubernetes deployment guide
- [ ] Document all env variables
- [ ] Write scaling strategies
- [ ] Document common issues
- [ ] Create FAQ for self-hosters
- [ ] Write upgrade guide

---

## Phase 22: Community & Growth

**Status**: 📋 PLANNED

### Macro: Community Building

#### Feature 22.1: Open Source Community
- [ ] GitHub discussions
- [ ] Discord server
- [ ] Contributor recognition
- [ ] Roadmap transparency

**Micro Tasks:**
- [ ] Enable GitHub Discussions
- [ ] Create discussion categories
- [ ] Set up Discord server
- [ ] Create channels (support, dev, ideas)
- [ ] Add contributors to README
- [ ] Create all-contributors bot
- [ ] Publish roadmap publicly
- [ ] Accept community input

#### Feature 22.2: Internationalization (i18n)
- [ ] Translation framework
- [ ] Language packs
- [ ] RTL support
- [ ] Localization

**Micro Tasks:**
- [ ] Set up i18next
- [ ] Extract all strings
- [ ] Create en.json
- [ ] Create translation workflow
- [ ] Recruit translators
- [ ] Support RTL languages
- [ ] Add dir="rtl" support
- [ ] Localize date/time
- [ ] Localize distance units

#### Feature 22.3: Marketing & Outreach
- [ ] Website/landing page
- [ ] Social media presence
- [ ] Blog/newsletter
- [ ] Press kit

**Micro Tasks:**
- [ ] Create landing page
- [ ] Write compelling copy
- [ ] Add screenshots/videos
- [ ] Create Twitter account
- [ ] Create Reddit community
- [ ] Post on ProductHunt
- [ ] Start blog
- [ ] Write launch post
- [ ] Create press kit
- [ ] Reach out to tech press

---

## Summary Statistics

**Total Phases:** 22
**Total Features:** ~180
**Total Micro Tasks:** ~800+

**Current Status:**
- ✅ Completed: ~60 tasks
- 🔄 In Progress: ~20 tasks
- 📋 Planned: ~720 tasks

**Estimated Timeline:**
- Phase 0-3 (Foundation): ✅ Complete
- Phase 4-11 (Core Features): 🔄 6-12 months
- Phase 12-13 (Mobile/Web): 📋 4-6 months
- Phase 14-20 (Advanced): 📋 6-9 months
- Phase 21-22 (Docs/Community): 🔄 Ongoing

**Total Estimated Timeline:** 18-24 months to production-ready v1.0

---

## Contribution Guide

Each task in this roadmap can be worked on independently by contributors:

1. **Pick a task** from any phase
2. **Create an issue** on GitHub referencing this roadmap
3. **Create a feature branch** (`feature/phase-X-feature-Y`)
4. **Implement the task** following the code style
5. **Write tests** for your code
6. **Submit a PR** with a clear description
7. **Request review** from maintainers

---

**Last Updated:** 2025-11-19
**Version:** 1.0
**Maintained By:** Anon Hookup Now Community
