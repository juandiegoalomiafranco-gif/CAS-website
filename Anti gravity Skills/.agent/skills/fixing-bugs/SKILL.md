---
name: fixing-bugs
description: Builds resilient applications with robust error handling strategies. Use when an application or webpage is not working to systematically repair bugs, implement fallbacks, and handle errors gracefully.
---

# Fixing Bugs & Error Handling

Build resilient applications with robust error handling strategies that gracefully handle failures and provide excellent debugging experiences.

## Workflow & Checklist

1.  **Analyze the Failure**: Check logs, error messages, and context to determine if the error is recoverable or unrecoverable.
2.  **Select Strategy**: Choose between Exceptions, Result Types, or Panics based on the language.
3.  **Implement Robust Handling**: Apply universal patterns (Circuit Breaker, Aggregation, Degradation) or language-specific constructs.
4.  **Verify Best Practices**: Ensure the fix fails fast, preserves context, and doesn't swallow errors silently.

## Core Concepts

### 1. Error Handling Philosophies
- **Exceptions vs Result Types**:
  - *Exceptions*: Traditional try-catch, disrupts control flow. Use for unexpected errors, exceptional conditions.
  - *Result Types*: Explicit success/failure, functional approach. Use for expected errors, validation failures.
- **Error Codes**: C-style, requires discipline.
- **Option/Maybe Types**: For nullable values.
- **Panics/Crashes**: Unrecoverable errors, programming bugs.

### 2. Error Categories
- **Recoverable Errors**: Network timeouts, Missing files, Invalid user input, API rate limits.
- **Unrecoverable Errors**: Out of memory, Stack overflow, Programming bugs (null pointer, etc.).

## Language-Specific Patterns

### Python Error Handling

**Custom Exception Hierarchy:**
```python
class ApplicationError(Exception):
    """Base exception for all application errors."""
    def __init__(self, message: str, code: str = None, details: dict = None):
        super().__init__(message)
        self.code = code
        self.details = details or {}
        self.timestamp = datetime.utcnow()

class ValidationError(ApplicationError): pass
class NotFoundError(ApplicationError): pass
class ExternalServiceError(ApplicationError):
    def __init__(self, message: str, service: str, **kwargs):
        super().__init__(message, **kwargs)
        self.service = service
```

**Context Managers for Cleanup and Retry with Backoff:**
```python
@contextmanager
def database_transaction(session):
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        raise
    finally:
        session.close()

def retry(max_attempts: int = 3, backoff_factor: float = 2.0, exceptions: tuple = (Exception,)):
    # Retry decorator with exponential backoff
    pass
```

### TypeScript/JavaScript Error Handling

**Custom Error Classes:**
```typescript
class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
class ValidationError extends ApplicationError { ... }
```

**Result Type Pattern & Async Handling:**
```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

async function fetchUserOrders(userId: string): Promise<Order[]> {
  try {
    const user = await getUser(userId);
    return await getOrders(user.id);
  } catch (error) {
    if (error instanceof NotFoundError) return [];
    if (error instanceof NetworkError) return retryFetchOrders(userId);
    throw error;
  }
}
```

### Rust Error Handling
**Result and Option Types:**
```rust
use std::io::{self, Read};

// Result type for operations that can fail
fn read_file(path: &str) -> Result<String, io::Error> {
    let mut file = std::fs::File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

#[derive(Debug)]
enum AppError {
    Io(io::Error),
    Parse(std::num::ParseIntError),
    NotFound(String),
}
```

### Go Error Handling
**Explicit Error Returns:**
```go
func getUser(id string) (*User, error) {
    user, err := db.QueryUser(id)
    if err != nil {
        return nil, fmt.Errorf("failed to query user: %w", err)
    }
    if user == nil {
        return nil, errors.New("user not found")
    }
    return user, nil
}
```

## Universal Patterns

### Pattern 1: Circuit Breaker
Prevent cascading failures in distributed systems by opening a circuit when failures threshold is reached.

### Pattern 2: Error Aggregation
Collect multiple errors instead of failing on first error (e.g. `AggregateError`).

### Pattern 3: Graceful Degradation
Provide fallback functionality when errors occur.
```python
def get_user_profile(user_id: str) -> UserProfile:
    return with_fallback(
        primary=lambda: fetch_from_cache(user_id),
        fallback=lambda: fetch_from_database(user_id)
    )
```

## Best Practices
- **Fail Fast**: Validate input early, fail quickly
- **Preserve Context**: Include stack traces, metadata, timestamps
- **Meaningful Messages**: Explain what happened and how to fix it
- **Log Appropriately**: Error = log, expected failure = don't spam logs
- **Handle at Right Level**: Catch where you can meaningfully handle
- **Clean Up Resources**: Use try-finally, context managers, defer
- **Don't Swallow Errors**: Log or re-throw, don't silently ignore
- **Type-Safe Errors**: Use typed errors when possible

## Common Pitfalls
- **Catching Too Broadly**: `except Exception` hides bugs
- **Empty Catch Blocks**: Silently swallowing errors
- **Logging and Re-throwing**: Creates duplicate log entries
- **Not Cleaning Up**: Forgetting to close files, connections
- **Poor Error Messages**: "Error occurred" is not helpful
- **Returning Error Codes**: Use exceptions or Result types
- **Ignoring Async Errors**: Unhandled promise rejections
