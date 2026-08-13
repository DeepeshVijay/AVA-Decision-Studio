# AVA Decision Studio

### Advanced Vehicle Architecture · Packaging & Trade-off Decision Support

![Status](https://img.shields.io/badge/Status-Module%2001%20Active-3B82F6?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Claude%20AI-10B981?style=flat-square)
![Domain](https://img.shields.io/badge/Domain-Automotive%20Engineering-F59E0B?style=flat-square)
![Stage](https://img.shields.io/badge/Stage-Prototype-8B5CF6?style=flat-square)

---

## The Problem

In vehicle development, packaging conflicts are a daily reality.

A cooling system needs a larger opening. An ADAS radar needs a clear field of view. The BIW structure needs a specific load path. The styling surface cannot move. These constraints don't exist in isolation — they compete, cascade, and escalate across departments.

Today, most packaging conflict resolution happens through email threads, PowerPoint decks, and hours of cross-functional meetings. There is no structured, repeatable process for capturing the conflict, evaluating options, documenting trade-offs, and producing a decision record.

**AVA Decision Studio is the beginning of that structured process.**

---

## What It Does

AVA Decision Studio is an AI-powered engineering decision support tool built specifically for Advanced Vehicle Architecture (AVA) workflows.

Given a packaging conflict, it:

- Structures the conflict within a full vehicle architecture context
- Identifies root cause at both the physical and architecture level
- Generates multiple design options with engineering impact assessment
- Scores each option across a multi-criteria decision matrix
- Produces trade-off analysis and an architecture recommendation
- Generates a closure plan with stakeholder map, action items, and a decision record
- Flags missing information, engineering assumptions, and regulatory risks
- Returns a decision confidence score based on data completeness

---

## Scope — Vehicle Zones Covered

| Zone | Coverage |
|---|---|
| Front End | Bumper to firewall — cooling, ADAS, grille, bumper beam |
| Engine / Motor Bay | Under bonnet packaging — ICE, BEV motor, thermal |
| Cockpit & IP | Instrument panel zone — HMI, HVAC, airbag, wiring |
| Underbody | Floor structure — battery tray, exhaust, spare wheel |
| Rear End | Boot to rear bumper — towing, ADAS, exhaust, lighting |
| Roof & Pillars | A/B/C pillar — roof rail, antenna, camera, glazing |

---

## Example Use Case

**Conflict:** Front end packaging — cooling opening area insufficient. ADAS radar placed below lower grille requesting larger patch for FOV compliance. Increasing radar patch reduces available cooling opening area below powertrain thermal target.

**Departments involved:** Powertrain, ADAS / Sensors, Exterior Design, BIW / Structures

**Output:**
- Root cause identified at physical and architecture level
- Three design options generated with impact assessment across BIW, ADAS, thermal, manufacturing, cost, mass, service, and styling
- Decision matrix scoring all three options across eight engineering criteria
- Architecture recommendation with numbered rationale
- Missing information flagged — actual clearance dimensions, supplier component envelope, regulatory target
- Decision confidence score returned — 72% (preliminary)
- Closure plan with stakeholder alignment map and decision record

---

## Output Structure

Each assessment produces five panels:

```
Overview
├── Conflict summary
├── Root cause — physical
├── Root cause — architecture
├── Affected systems
├── Engineering assumptions
├── Missing information required
├── Regulatory / homologation flags
└── Decision confidence score

Design Options
├── Option A — description, feasibility, engineering impacts
├── Option B — description, feasibility, engineering impacts
├── Option C — description, feasibility, engineering impacts
├── Rejected alternatives with reasons
└── Architecture recommendation with rationale

Decision Matrix
└── Multi-criteria scoring table — 8 criteria × 3 options

Trade-offs
└── Gain vs compromise for each design direction

Closure Plan
├── Architecture review block
├── Immediate actions — 0 to 2 weeks
├── Stakeholder alignment map
├── Review milestones
├── Escalation note
└── Decision record — program, conflict, decision, status, date
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (JSX) |
| AI Engine | Anthropic Claude API (claude-sonnet-4-6) |
| Styling | Inline CSS — no external dependencies |
| State | React hooks — useState, useCallback |
| Output | Structured JSON parsed to UI |

---

## Architecture

```
Engineer Input
      │
      ▼
Vehicle Program Definition
(type, powertrain, market, safety target,
 cost position, mass target, stage)
      │
      ▼
Conflict Definition
(zone, conflict type, departments,
 description, constraints)
      │
      ▼
Structured Prompt → Claude API
      │
      ▼
JSON Response
      │
      ├── Overview Panel
      ├── Design Options Panel
      ├── Decision Matrix
      ├── Trade-offs Panel
      └── Closure Plan + Decision Record
```

---

## Current Capabilities — Upgrade 1

- [x] Vehicle program definition — type, powertrain, market, safety target, cost position, stage
- [x] Six vehicle zone classification
- [x] Twelve conflict type categories
- [x] Multi-department involvement mapping
- [x] AI-generated root cause — physical and architecture level
- [x] Three design options with full engineering impact grid
- [x] Rejected alternatives with documented reasons
- [x] Multi-criteria decision matrix — eight engineering criteria
- [x] Decision confidence score with drivers and gaps
- [x] Engineering assumptions surface
- [x] Missing information identification
- [x] Regulatory and homologation flags
- [x] Architecture recommendation with numbered rationale
- [x] Closure plan — actions, stakeholders, milestones
- [x] Decision record generation

---

## Roadmap

### Upgrade 2 — Engineering Knowledge Layer
- [ ] RAG pipeline with automotive engineering references
- [ ] Evidence-backed recommendations with source traceability
- [ ] Standards database — AIS, ECE, FMVSS auto-check
- [ ] Structured reasoning pipeline — problem definition → root cause → options → evaluation → recommendation

### Upgrade 3 — Engineering Application
- [ ] Conflict history log and search
- [ ] PDF decision record export
- [ ] Program dashboard — open conflicts, priority map
- [ ] Stakeholder approval workflow
- [ ] Decision audit trail

### Upgrade 4 — Portfolio Grade
- [ ] FastAPI backend
- [ ] Secure API architecture — no frontend API key exposure
- [ ] PostgreSQL decision database
- [ ] Authentication and team access
- [ ] Deployment — frontend + backend
- [ ] Full test coverage
- [ ] Architecture diagrams

### Long Term Vision — VADSS
```
VADSS — Vehicle Architecture Decision Support System
│
├── Module 01 — Packaging Conflict Resolution  ← current
├── Module 02 — BIW Architecture Assessment
├── Module 03 — Material Selection Support
├── Module 04 — Manufacturing Feasibility Check
└── Module 05 — Durability Risk Identification
```

---

## Background

This project was built to apply Data Science and AI concepts directly to automotive engineering workflows — specifically the Advanced Vehicle Architecture domain.

The motivation: packaging conflict resolution in vehicle development is a high-frequency, high-stakes process that remains largely unstructured. Architecture decisions made in the packaging phase affect BIW, ADAS, thermal, manufacturing, safety, and styling simultaneously. A structured decision support layer — one that captures the conflict, evaluates options against engineering criteria, and produces a traceable decision record — has direct value in OEM and Tier 1 environments.

AVA Decision Studio is the first module of a larger Vehicle Architecture Decision Support System being developed iteratively.

---

## Author

**Deepesh Vijay**
Senior Engineer — Advanced Vehicle Architecture (AVA)
Mahindra Research Valley, Chennai

Background: Advance Vehicle Architecture · Tool Engineering (M.Tech) · Data Science & AI

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/your-profile)

---

## Disclaimer

This is an independent research and learning project. It does not use, reference, or contain any confidential, proprietary, or internal data from any organization. All vehicle scenarios used in development are generic and illustrative.

---

*AVA Decision Studio — Module 01 of VADSS*
*Prototype · Active Development*
