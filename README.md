# Hera Network API

A backend API service for the [Hera Network](https://heramc.net), built with NestJS and Prisma.

## Overview

This API provides endpoints for player data, leaderboards by types, and health checks to support the Hera Network server ecosystem. The service is designed to handle player information and game statistics across multiple game modes.

## Features

- Player information management
- Game leaderboards for various game modes (RPG, Survival)
- Health check endpoints
- RESTful API design
- Prisma ORM integration for database operations

## Tech Stack

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Jest](https://jestjs.io/) - Testing framework

## API Endpoints

### Player Endpoints by Gamemode
- `GET /api/v1/{gamemode}/players/:uuid` - Retrieve complete player data for a specific game mode 
- `GET /api/v1/{gamemode}/players/:uuid?type={leaderboardType}` - Retrieve player data for a specific game mode and by type

### Game Leaderboards
- `GET /api/v1/{gamemode}/leaderboards?type={leaderboardType}` - Get leaderboards by game mode and type

### System
- `GET /api/health` - Check API health status
