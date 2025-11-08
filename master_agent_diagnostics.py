#!/usr/bin/env python3
"""
Master Agent Diagnostic and Debugging System

This module provides comprehensive diagnostics for the multi-agent AI system
developing the metaverse game platform.

Usage:
    python master_agent_diagnostics.py [--verbose] [--report-file OUTPUT.json]
"""

import json
import sys
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import uuid


class Severity(Enum):
    """Issue severity levels"""
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class IssueType(Enum):
    """Types of diagnostic issues"""
    CONTEXT_SYNC = "CONTEXT_SYNC"
    MESSAGE_INTEGRITY = "MESSAGE_INTEGRITY"
    TASK_ASSIGNMENT = "TASK_ASSIGNMENT"
    CONSENSUS_DEADLOCK = "CONSENSUS_DEADLOCK"
    PROGRESS_STALL = "PROGRESS_STALL"
    ERROR_HANDLING = "ERROR_HANDLING"


@dataclass
class DiagnosticIssue:
    """Represents a diagnostic issue found in the system"""
    issue_id: str
    timestamp: str
    severity: Severity
    issue_type: IssueType
    description: str
    affected_entities: List[str]
    corrective_action: str
    action_taken: bool
    requires_human_intervention: bool
    metadata: Dict[str, Any]


@dataclass
class DiagnosticReport:
    """Complete diagnostic report"""
    report_id: str
    timestamp: str
    system_version: str
    total_agents: int
    total_tasks: int
    total_messages: int
    issues_found: List[DiagnosticIssue]
    summary: Dict[str, Any]
    recommendations: List[str]
    escalations: List[str]


class MasterAgentDiagnostics:
    """Master Agent diagnostic and debugging system"""
    
    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.issues: List[DiagnosticIssue] = []
        self.log_buffer: List[str] = []
        
    def log(self, message: str, level: str = "INFO"):
        """Log diagnostic messages"""
        timestamp = datetime.utcnow().isoformat()
        log_entry = f"[{timestamp}] [{level}] {message}"
        self.log_buffer.append(log_entry)
        if self.verbose:
            print(log_entry)
    
    def add_issue(self, 
                  severity: Severity,
                  issue_type: IssueType,
                  description: str,
                  affected_entities: List[str],
                  corrective_action: str,
                  action_taken: bool = False,
                  requires_human: bool = False,
                  metadata: Optional[Dict[str, Any]] = None):
        """Record a diagnostic issue"""
        issue = DiagnosticIssue(
            issue_id=str(uuid.uuid4()),
            timestamp=datetime.utcnow().isoformat() + "Z",
            severity=severity,
            issue_type=issue_type,
            description=description,
            affected_entities=affected_entities,
            corrective_action=corrective_action,
            action_taken=action_taken,
            requires_human_intervention=requires_human,
            metadata=metadata or {}
        )
        self.issues.append(issue)
        self.log(f"{severity.value}: {description}", severity.value)
    
    # =========================================================================
    # 1. CONTEXT SYNCHRONIZATION VALIDATION
    # =========================================================================
    
    def validate_context_sync(self, system_state: Dict[str, Any]) -> int:
        """
        Validate that all agents are synchronized with the latest knowledge base.
        
        Returns:
            Number of issues found
        """
        self.log("=" * 80)
        self.log("DIAGNOSTIC CHECK 1: Context Synchronization Validation")
        self.log("=" * 80)
        
        issues_count = 0
        
        # Get latest knowledge base version
        kb = system_state.get('knowledge_base', {})
        latest_version = kb.get('latest_version', 'v1.0.0')
        self.log(f"Latest knowledge base version: {latest_version}")
        
        # Check each agent's context version
        agents = system_state.get('agents', [])
        self.log(f"Checking {len(agents)} agents...")
        
        for agent in agents:
            agent_id = agent.get('id', 'unknown')
            agent_version = agent.get('context_version', None)
            
            if not agent_version:
                self.add_issue(
                    severity=Severity.ERROR,
                    issue_type=IssueType.CONTEXT_SYNC,
                    description=f"Agent {agent_id} has no context_version set",
                    affected_entities=[agent_id],
                    corrective_action=f"Initialize {agent_id} with current knowledge base version {latest_version}",
                    action_taken=True,
                    metadata={'agent_id': agent_id, 'missing_version': True}
                )
                # Auto-fix: Set to latest version
                agent['context_version'] = latest_version
                agent['action'] = 'refresh_context'
                issues_count += 1
                
            elif agent_version != latest_version:
                version_lag = self._calculate_version_lag(agent_version, latest_version)
                severity = Severity.WARNING if version_lag == 1 else Severity.ERROR
                
                self.add_issue(
                    severity=severity,
                    issue_type=IssueType.CONTEXT_SYNC,
                    description=f"Agent {agent_id} context out of sync (has {agent_version}, latest is {latest_version})",
                    affected_entities=[agent_id],
                    corrective_action=f"Trigger forced context refresh for {agent_id}",
                    action_taken=True,
                    metadata={
                        'agent_id': agent_id,
                        'current_version': agent_version,
                        'latest_version': latest_version,
                        'version_lag': version_lag
                    }
                )
                # Auto-fix: Trigger refresh
                agent['action'] = 'refresh_context'
                agent['needs_sync'] = True
                issues_count += 1
            else:
                self.log(f"  ✓ {agent_id}: In sync ({agent_version})")
        
        if issues_count == 0:
            self.log("✓ All agents are synchronized with latest knowledge base")
        else:
            self.log(f"✗ Found {issues_count} context synchronization issues")
        
        return issues_count
    
    def _calculate_version_lag(self, current: str, latest: str) -> int:
        """Calculate how many versions behind an agent is"""
        try:
            current_parts = [int(x) for x in current.replace('v', '').split('.')]
            latest_parts = [int(x) for x in latest.replace('v', '').split('.')]
            
            # Simple lag calculation (major + minor differences)
            major_lag = latest_parts[0] - current_parts[0]
            minor_lag = latest_parts[1] - current_parts[1]
            return major_lag * 10 + minor_lag
        except:
            return 999  # Unknown lag
    
    # =========================================================================
    # 2. MESSAGE INTEGRITY VALIDATION
    # =========================================================================
    
    def verify_message_integrity(self, messages: List[Dict[str, Any]]) -> int:
        """
        Validate message structures against the communication protocol schema.
        
        Returns:
            Number of issues found
        """
        self.log("=" * 80)
        self.log("DIAGNOSTIC CHECK 2: Message Integrity Validation")
        self.log("=" * 80)
        
        issues_count = 0
        self.log(f"Validating {len(messages)} messages...")
        
        # Define required fields for message schema
        required_fields = [
            'message_id', 'timestamp', 'sender_id', 'recipient_id',
            'message_type', 'context_version', 'priority', 'payload'
        ]
        
        valid_message_types = [
            'TASK_ASSIGNMENT', 'PROGRESS_UPDATE', 'DATA_REQUEST', 'DATA_RESPONSE',
            'DECISION_VOTE', 'DECISION_VOTE_RESPONSE', 'CONTEXT_UPDATE',
            'COLLABORATION_REQUEST', 'ERROR_REPORT', 'ANNOUNCEMENT'
        ]
        
        valid_priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        
        for idx, msg in enumerate(messages):
            msg_id = msg.get('message_id', f'message-{idx}')
            validation_errors = []
            
            # Check required fields
            missing_fields = [field for field in required_fields if field not in msg]
            if missing_fields:
                validation_errors.append(f"Missing required fields: {', '.join(missing_fields)}")
            
            # Validate message_type
            msg_type = msg.get('message_type')
            if msg_type and msg_type not in valid_message_types:
                validation_errors.append(f"Invalid message_type: {msg_type}")
            
            # Validate priority
            priority = msg.get('priority')
            if priority and priority not in valid_priorities:
                validation_errors.append(f"Invalid priority: {priority}")
            
            # Validate timestamp format
            timestamp = msg.get('timestamp')
            if timestamp and not self._is_valid_iso8601(timestamp):
                validation_errors.append(f"Invalid timestamp format: {timestamp}")
            
            # Validate UUID format for message_id
            if msg_id and not self._is_valid_uuid(msg_id):
                validation_errors.append(f"Invalid message_id format (not UUID): {msg_id}")
            
            # Check payload exists and is dict
            payload = msg.get('payload')
            if payload is None:
                validation_errors.append("Payload is missing or null")
            elif not isinstance(payload, dict):
                validation_errors.append(f"Payload is not a dict: {type(payload)}")
            
            # Report errors if any
            if validation_errors:
                severity = Severity.CRITICAL if 'message_id' in missing_fields else Severity.ERROR
                
                self.add_issue(
                    severity=severity,
                    issue_type=IssueType.MESSAGE_INTEGRITY,
                    description=f"Malformed message from {msg.get('sender_id', 'unknown')} to {msg.get('recipient_id', 'unknown')}",
                    affected_entities=[msg.get('sender_id', 'unknown'), msg.get('recipient_id', 'unknown')],
                    corrective_action=f"Message dropped. Sender must retransmit with valid schema. Errors: {'; '.join(validation_errors)}",
                    action_taken=True,
                    requires_human=severity == Severity.CRITICAL,
                    metadata={
                        'message_id': msg_id,
                        'validation_errors': validation_errors,
                        'message_sample': str(msg)[:200]
                    }
                )
                issues_count += 1
            else:
                self.log(f"  ✓ Message {msg_id[:8]}... valid")
        
        if issues_count == 0:
            self.log("✓ All messages passed integrity validation")
        else:
            self.log(f"✗ Found {issues_count} message integrity issues")
        
        return issues_count
    
    def _is_valid_iso8601(self, timestamp: str) -> bool:
        """Validate ISO8601 timestamp format"""
        try:
            datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            return True
        except:
            return False
    
    def _is_valid_uuid(self, uuid_string: str) -> bool:
        """Validate UUID format"""
        try:
            uuid.UUID(uuid_string)
            return True
        except:
            return False
    
    # =========================================================================
    # 3. TASK ASSIGNMENT VALIDATION
    # =========================================================================
    
    def confirm_task_assignments(self, tasks: List[Dict[str, Any]], agents: List[Dict[str, Any]]) -> int:
        """
        Verify all tasks are properly assigned and aligned with project milestones.
        
        Returns:
            Number of issues found
        """
        self.log("=" * 80)
        self.log("DIAGNOSTIC CHECK 3: Task Assignment Validation")
        self.log("=" * 80)
        
        issues_count = 0
        self.log(f"Validating {len(tasks)} tasks across {len(agents)} agents...")
        
        agent_ids = {agent.get('id') for agent in agents}
        
        # Check for unassigned tasks
        unassigned_tasks = [t for t in tasks if not t.get('assigned_to') or t.get('assigned_to') is None]
        
        if unassigned_tasks:
            task_titles = [t.get('task_title', t.get('task_id', 'unknown')) for t in unassigned_tasks]
            self.add_issue(
                severity=Severity.ERROR,
                issue_type=IssueType.TASK_ASSIGNMENT,
                description=f"{len(unassigned_tasks)} tasks are unassigned or unclaimed",
                affected_entities=['master-agent', 'meta-agent-council-manager'],
                corrective_action=f"Assign tasks to appropriate agents based on specialization: {', '.join(task_titles[:5])}{'...' if len(task_titles) > 5 else ''}",
                action_taken=False,
                requires_human=True,
                metadata={'unassigned_tasks': [t.get('task_id') for t in unassigned_tasks]}
            )
            issues_count += len(unassigned_tasks)
        
        # Check for tasks assigned to non-existent agents
        for task in tasks:
            assigned_to = task.get('assigned_to')
            if assigned_to and assigned_to not in agent_ids:
                self.add_issue(
                    severity=Severity.ERROR,
                    issue_type=IssueType.TASK_ASSIGNMENT,
                    description=f"Task {task.get('task_id', 'unknown')} assigned to non-existent agent: {assigned_to}",
                    affected_entities=[assigned_to],
                    corrective_action=f"Reassign task to valid agent or create agent {assigned_to}",
                    action_taken=False,
                    requires_human=True,
                    metadata={'task_id': task.get('task_id'), 'invalid_agent': assigned_to}
                )
                issues_count += 1
        
        # Check for ambiguous or incomplete task definitions
        for task in tasks:
            task_id = task.get('task_id', 'unknown')
            problems = []
            
            if not task.get('task_description'):
                problems.append("missing description")
            if not task.get('due_date'):
                problems.append("missing due_date")
            if not task.get('deliverables'):
                problems.append("missing deliverables")
            if not task.get('acceptance_criteria'):
                problems.append("missing acceptance_criteria")
            
            if problems:
                self.add_issue(
                    severity=Severity.WARNING,
                    issue_type=IssueType.TASK_ASSIGNMENT,
                    description=f"Task {task_id} has incomplete definition: {', '.join(problems)}",
                    affected_entities=[task.get('assigned_to', 'unassigned')],
                    corrective_action=f"Complete task definition by adding: {', '.join(problems)}",
                    action_taken=False,
                    requires_human=False,
                    metadata={'task_id': task_id, 'missing_fields': problems}
                )
                issues_count += 1
        
        # Check for overdue tasks
        now = datetime.utcnow()
        for task in tasks:
            due_date_str = task.get('due_date')
            if due_date_str:
                try:
                    due_date = datetime.fromisoformat(due_date_str.replace('Z', '+00:00'))
                    if due_date < now and task.get('status') != 'COMPLETED':
                        days_overdue = (now - due_date).days
                        severity = Severity.CRITICAL if days_overdue > 7 else Severity.WARNING
                        
                        self.add_issue(
                            severity=severity,
                            issue_type=IssueType.PROGRESS_STALL,
                            description=f"Task {task.get('task_id', 'unknown')} is {days_overdue} days overdue",
                            affected_entities=[task.get('assigned_to', 'unknown')],
                            corrective_action=f"Investigate blocker and either extend deadline or escalate to Master Agent",
                            action_taken=False,
                            requires_human=days_overdue > 7,
                            metadata={'task_id': task.get('task_id'), 'days_overdue': days_overdue}
                        )
                        issues_count += 1
                except:
                    pass
        
        if issues_count == 0:
            self.log("✓ All tasks are properly assigned and defined")
        else:
            self.log(f"✗ Found {issues_count} task assignment issues")
        
        return issues_count
    
    # =========================================================================
    # 4. CONSENSUS WORKFLOW MONITORING
    # =========================================================================
    
    def monitor_consensus_workflow(self, council_votes: List[Dict[str, Any]]) -> int:
        """
        Assess council voting processes for timeliness and coherent decisions.
        
        Returns:
            Number of issues found
        """
        self.log("=" * 80)
        self.log("DIAGNOSTIC CHECK 4: Consensus Workflow Monitoring")
        self.log("=" * 80)
        
        issues_count = 0
        self.log(f"Monitoring {len(council_votes)} council votes...")
        
        now = datetime.utcnow()
        
        for vote in council_votes:
            decision_id = vote.get('decision_id', 'unknown')
            decision_title = vote.get('decision_title', 'Untitled Decision')
            
            # Check if vote is decided
            is_decided = vote.get('decided', False)
            voting_deadline_str = vote.get('voting_deadline')
            
            if not is_decided and voting_deadline_str:
                try:
                    deadline = datetime.fromisoformat(voting_deadline_str.replace('Z', '+00:00'))
                    
                    # Check if deadline has passed
                    if deadline < now:
                        hours_overdue = (now - deadline).total_seconds() / 3600
                        
                        # Check for deadlock
                        current_votes = vote.get('current_votes', [])
                        required_voters = vote.get('required_voters', [])
                        minimum_votes = vote.get('minimum_votes', len(required_voters))
                        
                        if len(current_votes) < minimum_votes:
                            self.add_issue(
                                severity=Severity.CRITICAL,
                                issue_type=IssueType.CONSENSUS_DEADLOCK,
                                description=f"Decision {decision_id} ({decision_title}) missed deadline by {hours_overdue:.1f} hours - insufficient votes",
                                affected_entities=['meta-agent-council-manager', 'master-agent'] + required_voters,
                                corrective_action=f"Trigger emergency council meeting or Master Agent decision override",
                                action_taken=False,
                                requires_human=True,
                                metadata={
                                    'decision_id': decision_id,
                                    'votes_received': len(current_votes),
                                    'votes_required': minimum_votes,
                                    'hours_overdue': hours_overdue
                                }
                            )
                            issues_count += 1
                        else:
                            # Check for tie/deadlock
                            vote_counts = {}
                            for v in current_votes:
                                option = v.get('option_id')
                                vote_counts[option] = vote_counts.get(option, 0) + 1
                            
                            max_votes = max(vote_counts.values()) if vote_counts else 0
                            tied_options = [opt for opt, count in vote_counts.items() if count == max_votes]
                            
                            if len(tied_options) > 1:
                                self.add_issue(
                                    severity=Severity.ERROR,
                                    issue_type=IssueType.CONSENSUS_DEADLOCK,
                                    description=f"Decision {decision_id} ({decision_title}) is deadlocked - tie between options: {', '.join(tied_options)}",
                                    affected_entities=['meta-agent-council-manager', 'master-agent'],
                                    corrective_action="Invoke Master Agent tie-breaking vote",
                                    action_taken=False,
                                    requires_human=True,
                                    metadata={
                                        'decision_id': decision_id,
                                        'tied_options': tied_options,
                                        'vote_counts': vote_counts
                                    }
                                )
                                issues_count += 1
                            else:
                                self.add_issue(
                                    severity=Severity.WARNING,
                                    issue_type=IssueType.CONSENSUS_DEADLOCK,
                                    description=f"Decision {decision_id} ({decision_title}) past deadline but has sufficient votes - needs finalization",
                                    affected_entities=['meta-agent-council-manager'],
                                    corrective_action="Finalize vote and publish decision",
                                    action_taken=False,
                                    requires_human=False,
                                    metadata={'decision_id': decision_id, 'winning_option': tied_options[0]}
                                )
                                issues_count += 1
                    
                    # Check if approaching deadline with insufficient votes
                    elif deadline - now < timedelta(hours=4):
                        current_votes = vote.get('current_votes', [])
                        minimum_votes = vote.get('minimum_votes', 1)
                        
                        if len(current_votes) < minimum_votes:
                            self.add_issue(
                                severity=Severity.WARNING,
                                issue_type=IssueType.CONSENSUS_DEADLOCK,
                                description=f"Decision {decision_id} ({decision_title}) deadline approaching in <4 hours with insufficient votes",
                                affected_entities=['meta-agent-council-manager'] + vote.get('required_voters', []),
                                corrective_action="Send reminder to required voters",
                                action_taken=True,
                                requires_human=False,
                                metadata={
                                    'decision_id': decision_id,
                                    'votes_received': len(current_votes),
                                    'votes_required': minimum_votes
                                }
                            )
                            issues_count += 1
                    
                except Exception as e:
                    self.log(f"  Error parsing vote deadline: {e}", "ERROR")
        
        if issues_count == 0:
            self.log("✓ All consensus workflows are functioning properly")
        else:
            self.log(f"✗ Found {issues_count} consensus workflow issues")
        
        return issues_count
    
    # =========================================================================
    # 5. PROGRESS TRACKING & BOTTLENECK DETECTION
    # =========================================================================
    
    def track_progress_and_bottlenecks(self, tasks: List[Dict[str, Any]], 
                                       progress_updates: List[Dict[str, Any]]) -> int:
        """
        Aggregate progress reports and detect stalled modules.
        
        Returns:
            Number of issues found
        """
        self.log("=" * 80)
        self.log("DIAGNOSTIC CHECK 5: Progress Tracking & Bottleneck Detection")
        self.log("=" * 80)
        
        issues_count = 0
        self.log(f"Analyzing progress across {len(tasks)} tasks...")
        
        now = datetime.utcnow()
        
        # Map latest progress updates to tasks
        task_progress = {}
        for update in progress_updates:
            task_id = update.get('payload', {}).get('task_id')
            if task_id:
                if task_id not in task_progress or update.get('timestamp', '') > task_progress[task_id].get('timestamp', ''):
                    task_progress[task_id] = update
        
        # Analyze each task for stalls and bottlenecks
        for task in tasks:
            task_id = task.get('task_id')
            status = task.get('status', 'UNKNOWN')
            
            if status == 'COMPLETED':
                continue  # Skip completed tasks
            
            # Check for stalled tasks (low progress + deadline passed/approaching)
            progress_pct = task.get('progress_percentage', 0)
            due_date_str = task.get('due_date')
            
            if due_date_str:
                try:
                    due_date = datetime.fromisoformat(due_date_str.replace('Z', '+00:00'))
                    days_until_due = (due_date - now).days
                    deadline_passed = due_date < now
                    
                    # Stalled: <10% progress and deadline passed
                    if progress_pct < 10 and deadline_passed:
                        latest_update = task_progress.get(task_id)
                        blockers = latest_update.get('payload', {}).get('blockers', []) if latest_update else []
                        
                        self.add_issue(
                            severity=Severity.CRITICAL,
                            issue_type=IssueType.PROGRESS_STALL,
                            description=f"Task {task_id} is stalled: {progress_pct}% complete, deadline passed {abs(days_until_due)} days ago",
                            affected_entities=[task.get('assigned_to', 'unknown')],
                            corrective_action=f"Investigate blocker(s): {'; '.join([b.get('description', 'unknown') for b in blockers]) if blockers else 'No blockers reported - check agent status'}",
                            action_taken=False,
                            requires_human=True,
                            metadata={
                                'task_id': task_id,
                                'progress': progress_pct,
                                'days_overdue': abs(days_until_due),
                                'blockers': blockers
                            }
                        )
                        issues_count += 1
                    
                    # At risk: <50% progress and <3 days until deadline
                    elif progress_pct < 50 and 0 <= days_until_due < 3:
                        self.add_issue(
                            severity=Severity.WARNING,
                            issue_type=IssueType.PROGRESS_STALL,
                            description=f"Task {task_id} at risk: {progress_pct}% complete with only {days_until_due} days until deadline",
                            affected_entities=[task.get('assigned_to', 'unknown')],
                            corrective_action="Request status update and consider resource reallocation",
                            action_taken=False,
                            requires_human=False,
                            metadata={
                                'task_id': task_id,
                                'progress': progress_pct,
                                'days_remaining': days_until_due
                            }
                        )
                        issues_count += 1
                    
                except Exception as e:
                    self.log(f"  Error parsing due date for task {task_id}: {e}", "ERROR")
            
            # Check for blocked tasks
            if status == 'BLOCKED':
                latest_update = task_progress.get(task_id)
                blockers = latest_update.get('payload', {}).get('blockers', []) if latest_update else []
                
                high_severity_blockers = [b for b in blockers if b.get('severity') in ['HIGH', 'CRITICAL']]
                
                if high_severity_blockers:
                    self.add_issue(
                        severity=Severity.ERROR,
                        issue_type=IssueType.PROGRESS_STALL,
                        description=f"Task {task_id} blocked by {len(high_severity_blockers)} high-severity blocker(s)",
                        affected_entities=[task.get('assigned_to', 'unknown')] + [b.get('blocking_agent', '') for b in high_severity_blockers if b.get('blocking_agent')],
                        corrective_action=f"Prioritize resolution of blockers: {'; '.join([b.get('description', 'unknown') for b in high_severity_blockers])}",
                        action_taken=False,
                        requires_human=True,
                        metadata={
                            'task_id': task_id,
                            'blockers': high_severity_blockers
                        }
                    )
                    issues_count += 1
        
        # Detect agent-level bottlenecks (multiple tasks stalled for same agent)
        agent_stalls = {}
        for issue in self.issues:
            if issue.issue_type == IssueType.PROGRESS_STALL:
                for entity in issue.affected_entities:
                    if entity != 'unknown':
                        agent_stalls[entity] = agent_stalls.get(entity, 0) + 1
        
        for agent, stall_count in agent_stalls.items():
            if stall_count >= 3:
                self.add_issue(
                    severity=Severity.CRITICAL,
                    issue_type=IssueType.PROGRESS_STALL,
                    description=f"Agent {agent} has {stall_count} stalled/at-risk tasks - possible bottleneck",
                    affected_entities=[agent, 'master-agent'],
                    corrective_action=f"Investigate agent capacity, redistribute workload, or provide additional support",
                    action_taken=False,
                    requires_human=True,
                    metadata={'agent_id': agent, 'stalled_tasks': stall_count}
                )
                issues_count += 1
        
        if issues_count == 0:
            self.log("✓ All tasks are progressing on schedule")
        else:
            self.log(f"✗ Found {issues_count} progress/bottleneck issues")
        
        return issues_count
    
    # =========================================================================
    # 6. ERROR HANDLING EVALUATION
    # =========================================================================
    
    def evaluate_error_handling(self, error_reports: List[Dict[str, Any]]) -> int:
        """
        Audit recent errors or exceptions and apply fallback procedures.
        
        Returns:
            Number of issues found
        """
        self.log("=" * 80)
        self.log("DIAGNOSTIC CHECK 6: Error Handling Evaluation")
        self.log("=" * 80)
        
        issues_count = 0
        self.log(f"Auditing {len(error_reports)} error reports...")
        
        now = datetime.utcnow()
        recent_cutoff = now - timedelta(hours=24)
        
        # Filter to recent errors
        recent_errors = []
        for error in error_reports:
            error_time_str = error.get('timestamp')
            if error_time_str:
                try:
                    error_time = datetime.fromisoformat(error_time_str.replace('Z', '+00:00'))
                    if error_time >= recent_cutoff:
                        recent_errors.append(error)
                except:
                    pass
        
        self.log(f"Found {len(recent_errors)} errors in last 24 hours")
        
        # Group errors by type and severity
        critical_errors = [e for e in recent_errors if e.get('payload', {}).get('severity') == 'CRITICAL']
        high_errors = [e for e in recent_errors if e.get('payload', {}).get('severity') == 'HIGH']
        unresolved_errors = [e for e in recent_errors if e.get('payload', {}).get('requires_immediate_attention')]
        
        # Critical errors requiring immediate attention
        if critical_errors:
            for error in critical_errors:
                payload = error.get('payload', {})
                self.add_issue(
                    severity=Severity.CRITICAL,
                    issue_type=IssueType.ERROR_HANDLING,
                    description=f"Critical error from {error.get('sender_id', 'unknown')}: {payload.get('error_description', 'No description')}",
                    affected_entities=[error.get('sender_id', 'unknown')] + payload.get('affected_systems', []),
                    corrective_action=payload.get('proposed_solution', 'No solution proposed - requires investigation'),
                    action_taken=False,
                    requires_human=True,
                    metadata={
                        'error_id': payload.get('error_id'),
                        'error_type': payload.get('error_type'),
                        'severity': payload.get('severity')
                    }
                )
                issues_count += 1
        
        # Recurring errors (same error_type from same agent)
        error_patterns = {}
        for error in recent_errors:
            sender = error.get('sender_id', 'unknown')
            error_type = error.get('payload', {}).get('error_type', 'unknown')
            key = f"{sender}:{error_type}"
            error_patterns[key] = error_patterns.get(key, 0) + 1
        
        for pattern, count in error_patterns.items():
            if count >= 3:
                sender, error_type = pattern.split(':')
                self.add_issue(
                    severity=Severity.ERROR,
                    issue_type=IssueType.ERROR_HANDLING,
                    description=f"Recurring error pattern: {error_type} from {sender} occurred {count} times in 24 hours",
                    affected_entities=[sender, 'master-agent'],
                    corrective_action=f"Investigate root cause of recurring {error_type} errors from {sender}",
                    action_taken=False,
                    requires_human=True,
                    metadata={'pattern': pattern, 'occurrence_count': count}
                )
                issues_count += 1
        
        # Unresolved high-priority errors
        if high_errors:
            self.log(f"  {len(high_errors)} high-severity errors in last 24 hours")
            for error in high_errors:
                payload = error.get('payload', {})
                workaround = payload.get('workaround')
                if not workaround:
                    self.add_issue(
                        severity=Severity.WARNING,
                        issue_type=IssueType.ERROR_HANDLING,
                        description=f"High-severity error from {error.get('sender_id', 'unknown')} has no workaround: {payload.get('error_description', 'No description')[:100]}",
                        affected_entities=[error.get('sender_id', 'unknown')],
                        corrective_action="Provide workaround or escalate to resolution team",
                        action_taken=False,
                        requires_human=False,
                        metadata={'error_id': payload.get('error_id')}
                    )
                    issues_count += 1
        
        if issues_count == 0:
            self.log("✓ Error handling is functioning properly")
        else:
            self.log(f"✗ Found {issues_count} error handling issues")
        
        return issues_count
    
    # =========================================================================
    # REPORT GENERATION
    # =========================================================================
    
    def generate_report(self, system_state: Dict[str, Any]) -> DiagnosticReport:
        """Generate comprehensive diagnostic report"""
        self.log("=" * 80)
        self.log("GENERATING DIAGNOSTIC REPORT")
        self.log("=" * 80)
        
        # Calculate summary statistics
        severity_counts = {
            'INFO': 0,
            'WARNING': 0,
            'ERROR': 0,
            'CRITICAL': 0
        }
        
        type_counts = {}
        requires_human_count = 0
        
        for issue in self.issues:
            severity_counts[issue.severity.value] += 1
            type_counts[issue.issue_type.value] = type_counts.get(issue.issue_type.value, 0) + 1
            if issue.requires_human_intervention:
                requires_human_count += 1
        
        # Generate recommendations
        recommendations = []
        if severity_counts['CRITICAL'] > 0:
            recommendations.append(f"URGENT: Address {severity_counts['CRITICAL']} critical issues immediately")
        if severity_counts['ERROR'] > 3:
            recommendations.append(f"High error count ({severity_counts['ERROR']}) - schedule emergency council meeting")
        if type_counts.get('CONTEXT_SYNC', 0) > 2:
            recommendations.append("Multiple context sync issues - trigger full knowledge base refresh for all agents")
        if type_counts.get('PROGRESS_STALL', 0) > 2:
            recommendations.append("Multiple stalled tasks - review project timeline and resource allocation")
        if type_counts.get('CONSENSUS_DEADLOCK', 0) > 0:
            recommendations.append("Consensus deadlocks detected - Master Agent intervention required")
        
        if not recommendations:
            recommendations.append("System is operating within normal parameters")
        
        # Generate escalations
        escalations = []
        for issue in self.issues:
            if issue.requires_human_intervention:
                escalations.append(
                    f"[{issue.severity.value}] {issue.issue_type.value}: {issue.description} "
                    f"(Affects: {', '.join(issue.affected_entities[:3])})"
                )
        
        report = DiagnosticReport(
            report_id=str(uuid.uuid4()),
            timestamp=datetime.utcnow().isoformat() + "Z",
            system_version=system_state.get('knowledge_base', {}).get('latest_version', 'unknown'),
            total_agents=len(system_state.get('agents', [])),
            total_tasks=len(system_state.get('tasks', [])),
            total_messages=len(system_state.get('messages', [])),
            issues_found=self.issues,
            summary={
                'total_issues': len(self.issues),
                'by_severity': severity_counts,
                'by_type': type_counts,
                'requires_human_intervention': requires_human_count
            },
            recommendations=recommendations,
            escalations=escalations
        )
        
        return report
    
    def print_report(self, report: DiagnosticReport):
        """Print formatted diagnostic report"""
        print("\n" + "=" * 80)
        print("MASTER AGENT DIAGNOSTIC REPORT")
        print("=" * 80)
        print(f"Report ID: {report.report_id}")
        print(f"Timestamp: {report.timestamp}")
        print(f"System Version: {report.system_version}")
        print(f"\nSystem Overview:")
        print(f"  Agents: {report.total_agents}")
        print(f"  Tasks: {report.total_tasks}")
        print(f"  Messages Processed: {report.total_messages}")
        
        print(f"\n{'─' * 80}")
        print("SUMMARY")
        print("─" * 80)
        print(f"Total Issues Found: {report.summary['total_issues']}")
        print(f"\nBy Severity:")
        for severity, count in report.summary['by_severity'].items():
            icon = "🔴" if severity == "CRITICAL" else "🟠" if severity == "ERROR" else "🟡" if severity == "WARNING" else "⚪"
            print(f"  {icon} {severity:10s}: {count}")
        
        print(f"\nBy Type:")
        for issue_type, count in report.summary['by_type'].items():
            print(f"  • {issue_type:20s}: {count}")
        
        print(f"\nRequires Human Intervention: {report.summary['requires_human_intervention']}")
        
        if report.issues_found:
            print(f"\n{'─' * 80}")
            print("DETAILED ISSUES")
            print("─" * 80)
            for i, issue in enumerate(report.issues_found, 1):
                icon = "🔴" if issue.severity.value == "CRITICAL" else "🟠" if issue.severity.value == "ERROR" else "🟡" if issue.severity.value == "WARNING" else "⚪"
                print(f"\n{i}. {icon} [{issue.severity.value}] {issue.issue_type.value}")
                print(f"   {issue.description}")
                print(f"   Affected: {', '.join(issue.affected_entities[:5])}")
                print(f"   Action: {issue.corrective_action}")
                if issue.requires_human_intervention:
                    print(f"   ⚠️  REQUIRES HUMAN INTERVENTION")
        
        print(f"\n{'─' * 80}")
        print("RECOMMENDATIONS")
        print("─" * 80)
        for i, rec in enumerate(report.recommendations, 1):
            print(f"{i}. {rec}")
        
        if report.escalations:
            print(f"\n{'─' * 80}")
            print("ESCALATIONS TO HUMAN SUPERVISORS")
            print("─" * 80)
            for i, esc in enumerate(report.escalations, 1):
                print(f"{i}. {esc}")
        
        print("\n" + "=" * 80)
        print("END OF DIAGNOSTIC REPORT")
        print("=" * 80 + "\n")


def debug_master_agent(system_state: Dict[str, Any], 
                       messages: List[Dict[str, Any]],
                       tasks: List[Dict[str, Any]],
                       council_votes: List[Dict[str, Any]],
                       progress_updates: List[Dict[str, Any]],
                       error_reports: List[Dict[str, Any]],
                       verbose: bool = False) -> DiagnosticReport:
    """
    Main diagnostic function for Master Agent system.
    
    Args:
        system_state: Current state of the system including agents and knowledge base
        messages: List of inter-agent messages
        tasks: List of project tasks
        council_votes: List of pending/completed council votes
        progress_updates: List of progress update messages
        error_reports: List of error report messages
        verbose: Enable verbose logging
    
    Returns:
        DiagnosticReport with findings and recommendations
    """
    diagnostics = MasterAgentDiagnostics(verbose=verbose)
    
    # Run all diagnostic checks
    diagnostics.validate_context_sync(system_state)
    diagnostics.verify_message_integrity(messages)
    diagnostics.confirm_task_assignments(tasks, system_state.get('agents', []))
    diagnostics.monitor_consensus_workflow(council_votes)
    diagnostics.track_progress_and_bottlenecks(tasks, progress_updates)
    diagnostics.evaluate_error_handling(error_reports)
    
    # Generate and return report
    report = diagnostics.generate_report(system_state)
    diagnostics.print_report(report)
    
    return report


if __name__ == "__main__":
    # Example usage with sample data
    print("Master Agent Diagnostic System")
    print("This module provides comprehensive diagnostics for the multi-agent system.")
    print("\nTo use in your system, import and call:")
    print("  from master_agent_diagnostics import debug_master_agent")
    print("  report = debug_master_agent(system_state, messages, tasks, votes, updates, errors)")
