# Anon Hookup Now

**A free and open-source dating/hookup platform with dual interfaces**

> This project is in active development. Contributions welcome!

## Overview

Anon Hookup Now is a modern, privacy-focused dating and hookup application that combines the best features from popular platforms while being completely free and open-source.

### Dual Interface Design

#### 🔥 Hookup Mode (Anonymous/Quick)
Inspired by Grindr and Sniffies, featuring:
- **Grid View**: Infinite scroll of nearby users with distance-based sorting
- **Map View**: Real-time user positions with clustering for privacy
- Location-based discovery with privacy controls
- Quick filters and instant messaging
- Anonymous mode with location fuzzing

#### ❤️ Love Mode (Relationship-Focused)
Progressive matching system where connections deepen over time:
- Smart compatibility matching algorithm
- **Progressive Profile Unlocking**:
  - Level 1: Anonymous match notification
  - Level 2: Unlock personality/interests through conversation
  - Level 3: Unlock photos through games and deeper interaction
  - Level 4: Full profile access
- Interactive games (20 questions, compatibility quizzes, etc.)
- Emphasis on meaningful connections

### Key Features

✅ **Privacy & Security**
- End-to-end encrypted messaging
- Location privacy with fuzzing/jittering
- Photo verification system
- Anonymous mode support
- Block and report functionality

✅ **Real-time Features**
- WebSocket-based live chat
- Typing indicators and read receipts
- Live location updates
- Presence detection

✅ **Cross-Platform**
- React Native mobile app (iOS & Android)
- React web app with PWA support
- Responsive design for all devices

✅ **Self-Hostable**
- Docker Compose deployment
- No cloud vendor lock-in
- Full control over your data

## Technology Stack

### Backend
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15+ with PostGIS (geospatial)
- **Cache**: Redis
- **Real-time**: Socket.io
- **Storage**: MinIO (S3-compatible)

### Mobile
- React Native with TypeScript
- React Navigation
- Zustand + React Query

### Web
- React with TypeScript
- Vite build tool
- Tailwind CSS
- PWA support

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Git

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/ivi374forivi/anon-hookup-now.git
cd anon-hookup-now
```

2. **Start services with Docker Compose**
```bash
docker-compose up -d
```

This will start:
- PostgreSQL with PostGIS (port 5432)
- Redis (port 6379)
- MinIO (ports 9000, 9001)
- Backend API (port 3000)
- Nginx reverse proxy (port 80)

3. **Backend setup (local development)**
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

4. **Access the services**
- API: http://localhost:3000/api
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)
- Health Check: http://localhost:3000/health

### API Documentation

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete API documentation.

#### Quick Examples

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "displayName": "Alex",
    "age": 25
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Update location:**
```bash
curl -X POST http://localhost:3000/api/users/me/location \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "latitude": 37.7749,
    "longitude": -122.4194
  }'
```

**Discover nearby users (grid view):**
```bash
curl http://localhost:3000/api/discover/grid?limit=20&maxDistance=10 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Project Structure

```
anon-hookup-now/
├── backend/              # Node.js/TypeScript backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, error handling, etc.
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utilities
│   │   └── index.ts      # Entry point
│   ├── prisma/           # Database schema
│   └── package.json
├── mobile/               # React Native app (TODO)
├── web/                  # React web app (TODO)
├── nginx/                # Nginx configuration
├── docker-compose.yml    # Docker services
├── ARCHITECTURE.md       # Detailed architecture docs
└── README.md            # This file
```

## Development Roadmap

### Phase 1: Foundation (MVP) ✅ IN PROGRESS
- [x] Backend API structure
- [x] User authentication & profiles
- [x] Database schema with PostGIS
- [x] Docker deployment setup
- [ ] Basic location discovery
- [ ] Simple chat
- [ ] Mobile app scaffold

### Phase 2: Hookup Mode
- [ ] Grid view implementation
- [ ] Map view with clustering
- [ ] Advanced filters
- [ ] Photo upload/sharing
- [ ] Location privacy controls

### Phase 3: Love Mode
- [ ] Matching algorithm
- [ ] Progressive unlock system
- [ ] Interactive games
- [ ] Compatibility scoring

### Phase 4: Polish & Safety
- [ ] End-to-end encryption
- [ ] Photo verification
- [ ] Content moderation tools
- [ ] Web PWA
- [ ] Performance optimization

## Contributing

We welcome contributions! This is a community-driven project.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas Needing Help

- Mobile app development (React Native)
- Web app development (React)
- UI/UX design
- Security auditing
- Performance optimization
- Documentation
- Translation/i18n

## Privacy & Ethics

This project is built with privacy and user safety as core principles:

- **No tracking**: We don't track users or sell data
- **Self-hostable**: Run your own instance with full control
- **Open source**: All code is transparent and auditable
- **Consent-focused**: Clear privacy controls and user consent
- **Safety tools**: Built-in reporting, blocking, and moderation

## License

This project is licensed under the **GPL-3.0 License** - see the [LICENSE](LICENSE) file for details.

This ensures the software remains free and open-source, and any derivatives must also be open-source.

## Acknowledgments

Inspired by:
- **Grindr**: Grid-based discovery
- **Sniffies**: Map-based real-time location
- The open-source community

Special thanks to the [GrindrPlus](https://github.com/R0rt1z2/GrindrPlus) project which was the original codebase in this repository. This new project is a complete rewrite with different goals (standalone app vs Xposed module).

## Disclaimer

This is educational and community software. Use responsibly and ethically. The developers are not responsible for misuse of this platform.

## Support

- 🐛 Report bugs: [GitHub Issues](https://github.com/ivi374forivi/anon-hookup-now/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/ivi374forivi/anon-hookup-now/discussions)
- 📧 Contact: [Create an issue](https://github.com/ivi374forivi/anon-hookup-now/issues/new)

## Star History

If you find this project useful, please consider giving it a ⭐️ on GitHub!

---

**Built with ❤️ by the community, for the community**
