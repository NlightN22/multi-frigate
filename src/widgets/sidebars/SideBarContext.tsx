import React, { createContext, ReactNode, useState } from 'react';

interface SideBarContextProps {
    childrenComponent: ReactNode;
    setRightChildren: (component: ReactNode) => void;
}

export const SideBarContext = createContext<SideBarContextProps>({
    childrenComponent: null,
    setRightChildren: () => {},
});

export const  SideBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [rightChildren, setRightChildren] = useState<ReactNode>(null);

    return (
        <SideBarContext.Provider value={{ childrenComponent: rightChildren, setRightChildren }}>
            {children}
        </SideBarContext.Provider>
    );
};