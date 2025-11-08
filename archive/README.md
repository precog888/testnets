# Development Archive - README

## Purpose

This directory contains the complete development history of the IME (Integrated Multiverse Engine) project.

## Structure

### `/rts-development/`
Contains all .rts (development conversation/iteration) files from the original development with Gemini 2.5 Flash. These files document:
- Original concept discussions
- Technical problem-solving
- Feature iterations
- Bug fixes
- Design decisions

**To add your archives:** Place your .rts files here

### `/versions/`
Contains snapshot versions of working builds throughout development:
- Pokemon bounce icon (initial test)
- Early dungeon prototypes
- NEXUS HUB 2.4 (current stable)
- Future incremental versions

## How to Use

### For Precog (Human Architect/Playtester):
1. Drop your .rts archives into `/rts-development/`
2. The AI agents will analyze them to understand:
   - Your design philosophy
   - Technical decisions made
   - Problems encountered and solved
   - Evolution of features
   - Areas that need work

### For AI Agents:
1. **Before making changes**, review relevant .rts files to understand:
   - Why certain decisions were made
   - What has already been tried
   - Precog's preferences and style
   - Historical context for features

2. **Extract knowledge** including:
   - Working code patterns
   - Design principles
   - Debugging approaches
   - Feature priorities

3. **Maintain continuity** with:
   - Original vision
   - Established patterns
   - Precog's development style

## Archive Analysis Workflow

When .rts files are added:

1. **Documentation Agent** will:
   - Parse and catalog all .rts files
   - Extract key technical decisions
   - Document feature evolution timeline
   - Create searchable knowledge base

2. **Gameplay Design Agent** will:
   - Analyze gameplay mechanics discussed
   - Identify feature requests
   - Understand design intent
   - Plan enhancements

3. **UI/UX Design Agent** will:
   - Study aesthetic decisions
   - Note color palette evolution
   - Understand GBC-style preferences
   - Maintain visual consistency

4. **All Agents** will:
   - Reference archives before suggesting changes
   - Respect established patterns
   - Build on proven concepts
   - Avoid revisiting solved problems

## Current Status

- ✅ Archive structure created
- ⏳ Awaiting .rts files from Precog
- ⏳ Automated analysis tools to be created
- ⏳ Knowledge extraction pipeline

## Next Steps

1. **Precog**: Upload your .rts archive files to `/rts-development/`
2. **Master Agent**: Trigger archive analysis
3. **Documentation Agent**: Parse and catalog archives
4. **All Agents**: Review findings and incorporate into development

## File Naming Convention

Suggested format for .rts files:
```
YYYY-MM-DD_session-name_topic.rts
```

Example:
```
2025-11-05_pokemon-bounce-test.rts
2025-11-05_dungeon-generation-v1.rts
2025-11-06_nexus-hub-implementation.rts
```

## Integration with Knowledge Base

Archive findings will be integrated into:
- `KNOWLEDGE_BASE.md` - Historical decisions and rationale
- `PROJECT_SEED.md` - Evolution from seed concept
- Agent role documents - Context for specialized domains

---

*This archive preserves the evolutionary DNA of the IME project, ensuring all future development honors the original vision and lessons learned.*
