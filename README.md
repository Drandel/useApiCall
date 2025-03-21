# 📦 `useAPICall` — Custom React Hook for Manual API Requests

A lightweight, reusable custom React hook for managing asynchronous API calls using `useReducer`. Designed for cases where you want **manual control over when the call is made** — ideal for event-driven data fetching (e.g., button clicks, form submissions).

---

## 🚀 Features

- Tracks `loading`, `data`, and `error` states
- Clean reducer-driven state management
- Optional callbacks for `onFetching`, `onSuccess`, and `onError`
- Flexible: supports dynamic parameters per call
- No external dependencies

---

## 📦 Installation

Simply drop this file into your React project. No additional packages required.

---

## 🧠 Usage

### 1. Basic Usage with `useAPICall`

```jsx
import useAPICall from "./hooks/useAPICall";
import { fetchQuestions } from "./api/questions";

const MyComponent = () => {
  const { call, data, error, isLoading } = useAPICall(fetchQuestions);

  const handleClick = async () => {
    const result = await call(); // data is also available through `data` state
    console.log("Fetched:", result);
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Fetch Questions"}
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
```

---

### 2. Usage with Side Effects

```jsx
import { useAPICallWithSideEffects } from "./hooks/useAPICall";
import { fetchUserProfile } from "./api/users";

const MyComponent = () => {
  const { call, isLoading } = useAPICallWithSideEffects(
    fetchUserProfile,
    () => console.log("Fetching..."), // onFetching
    (data) => console.log("Received:", data), // onSuccess
    (err) => console.error("Failed:", err) // onError
  );

  return <button onClick={() => call(123)}>Load Profile</button>;
};
```

---

## 🔧 API

### `useAPICall(callFn)`

| Return Key  | Type            | Description                           |
| ----------- | --------------- | ------------------------------------- |
| `call`      | `Function`      | Trigger the API call manually         |
| `isLoading` | `boolean`       | True while the request is in flight   |
| `data`      | `any`           | Response data from the API call       |
| `error`     | `Error \| null` | Any error encountered during the call |

### `useAPICallWithSideEffects(callFn, onFetching, onSuccess, onError)`

Same as `useAPICall`, but allows you to provide **side-effect functions** for different call states:

- `onFetching` — called immediately when the request begins
- `onSuccess` — called when data is successfully returned
- `onError` — called when an error is thrown during the call

## 🧪 Example API Function

```js
// api/questions.js
export const fetchQuestions = async () => {
  const res = await fetch("http://localhost:8080/api/questions");

  if (!res.ok) {
    throw new Error("Failed to fetch questions");
  }

  return res.json();
};
```

---

## 📌 Notes

- `call()` supports parameters: `call(id, filters, etc...)`
- Designed for **manual triggers**, not automatic mount-time fetching
- For data caching and auto-refetching, consider [React Query](https://tanstack.com/query)
