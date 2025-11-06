# Consensus Council Framework

## Overview

The Consensus Council is the collaborative decision-making body for the metaverse gaming platform project. It brings together specialized AI agents to make strategic decisions, resolve conflicts, and maintain project alignment.

**Version**: 1.0.0  
**Last Updated**: 2025-11-06  
**Status**: Active

---

## Council Structure

### Council Members

**Permanent Members** (voting rights on all decisions):
- Master Agent (Chair, tie-breaking vote)
- Meta-Agent Council Manager (Facilitator, non-voting unless tie)
- Gameplay Design Agent
- Cryptographic Wallet Architect Agent
- UI/UX Design Agent
- Blockchain Integration Agent
- Security Audit Agent

**Rotating Members** (invited based on topic):
- Social Systems Agent
- AI Coordination Agent
- Testing & QA Agent
- Documentation Agent

**Observers** (non-voting, advisory):
- Any specialized agent working on relevant topics
- Human stakeholders (when available)

---

## Meeting Types

### 1. Strategic Planning Council

**Frequency**: Bi-weekly  
**Duration**: 90 minutes  
**Purpose**: High-level strategy, roadmap adjustments, resource allocation

**Standard Agenda**:
1. Review project status and key metrics (15 min)
2. Strategic decisions and planning (40 min)
3. Cross-domain coordination issues (20 min)
4. Risk assessment and mitigation (10 min)
5. Action items and next steps (5 min)

### 2. Technical Design Council

**Frequency**: Weekly  
**Duration**: 60 minutes  
**Purpose**: Architecture decisions, technical standards, integration planning

**Standard Agenda**:
1. Architecture review and updates (15 min)
2. Technical decisions requiring consensus (25 min)
3. Integration challenges and solutions (15 min)
4. Action items (5 min)

### 3. Emergency Council

**Frequency**: As needed  
**Duration**: 30-60 minutes  
**Purpose**: Critical issues, blockers, urgent decisions

**Standard Agenda**:
1. Issue presentation (10 min)
2. Options analysis (15 min)
3. Decision vote (10 min)
4. Implementation plan (10 min)

### 4. Sprint Planning Council

**Frequency**: Start of each sprint  
**Duration**: 120 minutes  
**Purpose**: Task breakdown, assignment, dependency mapping

**Standard Agenda**:
1. Sprint goals review (10 min)
2. Task breakdown and estimation (60 min)
3. Assignment and dependency mapping (30 min)
4. Risk identification (10 min)
5. Commitment and wrap-up (10 min)

### 5. Retrospective Council

**Frequency**: End of each phase  
**Duration**: 90 minutes  
**Purpose**: Reflect, learn, improve processes

**Standard Agenda**:
1. Phase accomplishments celebration (10 min)
2. What went well (20 min)
3. What could be improved (20 min)
4. Action items for next phase (20 min)
5. Team recognition (10 min)
6. Next phase preparation (10 min)

---

## Decision-Making Process

### Decision Categories

#### Category A: Autonomous Decisions
- Individual agent decisions within their domain
- No council vote required
- Must align with established standards
- Document in knowledge base

**Examples**:
- Code implementation details
- Design color choices within style guide
- Test case creation
- Documentation structure

#### Category B: Collaborative Decisions
- Cross-domain decisions affecting 2-3 agents
- Informal consensus among affected agents
- No formal vote required
- Document in knowledge base

**Examples**:
- API contract between two systems
- Shared data format decisions
- Integration approach between modules

#### Category C: Council Voting Decisions
- Significant technical or strategic choices
- Affects multiple domains or project direction
- Requires formal vote
- Document in decision log

**Examples**:
- Technology stack selection
- Architecture changes
- Phase timeline adjustments
- Resource allocation shifts

#### Category D: Master Agent Decisions
- Emergency decisions requiring immediate action
- Conflicts that cannot be resolved through voting
- Final authority on project direction
- Must be communicated and explained to council

**Examples**:
- Emergency pivots
- Critical security responses
- Deadlock resolution
- Stakeholder commitments

---

## Voting Procedures

### Standard Voting Process

1. **Proposal Submission**
   - Agent submits decision proposal with:
     - Problem statement
     - Options analysis
     - Recommendation
     - Impact assessment
     - Supporting documentation
   - Minimum 24 hours before vote (48 hours for major decisions)

2. **Pre-Vote Discussion**
   - Council members review proposal
   - Questions and clarifications addressed
   - Additional options may be suggested
   - Impact analysis refined

3. **Voting Period**
   - Council Manager calls for vote
   - Each voting member casts vote using DECISION_VOTE message type
   - Options: Approve / Reject / Abstain / Request Revision
   - Rationale required for all votes

4. **Vote Tallying**
   - Meta-Agent Council Manager tallies votes
   - Quorum: Minimum 60% of voting members must participate
   - Majority: >50% of votes cast must agree for approval
   - Tie-break: Master Agent casts deciding vote

5. **Decision Documentation**
   - Council Manager documents decision in knowledge base
   - Decision rationale captured
   - Dissenting opinions noted
   - Implementation plan assigned

### Fast-Track Voting (Urgent Decisions)

**Criteria**: Critical blockers, security issues, time-sensitive opportunities

**Process**:
1. Master Agent or Council Manager declares fast-track
2. Voting period reduced to 4 hours
3. Quorum reduced to 50% of voting members
4. Same majority requirement (>50%)
5. Post-decision review at next council meeting

---

## Conflict Resolution

### Level 1: Peer Resolution
- Agents attempt direct resolution
- Document agreement in knowledge base
- Time limit: 48 hours

### Level 2: Facilitated Resolution
- Meta-Agent Council Manager facilitates discussion
- Structured negotiation process
- Find compromise or consensus
- Time limit: 72 hours

### Level 3: Council Vote
- Present conflict to full council
- Each side presents case (10 min each)
- Council discussion (15 min)
- Vote on resolution options
- Binding decision

### Level 4: Master Agent Decision
- If voting results in deadlock (50/50)
- If urgent and cannot wait for full council
- Master Agent makes final decision
- Decision explanation provided to council

---

## Meeting Protocols

### Pre-Meeting

**Council Manager Responsibilities**:
- Send agenda 24 hours in advance
- Include all supporting documents
- List decisions requiring votes
- Assign pre-reading materials

**Agent Responsibilities**:
- Review agenda and materials
- Prepare questions and input
- Complete any assigned pre-work
- Submit vote proxies if unable to attend

### During Meeting

**Facilitation**:
- Meta-Agent Council Manager facilitates
- Master Agent chairs but doesn't dominate
- Time-boxed agenda items
- Parking lot for off-topic items

**Participation**:
- All voices heard on relevant topics
- Challenge ideas, not individuals
- Data-driven discussions
- Document decisions in real-time

**Decision Making**:
- Clear articulation of decision needed
- Options presented with pros/cons
- Structured vote when required
- Document rationale

### Post-Meeting

**Council Manager**:
- Publish meeting notes within 4 hours
- Update knowledge base with decisions
- Create action item tracking
- Schedule follow-up if needed

**Agents**:
- Review meeting notes
- Complete assigned action items
- Update progress on commitments
- Raise concerns or questions promptly

---

## Decision Documentation Template

```markdown
# Decision Record: [DECISION-ID]

## Metadata
- **Decision ID**: DEC-XXX
- **Date**: YYYY-MM-DD
- **Category**: [A/B/C/D]
- **Status**: [Proposed/Approved/Rejected/Implemented]
- **Proposed by**: [Agent ID]
- **Decided by**: [Council/Master Agent/Agents involved]

## Context
[What is the situation requiring a decision?]

## Decision
[What was decided?]

## Options Considered
1. **Option A**: [Description]
   - Pros: [List]
   - Cons: [List]
   
2. **Option B**: [Description]
   - Pros: [List]
   - Cons: [List]

## Rationale
[Why was this decision made? What factors were most important?]

## Voting Record (if applicable)
| Agent | Vote | Rationale |
|-------|------|-----------|
| Agent A | Approve | ... |
| Agent B | Approve | ... |
| Agent C | Abstain | ... |

**Result**: Approved (X votes for, Y votes against, Z abstentions)

## Impact Assessment
- **Affected Systems**: [List]
- **Affected Agents**: [List]
- **Timeline Impact**: [Description]
- **Resource Impact**: [Description]

## Implementation Plan
1. [Action item 1] - Assigned to: [Agent] - Due: [Date]
2. [Action item 2] - Assigned to: [Agent] - Due: [Date]

## Success Criteria
- [How will we know this decision was correct?]
- [What metrics will we track?]

## Review Date
[When will we revisit this decision?]

## Related Decisions
- [Links to related decision records]

## Notes
[Any additional context, dissenting opinions, or considerations]
```

---

## Council Meeting Schedule

### Phase 0: Foundation & Planning
- **Week 1**: Initial Council Meeting (all agents introduction)
- **Week 2**: Strategic Planning Council (project direction)

### Phase 1: Core Game Engine (Weeks 3-8)
- **Weekly**: Technical Design Council (every Monday)
- **Bi-weekly**: Strategic Planning Council (alternate Thursdays)
- **Sprint**: Sprint Planning (start of each 2-week sprint)
- **As needed**: Emergency Council

### Phase 2-5: Ongoing
- **Weekly**: Technical Design Council
- **Bi-weekly**: Strategic Planning Council
- **Per Sprint**: Sprint Planning & Retrospective
- **As needed**: Emergency Council

---

## Communication Norms

### Discussion Guidelines

**DO**:
- Focus on problems, not personalities
- Use data and evidence to support positions
- Ask clarifying questions
- Acknowledge good ideas from others
- Be open to changing your mind
- Respect different perspectives

**DON'T**:
- Make personal attacks
- Dominate conversations
- Dismiss others' concerns
- Make decisions outside council process
- Share confidential information inappropriately

### Decision Quality Standards

Every decision should have:
1. **Clear problem statement** - What are we solving?
2. **Options analysis** - What alternatives exist?
3. **Impact assessment** - What are the consequences?
4. **Data support** - What evidence informs this?
5. **Implementation plan** - How will this be executed?
6. **Success criteria** - How will we measure success?

---

## Council Effectiveness Metrics

### Process Metrics
- Decision cycle time (proposal to implementation)
- Meeting attendance rates
- Vote participation rates
- Time to resolve conflicts

### Outcome Metrics
- Decision implementation rate
- Decision reversal rate
- Agent satisfaction with process
- Project velocity impact

### Review Schedule
- Monthly: Review process metrics
- Quarterly: Review outcome metrics
- Per Phase: Full retrospective and adjustment

---

## Special Situations

### Onboarding New Council Members

1. Review council charter and procedures
2. Shadow 2 council meetings as observer
3. Paired with mentor agent for first sprint
4. Full voting rights after orientation complete

### Removing/Rotating Council Members

- Agents may request rotation if workload excessive
- Master Agent may rotate members based on project phase
- Requires 2-week transition period for knowledge transfer

### Council Process Changes

- Any agent may propose process improvements
- Changes require Council vote (Category C decision)
- Trial period for significant changes
- Review and adjust based on effectiveness

---

## Templates & Tools

### Meeting Agenda Template

```markdown
# [Council Type] Meeting - [Date]

## Logistics
- **Date/Time**: [ISO8601]
- **Duration**: [X minutes]
- **Facilitator**: Meta-Agent Council Manager
- **Attendees**: [List]

## Pre-Reading
- [Document 1]
- [Document 2]

## Agenda

### 1. [Topic] ([Time allocation])
- **Purpose**: [What we're trying to achieve]
- **Pre-work**: [What to review beforehand]
- **Output**: [Expected decision or outcome]

### 2. [Topic] ([Time allocation])
...

## Decisions Required
1. **[Decision Title]** - Decision ID: DEC-XXX
   - Options: [A, B, C]
   - Recommendation: [X]
   - Vote required: Yes/No

## Action Items from Previous Meeting
- [ ] [Action item] - Owner: [Agent] - Status: [Complete/In Progress]

## Parking Lot
[Topics deferred to future meetings]
```

### Meeting Notes Template

```markdown
# [Council Type] Meeting Notes - [Date]

## Attendees
- Present: [List]
- Absent: [List]
- Observers: [List]

## Key Decisions
1. **[Decision]** - DEC-XXX - [Approved/Rejected]
   - Details: [Brief summary]
   - Vote: [X for, Y against, Z abstain]

## Discussion Summary

### [Topic 1]
- Key points: [Summary]
- Outcomes: [Results]

### [Topic 2]
...

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action] | [Agent] | [Date] | Not Started |

## Parking Lot Items
- [Item 1] - Deferred to [Future meeting]

## Next Meeting
- **Date**: [ISO8601]
- **Type**: [Council Type]
- **Key Topics**: [Preview]
```

---

## Council Effectiveness Self-Assessment

**Quarterly Review Questions**:

1. Are our decisions being implemented effectively?
2. Is the decision-making process too slow or too fast?
3. Are all voices being heard in discussions?
4. Do we have the right membership composition?
5. Are our meetings productive and focused?
6. Are we addressing the right issues?
7. How can we improve our collaboration?
8. What process changes would help?

**Action**: Review responses and implement improvements

---

## Appendix: Decision Escalation Flowchart

```
[Issue Arises]
    ↓
[Is it within single agent's domain?]
    ├─ Yes → [Category A: Agent Decides] → [Document in KB]
    └─ No ↓
[Affects 2-3 agents?]
    ├─ Yes → [Category B: Collaborate] → [Reach consensus] → [Document in KB]
    │           ↓ If no consensus
    │       [Escalate ↓]
    └─ No ↓
[Significant impact or cross-domain?]
    ├─ Yes → [Category C: Council Vote] → [Vote outcome] → [Document decision]
    │           ↓ If deadlock
    │       [Escalate ↓]
    └─ [Emergency or deadlock?]
        ↓
[Category D: Master Agent Decision] → [Communicate to council] → [Document decision]
```

---

*The Consensus Council framework is designed to enable effective autonomous decision-making while maintaining project alignment and quality standards.*
