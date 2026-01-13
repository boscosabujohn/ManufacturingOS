# Code Review Guidelines

## Purpose

Code reviews are essential for maintaining code quality, sharing knowledge, and catching bugs early. This document outlines best practices for both reviewers and authors.

## For Authors

### Before Requesting Review

- [ ] **Self-review your code** - Read through all changes as if you were the reviewer
- [ ] **Run all tests** - Ensure `npm test` passes in both backend and frontend
- [ ] **Run linting** - Fix all ESLint/Prettier issues
- [ ] **Update documentation** - Add/update comments, README, API docs as needed
- [ ] **Keep PRs small** - Aim for <400 lines of changes; split large changes into multiple PRs
- [ ] **Write meaningful commit messages** - Follow conventional commits format

### PR Description

Include in your PR description:
1. **Summary** - What does this PR do?
2. **Motivation** - Why is this change needed?
3. **Testing** - How was this tested?
4. **Screenshots** - For UI changes, include before/after screenshots
5. **Related Issues** - Link to relevant issues

### Example PR Template

```markdown
## Summary
Brief description of changes

## Motivation
Why this change is needed

## Changes
- Change 1
- Change 2

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Before | After

## Related Issues
Closes #123
```

## For Reviewers

### Review Checklist

#### Code Quality
- [ ] Code follows project coding standards
- [ ] No unnecessary complexity or over-engineering
- [ ] No code duplication (DRY principle)
- [ ] Functions/methods are appropriately sized (<50 lines)
- [ ] Variable and function names are descriptive

#### Architecture
- [ ] Changes fit the existing architecture
- [ ] Proper separation of concerns
- [ ] No circular dependencies
- [ ] Appropriate use of design patterns

#### Security
- [ ] No hardcoded secrets or credentials
- [ ] Input validation implemented
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Proper authentication/authorization checks

#### Performance
- [ ] No N+1 query problems
- [ ] Appropriate use of indexes
- [ ] No memory leaks
- [ ] Efficient algorithms used

#### Testing
- [ ] Adequate test coverage
- [ ] Tests are meaningful (not just for coverage)
- [ ] Edge cases considered
- [ ] Tests are deterministic

#### Documentation
- [ ] Code is self-documenting or has comments
- [ ] API changes documented in Swagger
- [ ] README updated if needed

### Feedback Guidelines

#### Be Constructive
```
❌ "This code is bad"
✅ "Consider using a Map here for O(1) lookups instead of Array.find()"
```

#### Be Specific
```
❌ "This needs improvement"
✅ "This function exceeds 100 lines. Consider extracting the validation logic into a separate function"
```

#### Explain Why
```
❌ "Use const instead of let"
✅ "Use const here since the variable is never reassigned. This helps prevent accidental mutations"
```

#### Distinguish Severity

Use prefixes to indicate severity:
- **[BLOCKER]** - Must fix before merge
- **[SUGGESTION]** - Nice to have, not required
- **[QUESTION]** - Need clarification
- **[NIT]** - Minor style issue

Example:
```
[BLOCKER] This query is vulnerable to SQL injection. Use parameterized queries.

[SUGGESTION] Consider using a switch statement here for better readability.

[NIT] Extra blank line
```

### Review Timeline

- **Initial review**: Within 24 hours
- **Follow-up reviews**: Within 8 hours
- **Authors**: Respond to all comments, even if just to acknowledge

## Common Issues to Watch For

### Backend (NestJS)

1. **Missing validation decorators**
   ```typescript
   // ❌ Bad
   async create(@Body() dto: CreateUserDto) { }

   // ✅ Good - ValidationPipe handles this automatically if globally enabled
   async create(@Body() dto: CreateUserDto) { }
   ```

2. **Not using transactions for related operations**
   ```typescript
   // ❌ Bad
   await this.userRepo.save(user);
   await this.profileRepo.save(profile);

   // ✅ Good
   await this.dataSource.transaction(async (manager) => {
     await manager.save(user);
     await manager.save(profile);
   });
   ```

3. **Exposing internal errors**
   ```typescript
   // ❌ Bad
   throw new Error(error.message);

   // ✅ Good
   throw new InternalServerErrorException('Failed to process request');
   ```

### Frontend (React/Next.js)

1. **Missing key props in lists**
   ```tsx
   // ❌ Bad
   {items.map((item) => <Item {...item} />)}

   // ✅ Good
   {items.map((item) => <Item key={item.id} {...item} />)}
   ```

2. **Not handling loading/error states**
   ```tsx
   // ❌ Bad
   const { data } = useQuery(...);
   return <List items={data} />;

   // ✅ Good
   const { data, isLoading, error } = useQuery(...);
   if (isLoading) return <Skeleton />;
   if (error) return <Error message={error.message} />;
   return <List items={data} />;
   ```

3. **Inline object creation in render**
   ```tsx
   // ❌ Bad - creates new object every render
   <Component style={{ margin: 10 }} />

   // ✅ Good
   const styles = { margin: 10 };
   <Component style={styles} />
   ```

## Approval Requirements

| Change Type | Required Approvers |
|-------------|-------------------|
| Bug fix | 1 team member |
| New feature | 2 team members |
| Architecture change | Tech lead + 1 team member |
| Security-related | Security champion + 1 team member |
| Database migration | DBA or tech lead |

## After Review

### For Authors
1. Address all feedback (fix or explain why not)
2. Re-request review after changes
3. Don't force-push after review starts
4. Squash commits before merge (if required)

### For Reviewers
1. Re-review promptly after changes
2. Approve when satisfied
3. Don't leave reviews in limbo

## Tools

- **GitHub PR Review** - Primary review interface
- **ESLint** - Automated code quality checks
- **Prettier** - Automated formatting
- **Jest** - Test coverage reports
- **SonarQube** - (Optional) Static analysis

---

*Remember: Code review is about improving code quality, not about being right. Be kind, be helpful, be thorough.*
