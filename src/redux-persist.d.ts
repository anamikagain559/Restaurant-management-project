
import * as React from 'react';
import { Persistor } from 'redux-persist';

declare module 'redux-persist/integration/react' {
    export interface PersistGateProps {
        children?: React.ReactNode;
        loading?: React.ReactNode;
        persistor: Persistor;
        onBeforeLift?: () => void | Promise<void>;
    }

    export class PersistGate extends React.PureComponent<PersistGateProps, any> { }
}
