# Anon Hookup Now - Architecture

## Project Overview
A free and open-source dating/hookup platform with dual interfaces:
1. **Hookup Mode**: Location-based discovery with grid (Grindr-style) and map (Sniffies-style) views
2. **Love Mode**: Progressive matching system where you unlock profiles through interaction

## Technology Stack

### Backend
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15+ with PostGIS extension (geospatial queries)
- **Cache/Sessions**: Redis
- **Real-time**: Socket.io (WebSocket with fallback)
- **Authentication**: JWT with refresh tokens
- **File Storage**: MinIO (S3-compatible, self-hostable)
- **Encryption**: libsodium for E2E encryption

### Mobile (iOS/Android)
- **Framework**: React Native with TypeScript
- **Navigation**: React Navigation
- **State Management**: Zustand + React Query
- **Maps**: React Native Maps
- **Real-time**: Socket.io client

### Web (PWA)
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand + React Query
- **Maps**: Leaflet or Mapbox GL JS
- **Styling**: Tailwind CSS
- **PWA**: Workbox for service workers

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Clients                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   iOS App    │  │  Android App │  │   Web/PWA    │      │
│  │ (React Native)│  │(React Native)│  │   (React)    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                   ┌─────────▼─────────┐
                   │   Load Balancer   │
                   │     (nginx)       │
                   └─────────┬─────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                      │
┌─────────▼─────────┐              ┌────────────▼────────────┐
│   REST API        │              │   WebSocket Server      │
│   (Express)       │              │   (Socket.io)           │
│                   │              │                         │
│ • Auth            │              │ • Real-time chat        │
│ • User profiles   │              │ • Location updates      │
│ • Matching        │              │ • Presence              │
│ • Discovery       │              │ • Notifications         │
└─────────┬─────────┘              └────────────┬────────────┘
          │                                      │
          └──────────────────┬───────────────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                      │
┌─────────▼─────────┐              ┌────────────▼────────────┐
│   PostgreSQL      │              │      Redis              │
│   + PostGIS       │              │                         │
│                   │              │ • Sessions              │
│ • User data       │              │ • Cache                 │
│ • Messages        │              │ • Pub/Sub               │
│ • Locations       │              │ • Rate limiting         │
│ • Matches         │              └─────────────────────────┘
└───────────────────┘
          │
┌─────────▼─────────┐
│   MinIO (S3)      │
│                   │
│ • Profile photos  │
│ • Chat media      │
│ • Albums          │
└───────────────────┘
```

## Core Features

### Hookup Mode (Anonymous/Quick)
1. **Grid View** (Grindr-inspired)
   - Infinite scroll of nearby users
   - Distance-based sorting
   - Quick filters (online now, pics, favorites)
   - Tap to view profile/chat

2. **Map View** (Sniffies-inspired)
   - Real-time user positions on map
   - Cluster markers for privacy
   - Heat map of activity
   - Zoom to reveal more detail
   - Anonymous mode (hide exact location)

3. **Discovery Features**
   - Location spoofing protection
   - Explore mode (browse other cities)
   - Filters: distance, age, body type, interests
   - Tribes/tags
   - NSFW content management

### Love Mode (Relationship-Focused)
1. **Progressive Matching**
   - Smart matching algorithm (interests, values, goals)
   - Compatibility scoring
   - Match first, reveal later

2. **Profile Unlocking System**
   - **Level 1**: Match notification (anonymous)
   - **Level 2**: Unlock personality/interests (via conversation)
   - **Level 3**: Unlock photos (via games/deeper chat)
   - **Level 4**: Full profile access
   - Gamification: earn unlocks through meaningful interaction

3. **Interactive Games**
   - 20 questions
   - Would you rather
   - Two truths and a lie
   - Compatibility quizzes
   - Voice message challenges

### Privacy & Security
1. **Authentication**
   - Email/password with verification
   - OAuth (Google, Apple)
   - Phone number verification (optional)
   - 2FA support

2. **Location Privacy**
   - Approximate distance only (no exact coords)
   - Location fuzzing/jittering
   - Invisible mode
   - Traveler mode (no location saved)

3. **End-to-End Encryption**
   - Signal protocol for messages
   - Encrypted media
   - Perfect forward secrecy

4. **Safety Features**
   - Photo verification
   - Report/block system
   - AI-based content moderation
   - Age verification
   - Safety tips/resources

## Database Schema (Core Tables)

```sql
-- Users
users (
  id, email, password_hash, phone, verified,
  created_at, last_seen, location (geography),
  mode (hookup/love/both)
)

-- Profiles
profiles (
  user_id, display_name, age, bio, photos[],
  preferences{}, interests[], tribe_tags[],
  visibility_settings{}
)

-- Matches (for love mode)
matches (
  id, user_a, user_b, compatibility_score,
  unlock_level (1-4), created_at, status
)

-- Messages
messages (
  id, sender_id, receiver_id, content_encrypted,
  type (text/image/audio), sent_at, read_at
)

-- Locations (spatial)
user_locations (
  user_id, location (geography POINT),
  accuracy_meters, updated_at
)

-- Blocks & Reports
blocks (user_id, blocked_user_id, created_at)
reports (reporter_id, reported_user_id, reason, status)
```

## API Endpoints (REST)

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/verify-phone` - Verify phone

### Users
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update profile
- `POST /api/users/me/photos` - Upload photo
- `DELETE /api/users/me/photos/:id` - Delete photo
- `POST /api/users/me/location` - Update location
- `POST /api/users/me/verify-photo` - Submit verification

### Discovery (Hookup Mode)
- `GET /api/discover/grid` - Grid view users
- `GET /api/discover/map` - Map view users
- `GET /api/users/:id/profile` - View user profile
- `POST /api/users/:id/favorite` - Favorite user
- `POST /api/users/:id/block` - Block user

### Matching (Love Mode)
- `GET /api/matches` - Get matches
- `POST /api/matches/:id/unlock` - Unlock next level
- `GET /api/matches/:id/games` - Get available games
- `POST /api/matches/:id/games/:game` - Play game

### Chat
- `GET /api/conversations` - List conversations
- `GET /api/conversations/:id/messages` - Get messages
- `POST /api/conversations/:id/messages` - Send message (metadata)
- `DELETE /api/messages/:id` - Delete message

### Moderation
- `POST /api/reports` - Report user/content
- `GET /api/safety/resources` - Get safety resources

## WebSocket Events

### Client → Server
- `presence:online` - Mark as online
- `location:update` - Update location
- `chat:typing` - Typing indicator
- `chat:read` - Mark as read

### Server → Client
- `match:new` - New match notification
- `message:new` - New message
- `profile:viewed` - Someone viewed you
- `nearby:update` - Nearby users changed

## Deployment

### Docker Compose Stack
```yaml
services:
  - api (Node.js backend)
  - postgres (with PostGIS)
  - redis
  - minio (S3 storage)
  - nginx (reverse proxy/load balancer)
```

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `JWT_SECRET` - JWT signing key
- `S3_*` - MinIO/S3 credentials
- `MAPBOX_TOKEN` - Map API key (optional)

## Development Phases

### Phase 1: Foundation (MVP)
- Backend API setup
- User auth & profiles
- Basic location discovery
- Simple chat
- Mobile app scaffold

### Phase 2: Hookup Mode
- Grid view implementation
- Map view implementation
- Advanced filters
- Photo sharing
- Location privacy controls

### Phase 3: Love Mode
- Matching algorithm
- Progressive unlock system
- Interactive games
- Compatibility scoring

### Phase 4: Polish & Safety
- E2E encryption
- Photo verification
- Moderation tools
- Web PWA
- Performance optimization

## License
GPL-3.0 (like GrindrPlus parent project)
