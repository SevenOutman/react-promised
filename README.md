# react-promised

> React component for rendering children according to a promise

    yarn add @sevenoutman/react-promised

## Usage

```jsx
import Promised from '@sevenoutman/react-promised';

function App() {

    const [fetchTodoPromise, setFetchTodoPromise] = useState();

    useEffect(() => {
        setFetchTodoPromise(requestTodos());
    }, []);

    return (
        <Promised promise={fetchTodoPromise} defaultPending>
            {({ pending, rejected: error, resolved: todos }) => {
                
                if (pending) return <Loading />;
                if (error) return <ErrorMessage error={error} />

                return (
                    <ul>
                      {todos.map(todo => (
                          <li key={todo.id}>{todo.content}</li>
                      ))}
                    </ul>
                );
            }}
        </Promised>
    );
}
```

## Props

```typescript
interface RenderProp<T, E> {
    (params: {
        pending?: boolean;
        rejected?: E;
        resolved?: T;
    }): React.ReactNode;
}

interface PromisedProps<TResult = any, TError extends Error = Error> {
    /**
     * The promise to watch
     */
    promise: Promise<TResult>;
    /**
     * A function that receives a { pending, rejected, resolved } object as parameter and returns ReactNode to render.
     */
    children: RenderProp<TResult, TError | any>;
    /**
     * Whether to set pending to true if `promise` is falsy, default to false.
     */
    defaultPending?: boolean;
    /**
     * Whether to abandon promise upon component unmount, default to true.
     * Useful to avoid updating states in unmounted components.
     */
    abandonOnUnmount?: boolean;
    /**
     * Callback when promise is resolved.
     * Will be affected by `abandonOnUnmount`.
     */
    onResolve?: (resolved: TResult) => void;
    /**
     * Callback when promise is rejected.
     * Will be affected by `abandonOnUnmount`.
     */
    onReject?: (rejected: TError | any) => void;
}
```