# PLAN.md

# Re Reference AI (RRA)

## Architecture

Crawler
→ Normalizer
→ PostgreSQL
→ FastAPI
→ Next.js
→ User

## Data Sources

### Official

- Documentation
- Specifications
- Changelogs

### GitHub

Collect:

- Stars
- Forks
- Releases
- Contributors
- License
- Last Commit

### Research

- arXiv
- OpenReview
- ACL Anthology

### Community

- Blogs
- Release Notes
- RSS

## Database

Main entities

- Term
- Category
- Tag
- Repository
- Organization
- Specification
- Paper
- Timeline
- Comparison
- FAQ

## Search

Phase 1

- PostgreSQL Full Text Search

Phase 2

- Meilisearch

## Scheduler

Daily

- GitHub
- RSS

Weekly

- Documentation
- Papers

## API

- GET /terms
- GET /terms/{slug}
- GET /compare
- GET /timeline
- GET /search

## Roadmap

### Phase 1

- MVP
- Search
- Categories
- Term pages

### Phase 2

- GitHub synchronization
- Timeline
- History

### Phase 3

- Comparison pages
- Papers
- Specifications

### Phase 4

- AI-assisted authoring
- Knowledge Graph
- Public API

## Quality Policy

Reference priority:

1. Official specifications
2. Official documentation
3. Official GitHub repositories
4. Academic papers
5. Organization blogs
6. Conference presentations

All articles should include links to primary sources whenever possible.
