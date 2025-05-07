# sim-space
sim city but fraudulent. readme is by yours truly chat jibbidy

# 🌍 SimSpace

**SimSpace** is a 2D simulation strategy game inspired by *SimCity* — but for an entire planet! Built with HTML, TypeScript, and Object-Oriented Programming principles, SimSpace challenges players to manage budgets, population growth, and planetary disasters while maintaining a thriving civilization.

## 👨‍💻 Project Overview

This project was developed as part of an Object-Oriented Programming course and emphasizes:

- Unified Modeling Language (UML)
- Object-Oriented design and implementation
- Use of 2D arrays to manage a grid-based world
- Team collaboration and software engineering principles

## 🧠 Game Concept

You are the President of the Green Planet. Your mission: build and maintain a livable, sustainable, and economically viable planet within a 50x50 grid of facilities.

- Start with $5,000,000,000.
- Build essential infrastructure.
- Grow a population using residential facilities.
- Generate revenue and handle expenses monthly (every 10 seconds in real time).
- Avoid extinction from asteroids or alien invasions — unless you build a Planetary Defense System.

## 🏗️ Core Gameplay Mechanics

### 🏢 Facility Types

| Category              | Examples                        | Notes |
|----------------------|----------------------------------|-------|
| **Essential Services** | Emergency, Education, Medical, Government, Power Plant | Required before residential zones function |
| **Residential**        | Luxury, Comfortable, Affordable | Must be near essential services, stores, and restaurants |
| **Industrial**         | Factories, Warehouses, Environmental | Generate revenue and pollution |
| **Commercial**         | Stores, Restaurants, Offices     | Provide jobs, light revenue |
| **Special**            | Planetary Defense System         | Prevents game-ending disasters |

### 🔌 Power Management

Facilities require power. Power Plants are the only producers, and each facility has a defined consumption rate. Unpowered facilities still incur maintenance costs but do not generate income.

### 💰 Monthly Economy (Simulated Every 10 Seconds)

Each month:
- Facilities deduct maintenance and earn revenue (if powered).
- Population in residential buildings grows (up to max over time).
- Pollution and power usage are recalculated.
- A 1% chance of disaster occurs unless the defense system is built.

### 📈 Scoring System

Score is based on:
- Population
- Financial surplus
- Happiness level of citizens
- Pollution levels
- Time survived without a disaster

## 🖼️ Technologies Used

- **HTML Canvas**: For 2D rendering of the planetary grid
- **TypeScript / OOP**: Facility classes, inheritance, and dynamic behavior
- **CSS**: Interface styling
- **Timers**: Real-time month simulation
- **2D Arrays**: Grid-based map of the planet

