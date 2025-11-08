# RecursiveAgent Documentation

## Overview

The RecursiveAgent class (located in `.github/agents/my-agent.md`) is a JavaScript framework for building intelligent agents with learning and debugging capabilities.

## Purpose

This agent is designed for:
- Recursive debugging and learning from failures
- Pattern recognition in time-series data
- Probabilistic decision making
- Session memory management
- Agent state persistence and handoff

## Core Concepts

### 1. Memory Systems

The agent implements two types of memory:

**Episodic Memory** (`sessionMemory`):
- Short-term memory of recent events
- Limited to last 100 events
- Used for immediate context and pattern detection

**Semantic Memory** (`semanticMemory`):
- Long-term learned patterns
- Generalized knowledge extracted from episodes
- Persists across sessions

### 2. Learning Mechanism

**Failure Database**:
- Stores known failure patterns
- Associates failures with solutions
- Used for recursive training

**Training Process**:
1. Observe event/failure
2. Add to episodic memory
3. Extract patterns from episodes
4. Update semantic memory
5. Suggest system improvements

### 3. Decision Making

The agent uses multiple approaches:

**Cycle Analysis (FFT)**:
- Analyzes time-series data
- Detects periodic patterns
- Identifies dominant frequencies

**Markov Decision Process**:
- Probabilistic state transitions
- Based on transition matrix
- Simulates task switching

## API Reference

### Constructor

```javascript
new RecursiveAgent(version = "v1.0")
```

Creates a new agent instance with the specified version.

### Methods

#### Core Methods

**`addToSessionMemory(event)`**
- Adds an event to episodic memory
- Maintains maximum size of 100 events
- Event should have a `type` property

**`trainSemanticMemory()`**
- Analyzes episodic memory
- Extracts patterns (e.g., event type frequencies)
- Updates semantic memory

**`recursiveTraining(failureEvent)`**
- Records failure pattern
- Triggers semantic memory training
- Suggests system prompt improvements
- Returns suggestion string

#### Analysis Methods

**`analyzeCycles(timeSeriesData)`**
- Analyzes time-series data for patterns
- Returns object with dominant frequencies
- Currently a placeholder (implement with FFT library)

**`markovDecision(currentState, transitionMatrix)`**
- Makes probabilistic state transition
- Uses transition matrix probabilities
- Returns next state

#### Decision Making

**`makeDecision(worldState)`**
- Main decision-making method
- Integrates cycle analysis and Markov process
- Records decision in history
- Returns decision object

Expected `worldState` structure:
```javascript
{
  tick: number,           // Current time/step
  resourceHistory: [],    // Time-series data
  currentTask: string,    // Current state
  transitionMatrix: {}    // State transition probabilities
}
```

Returns:
```javascript
{
  timestamp: number,
  tick: number,
  action: string,
  reasoning: string,
  severity: string
}
```

#### Utility Methods

**`debugLog(message, severity = "info")`**
- Logs debug messages with timestamp
- Severity levels: "info", "warning", "error"

**`exportState()`**
- Exports current agent state
- Returns JSON string
- Useful for session persistence or handoff

## Usage Examples

### Basic Usage

```javascript
// Initialize agent
const agent = new RecursiveAgent("v1.0");

// Prepare world state
const worldState = {
  tick: 42,
  resourceHistory: [10, 12, 9, 7, 11, 13, 6],
  currentTask: "gather_wood",
  transitionMatrix: {
    gather_wood: 0.5,
    gather_food: 0.3,
    build_house: 0.2
  }
};

// Make decision
const decision = agent.makeDecision(worldState);
console.log("Decision:", decision.action);
console.log("Reasoning:", decision.reasoning);
```

### Learning from Failures

```javascript
// Record a failure
const failure = {
  description: "Resource gathering failed due to null reference",
  context: { task: "gather_wood", tick: 42 },
  solution: "Add null checks before accessing resources"
};

const suggestion = agent.recursiveTraining(failure);
console.log("System improvement:", suggestion);
```

### Session Persistence

```javascript
// At end of session
const savedState = agent.exportState();
localStorage.setItem('agentState', savedState);

// Later, or in different session
const loadedState = localStorage.getItem('agentState');
// Use loaded state to initialize new agent with learned patterns
```

## Extending the Agent

### Adding New Analysis Methods

```javascript
// Add new analysis capability
RecursiveAgent.prototype.analyzeResourceTrends = function(resources) {
  // Your implementation
  const trend = calculateTrend(resources);
  this.debugLog(`Resource trend: ${trend}`, "info");
  return trend;
};
```

### Custom Learning Rules

```javascript
// Override semantic memory training
RecursiveAgent.prototype.trainSemanticMemory = function() {
  // Your custom learning algorithm
  const patterns = this.extractPatterns(this.sessionMemory);
  this.semanticMemory.customPatterns = patterns;
  this.debugLog("Custom semantic training complete", "info");
};
```

### Integration with External Systems

```javascript
// Export to external system
async function syncWithServer(agent) {
  const state = agent.exportState();
  await fetch('/api/agent/save', {
    method: 'POST',
    body: state,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## Implementation Notes

### Placeholder Components

The following methods are currently placeholders:

1. **`analyzeCycles()`**: Implement with actual FFT library
2. **`markovDecision()`**: Basic implementation, enhance with more sophisticated probability handling
3. **Semantic training**: Simple frequency counting, could use ML approaches

### Production Considerations

Before using in production:

1. **Error Handling**: Add comprehensive try-catch blocks
2. **Validation**: Validate input parameters
3. **Performance**: Monitor memory usage with large session history
4. **Persistence**: Implement proper state serialization/deserialization
5. **Testing**: Add unit tests for all methods

## Future Enhancements

Potential improvements:

- [ ] Real FFT implementation for cycle analysis
- [ ] Neural network integration for pattern recognition
- [ ] Reinforcement learning for decision optimization
- [ ] Multi-agent coordination
- [ ] Advanced state persistence (database integration)
- [ ] Real-time visualization of agent behavior
- [ ] A/B testing framework for decision strategies
- [ ] Automatic hyperparameter tuning

## Troubleshooting

### Memory Issues
**Problem**: Agent uses too much memory
**Solution**: Reduce MAX_LEN in `addToSessionMemory()`

### Performance Issues
**Problem**: Decision making is slow
**Solution**: Optimize cycle analysis, use caching for repeated calculations

### Pattern Detection Not Working
**Problem**: Semantic memory isn't learning useful patterns
**Solution**: Increase episode sample size, improve pattern extraction algorithm

## Related Resources

- [README.md](../README.md) - Repository overview
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [WORKFLOW.md](WORKFLOW.md) - Detailed workflow documentation

## License

[Specify license if applicable]
