# Machine

## States (Type)

```typescript
export const STATES = {
  READING: 'reading' as const,
  EDITING: 'editing' as const,
};

// Define types
type StateType = (typeof STATES)[keyof typeof STATES];
type EventType = (typeof EVENTS)[keyof typeof EVENTS];
type ActionType = (typeof ACTIONS)[keyof typeof ACTIONS];

// usage
const context = {
  state: STATES.READING as StateType,
};
```

The provided code defines a finite state machine for managing the state of a text editing service using the `xstate` library in TypeScript. The main purpose of this code is to handle transitions between different states of a text editor and execute specific actions based on events, while maintaining a clear segregation of logic through state management.

### Intent and Purpose:

1. **State Management:**
   - The code encapsulates the logic for transitioning between two main states, `READING` and `EDITING`, allowing for a structured approach to handle text changes.

2. **Event Handling:**
   - It defines a set of possible events (`EDIT`, `CHANGE`, `COMMIT`, `CANCEL`) and specifies actions to take when these events occur, thus making the behavior predictable and modular.

3. **Actions Execution:**
   - It defines actions to update, commit, or reset the text value which connects with an external `TextService`. Actions are dispatched based on the current state and received events.

4. **Separation of Concerns:**
   - By defining specific actions and states, the code separates the UI logic from the business logic related to text editing, making it easier to manage and extend.

### Potential Use:

This state machine could be used in applications that require robust text editing capabilities, such as text editors, messaging platforms, or any form-based application. It ensures that transitions between editing (`EDITING`) and viewing (`READING`) states are handled systematically, allowing for actions like updating the text in real time, committing changes, or rolling back to the previous state on cancellation.

### Type Explained:

- `StateType` is a TypeScript type alias that represents the possible states of the state machine. It is derived from the `STATES` constant object, ensuring `StateType` can only be either `'reading'` or `'editing'`. This provides type safety, helping ensure that only valid states are used in the code.

## State Constants in TypeScript: Union Type vs. Const Object vs. Enum

### Correct Approach

To use union types in TypeScript for state constants, you should define a type or enum that clearly states all possible values:

1. **Using a Union Type:**
   ```typescript
   type StateType = 'reading' | 'editing';
   ```

2. **Using an Enum (for more traditional constant collections):**
   ```typescript
   enum STATES {
     READING = 'reading',
     EDITING = 'editing',
   }
   ```

In both approaches, you gain the benefits of type safety and better code completion. Additionally, when using the `StateType` or `STATES` enum, the TypeScript compiler can check that only valid states are being used throughout your code, reducing potential bugs associated with invalid literals.

Sure! Below is a comparison matrix for the three approaches to defining state constants in TypeScript: using a union type, a `const` object with string literal types, and an `enum`.

| Approach                   | Pros                                                                 | Cons                                                         | Use Cases                                       | Why to Use                                       |
|----------------------------|----------------------------------------------------------------------|--------------------------------------------------------------|-------------------------------------------------|--------------------------------------------------|
| **Union Type**             | - Very concise and easy to declare.                                  | - Cannot iterate over possible values.                       | - Simple constant sets with few values.         | - Lightweight and direct when iteration is unnecessary.|
| (`type StateType = 'reading' \| 'editing';`) | - Provides strong type safety and autocomplete support.      | - String literals must be repeated in several locations.     | - Where you solely need type safety for literals.| - Best for simple, non-iterable constant sets.     |
|                            | - Directly represents all possible values.                           |                                                              |                                                 |                                                  |
| **Const Object with Types**| - Centralized collection of constants.                               | - Slightly more verbose than union types.                    | - Where readability and central management are important.| - Maintains intuitive readability and type safety. |
| (`const STATES = { ... };`)| - Automatically provides type-safe string literals.                  | - Requires additional setup to extract literal types.        | - Projects with a need for many constants of similar nature. | - Useful for readable and repeated constant usage.|
|                            | - Easier to manage and extend compared to union types.               | - Lacks built-in methods like enums for reverse mapping.     |                                                 |                                                  |
| **Enum**                   | - Provides automatic reverse mapping (string key to value) capability.| - More verbose, introduces additional syntax overhead.       | - When constants may need to change (e.g., localization).| - Useful for legacy compatibility or numeric-backed systems.|
| (`enum STATES { ... };`)   | - Good for complex applications with need for reverse key-value lookup. | - Not as flexible with string manipulations as objects.      | - Codebases with historical use of enums or those needing reverse logic. | - Helpful when interoperability with JavaScript.   |

## Dynamic Constants in TypeScript

To achieve a dynamic workflow where states are fetched from a database and used within an XState machine, you'll need a strategy that balances runtime data fetching with compile-time type safety. Here is a suggested approach to accomplish this:

### Steps:

1. **Fetch States from Database:**
   - Use an async call to retrieve the states from your database, assuming they are stored as an array of strings, e.g., `["READER", "REVIEWER", "PUBLISHER"]`.

2. **Create a Type from Fetched Data:**
   - Dynamically map these values to a type that can be used in your code. TypeScript doesn’t allow runtime values to dictate types directly, so you'll typically define the types statically or through some form of preprocessing.

3. **Use Types in XState Configuration:**
   - Incorporate the dynamically fetched states into your state machine configurations in XState.

### Implementation Approach:

#### 1. Fetch States:
You would typically have this part of your setup where you fetch the data:
```typescript
async function getWorkflowStates(): Promise<string[]> {
  // Simulate a database call to fetch states
  return await database.fetchStates(); // Assume this returns ["READER", "REVIEWER", "PUBLISHER"]
}
```

#### 2. Convert States to Enums and Types:
Since TypeScript types cannot be dynamically generated at runtime (as they are erased at compilation), you may need to use a workaround involving a build step (or use assertion):

```typescript
// Assuming workflowStatesArray is the fetched array
const workflowStatesArray = await getWorkflowStates();

// Manually convert to our desired formats
const WORKFLOW_STATES = workflowStatesArray.reduce((acc, state) => ({
  ...acc,
  [state.toUpperCase()]: state,
}), {} as Record<string, string>);

// The state type can use a known union or any workaround
type WorkflowStateType = keyof typeof WORKFLOW_STATES;
```

#### 3. Use in XState:
Now, you can use these in an XState machine:

```typescript
import { createMachine } from 'xstate';

const machine = createMachine({
  id: 'workflowMachine',
  initial: WORKFLOW_STATES.READER, // Assuming starting state
  states: WORKFLOW_STATES, // Use the states object directly
  // ...(State transitions and event definitions that use WorkflowStateType)
});
```

### Considerations:

- **Static Analysis Limitations**: TypeScript doesn't directly support dynamic creation of types. The above approach relies on runtime configurations and maps database strings into predefined types after fetch.
  
- **Build Tools**: Incorporate a preprocessing step (e.g., using Node.js scripts) to generate TypeScript types before compiling your project. This involves outputting a TS file with the correct types based on runtime data.

- **Validation**: You might want to add runtime validation to ensure states fetched align with your application’s expectations, even when types are dynamically constructed.

This approach allows you to tackle the dynamic nature of your states while leveraging the power and safety of TypeScript in an XState configuration.

The `WorkflowStateType` is intended to be a TypeScript type that represents the keys of the `WORKFLOW_STATES` object. This type can be used to provide type safety and ensure that only valid states are referenced in your code. Here’s how and when to use it, along with steps to prevent linting errors related to unused types:

### Usage of `WorkflowStateType`:

1. **Type Annotations in Functions and Variables**:
   - Use `WorkflowStateType` as a type annotation where you expect a state value, such as in function parameters or in defining the structure of an object.

   ```typescript
   // Function that only accepts valid workflow states
   function transitionToState(newState: WorkflowStateType) {
     console.log(`Transitioning to ${newState}`);
     // Logic for state transition
   }

   const currentState: WorkflowStateType = WORKFLOW_STATES.READER;
   transitionToState(currentState);
   ```

2. **Using in State Machine Configurations**:
   - When defining states and transitions in the XState machine, use `WorkflowStateType` to ensure transitions reference valid states.

   ```typescript
   const machine = createMachine({
     id: 'workflowMachine',
     initial: WORKFLOW_STATES.READER,
     states: {
       [WORKFLOW_STATES.READER]: {
         on: {
           TO_REVIEWER: { target: WORKFLOW_STATES.REVIEWER as WorkflowStateType },
         },
       },
       [WORKFLOW_STATES.REVIEWER]: {
         on: {
           TO_PUBLISHER: { target: WORKFLOW_STATES.PUBLISHER as WorkflowStateType },
         },
       },
     },
   });
   ```

3. **Type-Safe Collections**:
   - When working with collections or structures that represent states, use the type to ensure all entries are valid.

   ```typescript
   const validStates: WorkflowStateType[] = [
     WORKFLOW_STATES.READER,
     WORKFLOW_STATES.REVIEWER,
     WORKFLOW_STATES.PUBLISHER,
   ];
   ```

### Preventing Linting Errors:

If you define `WorkflowStateType` and don't use it anywhere, you will indeed receive a linting error about it being unused. To prevent this, make sure:

- **Consistent Type Usage**: Anywhere in the code where you handle states should use `WorkflowStateType` as much as possible for type annotations.

- **Code Reviews and Refactoring**: Regularly review your code for parts where dynamic state values are used. Ensure that wherever a variable, parameter, or function logically deals with state values, `WorkflowStateType` is applied.

- **Project Structure**: Document or comment on `WorkflowStateType` as part of your project's type system for workflow states, making its importance clear. This can guide you or team members in utilizing it appropriately.

By actively using `WorkflowStateType` where applicable, the type helps maintain a type-safe approach, ensuring that your code only works with valid state values. This practice not only addresses linting errors but also adds robustness to your application.
## Conclusion:

- **Use Union Types** when you need a straightforward, quick way to define and check permissible string literals. They're ideal for small sets of constants where iteration over options is unnecessary.
- **Use Const Objects with Types** when you need a central point for managing state constants that need to be easily extendable and human-readable. They're ideal for situations where constants are used frequently across the codebase.
- **Use Enums** when reverse-mapping is needed or when dealing with legacy systems that enforce this pattern. They can be suitable in complex applications where comprehensive handling of states, including potential numeric associations, is required.

Each approach has its place depending on the needs of your application in terms of scalability, readability, and how dynamic the constant values may need to be.