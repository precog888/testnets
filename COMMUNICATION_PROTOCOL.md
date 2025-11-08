# Inter-Agent Communication Protocol

## Overview

This document defines the structured communication protocol for all AI agents in the metaverse gaming platform project. The protocol enables efficient, traceable, and context-aware communication between agents.

**Version**: 1.0.0  
**Last Updated**: 2025-11-06  
**Status**: Active

---

## Message Structure Specification

### Core Message Schema

All inter-agent messages must follow this JSON structure:

```json
{
  "message_id": "string (UUID v4)",
  "timestamp": "string (ISO8601 format)",
  "sender_id": "string (agent identifier)",
  "recipient_id": "string (agent identifier or council-group)",
  "message_type": "enum (MESSAGE_TYPE)",
  "context_version": "string (semver format)",
  "priority": "enum (PRIORITY_LEVEL)",
  "payload": "object (type-specific structure)"
}
```

### Field Definitions

#### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `message_id` | UUID v4 | Unique message identifier | `"550e8400-e29b-41d4-a716-446655440000"` |
| `timestamp` | ISO8601 | Message creation timestamp | `"2025-11-06T16:36:59.813Z"` |
| `sender_id` | string | Sending agent identifier | `"gameplay-design-agent"` |
| `recipient_id` | string | Receiving agent or group | `"crypto-wallet-architect"` or `"council-group"` |
| `message_type` | enum | Type of message | `"TASK_ASSIGNMENT"` |
| `context_version` | semver | Current knowledge base version | `"v1.3.2"` |
| `priority` | enum | Message urgency level | `"HIGH"` |
| `payload` | object | Type-specific message content | See payload schemas below |

#### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `thread_id` | UUID v4 | Links related messages | `"660e8400-e29b-41d4-a716-446655440001"` |
| `references` | array[UUID] | IDs of related messages | `["550e8400-...", "770e8400-..."]` |
| `expires_at` | ISO8601 | Message expiration time | `"2025-11-07T16:36:59.813Z"` |
| `tags` | array[string] | Categorical tags | `["security", "urgent", "phase-2"]` |

---

## Message Types

### 1. TASK_ASSIGNMENT

**Purpose**: Assign tasks from Master Agent or council to specific agents

**Payload Schema**:
```json
{
  "task_id": "string (unique task identifier)",
  "task_title": "string (brief task name)",
  "task_description": "string (detailed description)",
  "assigned_to": "string (agent identifier)",
  "assigned_by": "string (agent identifier)",
  "due_date": "string (ISO8601)",
  "priority": "enum (LOW | MEDIUM | HIGH | CRITICAL)",
  "dependencies": ["array of task_ids"],
  "deliverables": ["array of expected outputs"],
  "context_required": ["array of knowledge base sections"],
  "acceptance_criteria": ["array of validation requirements"],
  "estimated_effort": "string (e.g., '3 days', '10 hours')",
  "phase": "string (e.g., 'Phase 1', 'Phase 2')"
}
```

**Example**:
```json
{
  "message_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-11-06T16:36:59.813Z",
  "sender_id": "master-agent",
  "recipient_id": "gameplay-design-agent",
  "message_type": "TASK_ASSIGNMENT",
  "context_version": "v1.0.0",
  "priority": "HIGH",
  "payload": {
    "task_id": "TASK-001",
    "task_title": "Design Core Gameplay Loop",
    "task_description": "Develop the fundamental gameplay loop including player actions, feedback mechanisms, and entropy generation points for wallet evolution.",
    "assigned_to": "gameplay-design-agent",
    "assigned_by": "master-agent",
    "due_date": "2025-11-13T23:59:59.999Z",
    "priority": "HIGH",
    "dependencies": [],
    "deliverables": [
      "Gameplay loop flowchart",
      "Entropy generation specification",
      "Prototype implementation plan"
    ],
    "context_required": [
      "KNOWLEDGE_BASE.md#project-vision",
      "AGENT_ROLES.md#gameplay-design-agent"
    ],
    "acceptance_criteria": [
      "Clearly defined player action loop",
      "Identified at least 5 entropy-generating actions",
      "Integration points with cryptographic system documented"
    ],
    "estimated_effort": "5 days",
    "phase": "Phase 1"
  }
}
```

---

### 2. PROGRESS_UPDATE

**Purpose**: Report progress on assigned tasks or general work status

**Payload Schema**:
```json
{
  "task_id": "string (if related to specific task)",
  "progress_percentage": "number (0-100)",
  "status": "enum (NOT_STARTED | IN_PROGRESS | BLOCKED | REVIEW | COMPLETED)",
  "summary": "string (brief progress description)",
  "accomplishments": ["array of completed items"],
  "next_steps": ["array of upcoming actions"],
  "blockers": [
    {
      "description": "string",
      "blocking_agent": "string (optional)",
      "severity": "enum (LOW | MEDIUM | HIGH)"
    }
  ],
  "updated_deliverables": ["array of new/updated outputs"],
  "estimated_completion": "string (ISO8601)",
  "requires_assistance": "boolean",
  "assistance_needed": "string (if requires_assistance is true)"
}
```

**Example**:
```json
{
  "message_id": "660e8400-e29b-41d4-a716-446655440001",
  "timestamp": "2025-11-08T14:30:00.000Z",
  "sender_id": "gameplay-design-agent",
  "recipient_id": "master-agent",
  "message_type": "PROGRESS_UPDATE",
  "context_version": "v1.0.2",
  "priority": "MEDIUM",
  "thread_id": "550e8400-e29b-41d4-a716-446655440000",
  "payload": {
    "task_id": "TASK-001",
    "progress_percentage": 60,
    "status": "IN_PROGRESS",
    "summary": "Core gameplay loop designed with entropy integration points identified.",
    "accomplishments": [
      "Created gameplay loop flowchart with 3 main phases",
      "Identified 7 player actions that generate entropy",
      "Drafted integration specification with crypto wallet system"
    ],
    "next_steps": [
      "Finalize entropy weighting algorithm",
      "Create prototype implementation in code",
      "Coordinate with crypto-wallet-architect on data format"
    ],
    "blockers": [
      {
        "description": "Need clarification on Fourier transform implementation approach",
        "blocking_agent": "crypto-wallet-architect",
        "severity": "MEDIUM"
      }
    ],
    "updated_deliverables": [
      "docs/gameplay-loop-v0.2.md",
      "specs/entropy-points-specification.md"
    ],
    "estimated_completion": "2025-11-11T23:59:59.999Z",
    "requires_assistance": true,
    "assistance_needed": "Technical consultation with Cryptographic Wallet Architect on Fourier transform integration"
  }
}
```

---

### 3. DATA_REQUEST

**Purpose**: Request data, context, or resources from another agent

**Payload Schema**:
```json
{
  "request_id": "string (unique request identifier)",
  "data_requested": ["array of specific data items or resources"],
  "purpose": "string (why the data is needed)",
  "format_preference": "string (e.g., 'JSON', 'markdown', 'code')",
  "urgency": "enum (LOW | MEDIUM | HIGH | CRITICAL)",
  "required_by": "string (ISO8601 deadline)",
  "context": "string (additional context for the request)",
  "alternative_sources": ["array of potential alternative data sources"]
}
```

**Example**:
```json
{
  "message_id": "770e8400-e29b-41d4-a716-446655440002",
  "timestamp": "2025-11-08T15:00:00.000Z",
  "sender_id": "gameplay-design-agent",
  "recipient_id": "crypto-wallet-architect",
  "message_type": "DATA_REQUEST",
  "context_version": "v1.0.2",
  "priority": "HIGH",
  "payload": {
    "request_id": "REQ-001",
    "data_requested": [
      "player-movement-telemetry-v1",
      "entropy-collection-api-spec",
      "fourier-transform-parameters"
    ],
    "purpose": "Integrate entropy collection into gameplay loop prototype",
    "format_preference": "JSON schema for telemetry, markdown for documentation",
    "urgency": "HIGH",
    "required_by": "2025-11-10T12:00:00.000Z",
    "context": "Currently designing the data flow from gameplay events to wallet entropy system. Need to understand the expected data format and collection endpoints.",
    "alternative_sources": [
      "KNOWLEDGE_BASE.md#cryptographic-systems"
    ]
  }
}
```

---

### 4. DATA_RESPONSE

**Purpose**: Respond to data requests with requested information

**Payload Schema**:
```json
{
  "request_id": "string (references original DATA_REQUEST)",
  "status": "enum (FULFILLED | PARTIAL | UNAVAILABLE | REDIRECTED)",
  "data": "object (requested data)",
  "notes": "string (additional context or limitations)",
  "alternative_sources": ["array of other data sources"],
  "follow_up_required": "boolean",
  "follow_up_details": "string (if follow_up_required is true)"
}
```

**Example**:
```json
{
  "message_id": "880e8400-e29b-41d4-a716-446655440003",
  "timestamp": "2025-11-08T16:30:00.000Z",
  "sender_id": "crypto-wallet-architect",
  "recipient_id": "gameplay-design-agent",
  "message_type": "DATA_RESPONSE",
  "context_version": "v1.0.2",
  "priority": "HIGH",
  "references": ["770e8400-e29b-41d4-a716-446655440002"],
  "payload": {
    "request_id": "REQ-001",
    "status": "FULFILLED",
    "data": {
      "telemetry_schema": {
        "player_action": "string",
        "timestamp": "ISO8601",
        "position": {"x": "float", "y": "float"},
        "action_type": "enum",
        "entropy_weight": "float"
      },
      "api_endpoint": "/api/v1/entropy/collect",
      "fourier_params": {
        "sampling_rate": 60,
        "window_size": 1024,
        "overlap": 0.5
      }
    },
    "notes": "Telemetry schema is version 1, may be updated in Phase 2. Fourier parameters are initial estimates and will be tuned based on gameplay testing.",
    "alternative_sources": [],
    "follow_up_required": true,
    "follow_up_details": "Schedule joint session to review integration approach and edge cases"
  }
}
```

---

### 5. DECISION_VOTE

**Purpose**: Present decisions requiring consensus and collect votes

**Payload Schema**:
```json
{
  "decision_id": "string (unique decision identifier)",
  "decision_title": "string (brief decision name)",
  "decision_description": "string (full context and rationale)",
  "proposed_by": "string (agent identifier)",
  "decision_options": [
    {
      "option_id": "string",
      "option_label": "string (e.g., 'Approve', 'Option A')",
      "option_description": "string"
    }
  ],
  "voting_deadline": "string (ISO8601)",
  "required_voters": ["array of agent identifiers"],
  "minimum_votes": "number (quorum requirement)",
  "current_votes": [
    {
      "voter_id": "string",
      "option_id": "string",
      "rationale": "string (optional)",
      "timestamp": "string (ISO8601)"
    }
  ],
  "decision_criteria": "string (how decision will be made)",
  "impact_assessment": "string (consequences of each option)",
  "related_documents": ["array of reference links"]
}
```

**Example**:
```json
{
  "message_id": "990e8400-e29b-41d4-a716-446655440004",
  "timestamp": "2025-11-09T10:00:00.000Z",
  "sender_id": "meta-agent-council-manager",
  "recipient_id": "council-group",
  "message_type": "DECISION_VOTE",
  "context_version": "v1.0.3",
  "priority": "HIGH",
  "tags": ["architecture", "phase-1", "consensus-required"],
  "payload": {
    "decision_id": "DEC-001",
    "decision_title": "Select Game Engine for Development",
    "decision_description": "We need to choose a game engine for the metaverse platform. This decision impacts all future development work in Phase 1 and beyond. Evaluation considered: ease of use, performance, pixel-art support, and blockchain integration capabilities.",
    "proposed_by": "master-agent",
    "decision_options": [
      {
        "option_id": "unity",
        "option_label": "Unity Engine",
        "option_description": "Mature engine with extensive asset store, C# programming, good tooling but heavier footprint"
      },
      {
        "option_id": "godot",
        "option_label": "Godot Engine",
        "option_description": "Open-source, lightweight, excellent 2D support, GDScript/C#, smaller community"
      },
      {
        "option_id": "custom",
        "option_label": "Custom Engine",
        "option_description": "Build from scratch for maximum control, requires more time but perfect fit for needs"
      }
    ],
    "voting_deadline": "2025-11-10T23:59:59.999Z",
    "required_voters": [
      "gameplay-design-agent",
      "ui-ux-design-agent",
      "blockchain-integration-agent",
      "master-agent"
    ],
    "minimum_votes": 3,
    "current_votes": [],
    "decision_criteria": "Majority vote with Master Agent having tie-breaking authority",
    "impact_assessment": "Choice affects: development timeline, team learning curve, asset pipeline, blockchain integration complexity, and long-term maintainability",
    "related_documents": [
      "docs/engine-evaluation-matrix.md",
      "KNOWLEDGE_BASE.md#technical-decisions-needed"
    ]
  }
}
```

---

### 6. DECISION_VOTE_RESPONSE

**Purpose**: Cast vote on a pending decision

**Payload Schema**:
```json
{
  "decision_id": "string (references DECISION_VOTE)",
  "voter_id": "string (agent identifier)",
  "option_id": "string (selected option)",
  "vote_timestamp": "string (ISO8601)",
  "rationale": "string (reasoning for vote)",
  "confidence_level": "enum (LOW | MEDIUM | HIGH)",
  "conditions": "string (any conditions or concerns)"
}
```

**Example**:
```json
{
  "message_id": "aa0e8400-e29b-41d4-a716-446655440005",
  "timestamp": "2025-11-09T14:00:00.000Z",
  "sender_id": "gameplay-design-agent",
  "recipient_id": "meta-agent-council-manager",
  "message_type": "DECISION_VOTE_RESPONSE",
  "context_version": "v1.0.3",
  "priority": "HIGH",
  "references": ["990e8400-e29b-41d4-a716-446655440004"],
  "payload": {
    "decision_id": "DEC-001",
    "voter_id": "gameplay-design-agent",
    "option_id": "godot",
    "vote_timestamp": "2025-11-09T14:00:00.000Z",
    "rationale": "Godot's lightweight architecture and excellent 2D support align perfectly with our pixel-art focus. The open-source nature gives us flexibility for blockchain integration. Learning curve is acceptable given our requirements.",
    "confidence_level": "HIGH",
    "conditions": "Recommend we budget extra time for team training on Godot-specific patterns"
  }
}
```

---

### 7. CONTEXT_UPDATE

**Purpose**: Notify agents of changes to the shared knowledge base or project context

**Payload Schema**:
```json
{
  "update_id": "string (unique update identifier)",
  "context_version_previous": "string (semver)",
  "context_version_current": "string (semver)",
  "update_type": "enum (MINOR_UPDATE | MAJOR_UPDATE | BREAKING_CHANGE)",
  "updated_by": "string (agent identifier)",
  "context_diff": {
    "added": ["array of new sections/items"],
    "removed": ["array of removed sections/items"],
    "modified": ["array of changed sections/items"]
  },
  "summary": "string (overview of changes)",
  "impact_scope": ["array of affected agents or domains"],
  "action_required": "boolean",
  "action_details": "string (if action_required is true)",
  "migration_guide": "string (optional, for breaking changes)"
}
```

**Example**:
```json
{
  "message_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "timestamp": "2025-11-09T16:00:00.000Z",
  "sender_id": "meta-agent-council-manager",
  "recipient_id": "council-group",
  "message_type": "CONTEXT_UPDATE",
  "context_version": "v1.1.0",
  "priority": "MEDIUM",
  "tags": ["knowledge-base", "architecture"],
  "payload": {
    "update_id": "UPDATE-001",
    "context_version_previous": "v1.0.3",
    "context_version_current": "v1.1.0",
    "update_type": "MAJOR_UPDATE",
    "updated_by": "meta-agent-council-manager",
    "context_diff": {
      "added": [
        "Game engine decision: Godot Engine selected",
        "New development standards for GDScript",
        "Godot asset pipeline documentation"
      ],
      "removed": [],
      "modified": [
        "Technical stack updated with Godot",
        "Phase 1 timeline adjusted for engine setup"
      ]
    },
    "summary": "Game engine decision finalized as Godot. Knowledge base updated with engine-specific standards and adjusted Phase 1 timeline to include setup and training period.",
    "impact_scope": [
      "gameplay-design-agent",
      "ui-ux-design-agent",
      "testing-qa-agent",
      "documentation-agent"
    ],
    "action_required": true,
    "action_details": "All development agents should review the new Godot standards document and complete setup of Godot development environment by 2025-11-12",
    "migration_guide": "See docs/godot-setup-guide.md for environment configuration"
  }
}
```

---

### 8. COLLABORATION_REQUEST

**Purpose**: Request collaboration or joint work session between agents

**Payload Schema**:
```json
{
  "collaboration_id": "string (unique collaboration identifier)",
  "collaboration_type": "enum (PAIR_WORK | JOINT_REVIEW | BRAINSTORM | INTEGRATION)",
  "purpose": "string (goal of collaboration)",
  "participants_required": ["array of agent identifiers"],
  "proposed_schedule": {
    "start_time": "string (ISO8601)",
    "duration_minutes": "number",
    "timezone": "string"
  },
  "agenda": ["array of discussion/work items"],
  "preparation_required": ["array of pre-work items"],
  "expected_outcomes": ["array of deliverables from session"],
  "meeting_format": "enum (SYNCHRONOUS | ASYNCHRONOUS | HYBRID)"
}
```

**Example**:
```json
{
  "message_id": "cc0e8400-e29b-41d4-a716-446655440007",
  "timestamp": "2025-11-10T09:00:00.000Z",
  "sender_id": "gameplay-design-agent",
  "recipient_id": "crypto-wallet-architect",
  "message_type": "COLLABORATION_REQUEST",
  "context_version": "v1.1.0",
  "priority": "HIGH",
  "payload": {
    "collaboration_id": "COLLAB-001",
    "collaboration_type": "INTEGRATION",
    "purpose": "Finalize integration between gameplay entropy collection and wallet evolution system",
    "participants_required": [
      "gameplay-design-agent",
      "crypto-wallet-architect"
    ],
    "proposed_schedule": {
      "start_time": "2025-11-11T14:00:00.000Z",
      "duration_minutes": 90,
      "timezone": "UTC"
    },
    "agenda": [
      "Review entropy data format and API contracts",
      "Discuss edge cases in entropy collection",
      "Define integration testing approach",
      "Plan joint implementation sprint"
    ],
    "preparation_required": [
      "Review latest entropy specification v0.3",
      "Prepare questions on Fourier transform implementation",
      "Draft integration architecture diagram"
    ],
    "expected_outcomes": [
      "Finalized integration specification",
      "Agreed-upon API contract",
      "Joint testing plan",
      "Implementation task breakdown"
    ],
    "meeting_format": "SYNCHRONOUS"
  }
}
```

---

### 9. ERROR_REPORT

**Purpose**: Report errors, issues, or unexpected problems

**Payload Schema**:
```json
{
  "error_id": "string (unique error identifier)",
  "error_type": "enum (TECHNICAL | PROCESS | COMMUNICATION | RESOURCE)",
  "severity": "enum (LOW | MEDIUM | HIGH | CRITICAL)",
  "error_description": "string (detailed error description)",
  "affected_systems": ["array of affected components"],
  "reproduction_steps": ["array of steps to reproduce"],
  "error_logs": "string (relevant log output)",
  "proposed_solution": "string (if known)",
  "workaround": "string (temporary fix if available)",
  "requires_immediate_attention": "boolean"
}
```

**Example**:
```json
{
  "message_id": "dd0e8400-e29b-41d4-a716-446655440008",
  "timestamp": "2025-11-10T11:30:00.000Z",
  "sender_id": "testing-qa-agent",
  "recipient_id": "gameplay-design-agent",
  "message_type": "ERROR_REPORT",
  "context_version": "v1.1.0",
  "priority": "HIGH",
  "tags": ["bug", "gameplay", "critical-path"],
  "payload": {
    "error_id": "ERR-001",
    "error_type": "TECHNICAL",
    "severity": "HIGH",
    "error_description": "Entropy collection fails when player performs rapid consecutive actions (>10 actions per second). The system drops events and logs buffer overflow warnings.",
    "affected_systems": [
      "entropy-collection-module",
      "gameplay-telemetry-system"
    ],
    "reproduction_steps": [
      "Start gameplay prototype",
      "Perform rapid movement actions (WASD spam)",
      "Observe console logs showing dropped events",
      "Check entropy buffer status - shows overflow"
    ],
    "error_logs": "ERROR: EntropyBuffer overflow at 1024 events. Dropping 127 events. Consider increasing buffer size or implementing backpressure.",
    "proposed_solution": "Implement rate limiting on client side or increase buffer size with backpressure mechanism to crypto wallet system",
    "workaround": "Currently limiting test scenarios to <5 actions per second",
    "requires_immediate_attention": true
  }
}
```

---

### 10. ANNOUNCEMENT

**Purpose**: Broadcast general information to all agents or groups

**Payload Schema**:
```json
{
  "announcement_id": "string (unique announcement identifier)",
  "announcement_type": "enum (GENERAL | MILESTONE | POLICY | CELEBRATION)",
  "title": "string (announcement title)",
  "content": "string (announcement body)",
  "call_to_action": "string (optional requested action)",
  "expires_at": "string (ISO8601, optional)",
  "acknowledgement_required": "boolean",
  "target_audience": ["array of agent identifiers or 'all']"
}
```

**Example**:
```json
{
  "message_id": "ee0e8400-e29b-41d4-a716-446655440009",
  "timestamp": "2025-11-10T17:00:00.000Z",
  "sender_id": "master-agent",
  "recipient_id": "council-group",
  "message_type": "ANNOUNCEMENT",
  "context_version": "v1.1.0",
  "priority": "MEDIUM",
  "tags": ["milestone", "celebration"],
  "payload": {
    "announcement_id": "ANN-001",
    "announcement_type": "MILESTONE",
    "title": "Phase 0 Successfully Completed!",
    "content": "Congratulations team! We have successfully completed Phase 0 (Foundation & Planning). All agents are initialized, the knowledge base is established, communication protocols are active, and we have made key technical decisions including selecting Godot as our game engine. We are now transitioning to Phase 1 (Core Game Engine Development). Thank you for your excellent collaboration and contributions!",
    "call_to_action": "Review your Phase 1 task assignments in KNOWLEDGE_BASE.md and prepare for the kickoff council meeting on 2025-11-11",
    "expires_at": null,
    "acknowledgement_required": true,
    "target_audience": ["all"]
  }
}
```

---

## Priority Levels

| Priority | Description | Response Time | Use Cases |
|----------|-------------|---------------|-----------|
| **LOW** | Informational, non-urgent | Within 48 hours | General updates, optional information sharing |
| **MEDIUM** | Standard priority | Within 24 hours | Routine task assignments, progress updates |
| **HIGH** | Important, time-sensitive | Within 8 hours | Critical task assignments, blocking issues, important decisions |
| **CRITICAL** | Urgent, project-blocking | Immediate (<2 hours) | Security issues, major blockers, emergency decisions |

---

## Recipient Types

### Individual Agents
- Format: `"agent-identifier"` (e.g., `"gameplay-design-agent"`)
- Message delivered to single agent

### Agent Groups
- **`"council-group"`**: All agents in the council (leadership team)
- **`"technical-group"`**: All technical implementation agents
- **`"design-group"`**: UI/UX and creative agents
- **`"security-group"`**: Security and audit agents
- **`"all"`**: Broadcast to all agents

---

## Context Versioning

The `context_version` field tracks the knowledge base state using semantic versioning:

- **Major version** (v**2**.0.0): Breaking changes, significant architectural shifts
- **Minor version** (v1.**1**.0): New features, significant updates, non-breaking changes
- **Patch version** (v1.0.**1**): Bug fixes, minor clarifications, typo corrections

Agents should reference the context version to ensure they're working with current project state.

---

## Message Threading

Use `thread_id` to link related messages:

1. Initial message creates a new thread (assigns unique `thread_id`)
2. Responses include the same `thread_id`
3. Enables conversation tracking and history

**Example Thread**:
```
TASK_ASSIGNMENT (thread_id: "thread-001")
  └─ PROGRESS_UPDATE (thread_id: "thread-001")
      └─ DATA_REQUEST (thread_id: "thread-001")
          └─ DATA_RESPONSE (thread_id: "thread-001")
              └─ PROGRESS_UPDATE (thread_id: "thread-001")
```

---

## Message Storage & Retrieval

### Storage Location
All messages are logged in:
```
/logs/agent-communications/
  ├── YYYY-MM/
  │   ├── DD/
  │   │   ├── agent-messages-YYYY-MM-DD.jsonl
  │   │   └── message-index-YYYY-MM-DD.json
```

### Message Index
For fast retrieval, maintain index by:
- `message_id`
- `sender_id`
- `recipient_id`
- `message_type`
- `thread_id`
- `timestamp`
- `tags`

### Retention Policy
- **Active messages**: Keep indefinitely
- **Completed threads**: Archive after 90 days
- **Expired messages**: Delete after expiration date

---

## Best Practices

### For Senders

1. **Be Specific**: Provide clear, actionable information
2. **Include Context**: Reference relevant documents and previous messages
3. **Set Appropriate Priority**: Don't over-prioritize routine messages
4. **Use Tags**: Help with message filtering and searching
5. **Follow Up**: Check for responses and acknowledgements

### For Recipients

1. **Respond Promptly**: Respect priority levels and deadlines
2. **Acknowledge Receipt**: Especially for HIGH/CRITICAL priority
3. **Ask for Clarification**: Don't assume unclear requirements
4. **Update Status**: Keep senders informed of progress
5. **Close Loops**: Confirm completion of requests

### For All Agents

1. **Version Awareness**: Always check and update `context_version`
2. **Thread Continuity**: Use `thread_id` for related conversations
3. **Documentation**: Reference messages in knowledge base updates
4. **Security**: Never include sensitive keys or credentials in messages
5. **Efficiency**: Batch related requests when possible

---

## Error Handling

### Invalid Message Format
- Sender receives validation error
- Message not delivered
- Sender must correct and resend

### Recipient Unavailable
- Message queued for delivery
- Sender notified of queue status
- Escalate to Master Agent if > 24 hours

### Context Version Mismatch
- Warning issued to both parties
- Agents should sync with latest knowledge base
- Proceed with caution or request context update

---

## Security Considerations

### Sensitive Data
- **Never** include private keys, passwords, or credentials in messages
- Use references to secure storage locations instead
- Mark messages containing sensitive info with `tags: ["sensitive"]`

### Access Control
- Some message types restricted to specific agent roles
- Council votes limited to council members
- Task assignments from Master Agent or authorized coordinators

### Audit Trail
- All messages logged with full trace
- Immutable message history
- Available for security audits and compliance

---

## Implementation Guidelines

### Message Creation
```python
import uuid
from datetime import datetime

def create_message(sender_id, recipient_id, message_type, payload, priority="MEDIUM"):
    return {
        "message_id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "sender_id": sender_id,
        "recipient_id": recipient_id,
        "message_type": message_type,
        "context_version": get_current_context_version(),
        "priority": priority,
        "payload": payload
    }
```

### Message Validation
```python
def validate_message(message):
    required_fields = [
        "message_id", "timestamp", "sender_id", 
        "recipient_id", "message_type", "context_version",
        "priority", "payload"
    ]
    
    for field in required_fields:
        if field not in message:
            raise ValueError(f"Missing required field: {field}")
    
    if message["message_type"] not in MESSAGE_TYPES:
        raise ValueError(f"Invalid message_type: {message['message_type']}")
    
    if message["priority"] not in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
        raise ValueError(f"Invalid priority: {message['priority']}")
    
    return True
```

### Message Sending
```python
def send_message(message):
    # Validate message
    validate_message(message)
    
    # Log message
    log_message(message)
    
    # Route to recipient
    route_message(message)
    
    # Return confirmation
    return {
        "status": "sent",
        "message_id": message["message_id"],
        "timestamp": message["timestamp"]
    }
```

---

## Examples by Use Case

### 1. Requesting Help from Another Agent
```json
{
  "message_id": "ff0e8400-e29b-41d4-a716-446655440010",
  "timestamp": "2025-11-10T10:00:00.000Z",
  "sender_id": "ui-ux-design-agent",
  "recipient_id": "gameplay-design-agent",
  "message_type": "DATA_REQUEST",
  "context_version": "v1.1.0",
  "priority": "MEDIUM",
  "payload": {
    "request_id": "REQ-002",
    "data_requested": [
      "hud-requirements-specification",
      "player-feedback-timing-requirements"
    ],
    "purpose": "Designing HUD layout and need to understand gameplay feedback requirements",
    "format_preference": "markdown with mockups if available",
    "urgency": "MEDIUM",
    "required_by": "2025-11-12T17:00:00.000Z",
    "context": "Working on Phase 1 HUD design. Need to ensure UI matches gameplay pacing and feedback needs.",
    "alternative_sources": []
  }
}
```

### 2. Reporting Task Completion
```json
{
  "message_id": "ab0e8400-e29b-41d4-a716-446655440011",
  "timestamp": "2025-11-11T18:00:00.000Z",
  "sender_id": "crypto-wallet-architect",
  "recipient_id": "master-agent",
  "message_type": "PROGRESS_UPDATE",
  "context_version": "v1.1.0",
  "priority": "HIGH",
  "payload": {
    "task_id": "TASK-002",
    "progress_percentage": 100,
    "status": "COMPLETED",
    "summary": "Wallet architecture design and entropy integration specification completed successfully.",
    "accomplishments": [
      "Finalized wallet architecture with modular entropy system",
      "Created comprehensive security documentation",
      "Designed Fourier transform-based entropy analysis algorithm",
      "Completed integration API specification",
      "Passed security audit review"
    ],
    "next_steps": [
      "Begin implementation in Phase 2",
      "Coordinate with gameplay agent on entropy collection implementation"
    ],
    "blockers": [],
    "updated_deliverables": [
      "docs/wallet-architecture-v1.0.md",
      "specs/entropy-integration-api-v1.0.md",
      "specs/security-threat-model-v1.0.md"
    ],
    "estimated_completion": "2025-11-11T18:00:00.000Z",
    "requires_assistance": false,
    "assistance_needed": ""
  }
}
```

### 3. Escalating a Blocker
```json
{
  "message_id": "cd0e8400-e29b-41d4-a716-446655440012",
  "timestamp": "2025-11-12T09:00:00.000Z",
  "sender_id": "blockchain-integration-agent",
  "recipient_id": "master-agent",
  "message_type": "ERROR_REPORT",
  "context_version": "v1.1.0",
  "priority": "CRITICAL",
  "tags": ["blocker", "resource", "urgent"],
  "payload": {
    "error_id": "ERR-002",
    "error_type": "RESOURCE",
    "severity": "CRITICAL",
    "error_description": "Cannot proceed with Solana testnet deployment. Require access to Solana testnet SOL for deployment and testing. Current balance: 0 SOL. Need minimum 10 SOL for planned tests.",
    "affected_systems": [
      "blockchain-integration-module",
      "smart-contract-deployment-pipeline"
    ],
    "reproduction_steps": [
      "Attempted to deploy test contract to Solana devnet",
      "Transaction failed due to insufficient balance",
      "Checked wallet: 0 SOL available"
    ],
    "error_logs": "Error: Transaction failed - Insufficient funds for transaction",
    "proposed_solution": "Request testnet SOL from faucet or stakeholder to fund testing wallet",
    "workaround": "None - this is blocking all blockchain development work",
    "requires_immediate_attention": true
  }
}
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-06 | Initial protocol specification |

---

*This protocol is living documentation and will evolve as the project grows. All agents should reference this document for communication standards.*
