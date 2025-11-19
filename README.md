# Anon Hookup Now

> **🚀 New Project!** A free, open-source, privacy-focused dating and hookup platform

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](./docker-compose.yml)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](./backend)

---

## 📖 What is This?

**Anon Hookup Now** is a complete standalone dating and hookup platform that can be self-hosted. It combines the best features from popular apps like Grindr and Sniffies, while adding innovative relationship-building features.

### Dual Interface Design

#### 🔥 **Hookup Mode** (Quick & Anonymous)
Inspired by Grindr and Sniffies:
- **Grid View**: Scroll through nearby users
- **Map View**: See users on an interactive map
- Location-based discovery with privacy controls
- Quick messaging and photo sharing
- Anonymous mode with location fuzzing

#### ❤️ **Love Mode** (Relationship-Focused)
Progressive matching for deeper connections:
- Smart compatibility matching
- **Gamified Profile Unlocking**:
  1. Match first (anonymous)
  2. Unlock personality through conversation
  3. Unlock photos through games
  4. Full profile access
- Interactive games and quizzes
- Focus on meaningful relationships

---

## ✨ Key Features

### Privacy & Security
- 🔒 End-to-end encrypted messaging (planned)
- 📍 Location privacy with fuzzing
- 🎭 Anonymous mode
- ✅ Photo verification system
- 🚫 Block and report functionality

### Real-time Features
- ⚡ WebSocket-based live chat
- 💬 Typing indicators & read receipts
- 📍 Live location updates
- 🟢 Presence detection

### Cross-Platform
- 📱 iOS & Android (React Native) - *coming soon*
- 🌐 Web app with PWA support - *coming soon*
- 🖥️ Backend API - **available now**

### Self-Hostable
- 🐳 Docker Compose deployment
- ☁️ No cloud vendor lock-in
- 🔐 Full control over your data

---

## 🚀 Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Git

### Run with Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/ivi374forivi/anon-hookup-now.git
cd anon-hookup-now

# 2. Start all services
docker-compose up -d

# 3. Check logs
docker-compose logs -f backend

# 4. Access the API
curl http://localhost:3000/health
```

**Services will be running at:**
- 🌐 API: http://localhost:3000/api
- 🗄️ PostgreSQL: localhost:5432
- 📦 Redis: localhost:6379
- 💾 MinIO Console: http://localhost:9001

### Local Development

```bash
# Backend setup
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

---

## 📚 Documentation

- **[PROJECT_README.md](./PROJECT_README.md)** - Detailed project information
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and API docs
- **[Backend README](./backend/README.md)** - Backend-specific documentation *(coming soon)*

### API Examples

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123",
    "displayName": "Alex",
    "age": 25
  }'
```

**Discover nearby users:**
```bash
curl http://localhost:3000/api/discover/grid?limit=20 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete API documentation.

---

## 🛠️ Tech Stack

**Backend**
- Node.js 20 + TypeScript
- Express.js + Socket.io
- PostgreSQL + PostGIS
- Redis + MinIO

**Mobile** *(coming soon)*
- React Native
- TypeScript

**Web** *(coming soon)*
- React + Vite
- Tailwind CSS
- PWA

---

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (In Progress)
- [x] Backend API structure
- [x] Authentication & user profiles
- [x] Database schema with PostGIS
- [x] Docker deployment
- [x] WebSocket real-time features
- [ ] Basic discovery (grid view)
- [ ] Simple chat implementation
- [ ] Mobile app scaffold

### 📋 Phase 2: Hookup Mode
- [ ] Grid view UI
- [ ] Map view with clustering
- [ ] Advanced filters
- [ ] Photo upload/sharing
- [ ] Location privacy features

### 📋 Phase 3: Love Mode
- [ ] Matching algorithm
- [ ] Progressive unlock mechanics
- [ ] Interactive games
- [ ] Compatibility scoring

### 📋 Phase 4: Polish
- [ ] E2E encryption
- [ ] Photo verification
- [ ] Moderation tools
- [ ] Web PWA
- [ ] Performance optimization

---

## 🤝 Contributing

Contributions are welcome! This is a community-driven project.

### How to Help
- 💻 Code contributions
- 🎨 UI/UX design
- 🔒 Security auditing
- 📝 Documentation
- 🌍 Translation
- 🐛 Bug reports

See our [Contributing Guide](./CONTRIBUTING.md) *(coming soon)*

---

## 📜 License

This project is licensed under **GPL-3.0** - see [LICENSE](LICENSE) for details.

This ensures the software remains free and open-source forever.

---

## 🙏 Acknowledgments

- **Grindr** - Grid-based discovery inspiration
- **Sniffies** - Map-based real-time location inspiration
- **[GrindrPlus](https://github.com/R0rt1z2/GrindrPlus)** - Original codebase in this repo (now separate project)

---

## ⚠️ Note About GrindrPlus

This repository previously contained **GrindrPlus** (an Xposed module for Grindr). That project is still available in the `app/` directory for reference, but **Anon Hookup Now** is a completely new, standalone application with different goals.

**GrindrPlus** was about modifying an existing app. **Anon Hookup Now** is about building a free, open-source alternative from scratch.

---

## 📬 Support & Contact

- 🐛 [Report Issues](https://github.com/ivi374forivi/anon-hookup-now/issues)
- 💬 [Discussions](https://github.com/ivi374forivi/anon-hookup-now/discussions)
- ⭐ Star this repo if you find it useful!

---

**Built with ❤️ by the community, for the community**
