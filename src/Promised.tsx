import React, { useEffect, useState } from 'react';
import useAbandonOnUnmount from '@sevenoutman/use-abandon-on-unmount';

interface RenderProp<T, E> {
    (params: { pending?: boolean; rejected?: E; resolved?: T }): React.ReactNode;
}

interface PromisedProps<TResult = any, TError extends Error = Error> {
    /**
     * The promise to watch
     */
    promise: Promise<TResult>;

    /**
     * A function that receives a { pending, rejected, resolved } object as parameter and returns ReactNode to render
     */
    children: RenderProp<TResult, TError | any>;

    /**
     * Whether to set pending to true if `promise` is falsy, default to false
     */
    defaultPending?: boolean;

    /**
     * Whether to abandon promise upon component unmount, default to true
     */
    abandonOnUnmount?: boolean;

    /**
     * Callback when promise is resolved
     * Will be affected by `abandonOnUnbount`
     */
    onResolve?: (resolved: TResult) => void;

    /**
     * Callback when promise is rejected
     * Will be affected by `abandonOnUnbount`
     */
    onReject?: (rejected: TError | any) => void;
}

/**
 * <Promised> Component
 */
function Promised<TResult>({
    promise,
    onResolve,
    onReject,
    children: renderProps,
    defaultPending = !!promise,
    abandonOnUnmount: shouldAbortOnUnmount = true
}: PromisedProps<TResult>): React.ReactElement {

    const abandonOnUnmount = useAbandonOnUnmount();

    const [renderParams, setRenderParams] = useState<Parameters<typeof renderProps>[0]>({ pending: defaultPending });

    useEffect(() => {
        if (promise) {
            setRenderParams({ pending: true });
            (shouldAbortOnUnmount ? abandonOnUnmount(promise) : promise)
                .then(
                    resolved => {
                        setRenderParams({ pending: false, resolved });
                        onResolve && onResolve(resolved);
                    },
                    rejected => {
                        setRenderParams({ pending: false, rejected });
                        onReject && onReject(rejected);
                    }
                );
        } else {
            setRenderParams({ pending: defaultPending });
        }
    }, [promise]);


    return <>{renderProps(renderParams)}</>;
}

export default Promised;
