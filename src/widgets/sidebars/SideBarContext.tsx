import React, { createContext, ReactNode, useState } from 'react';

interface SideBarContextProps {
    childrenComponent: ReactNode;
    setChildrenComponent: (component: ReactNode) => void;
}

export const SideBarContext = createContext<SideBarContextProps>({
    childrenComponent: null,
    setChildrenComponent: () => {},
});

export const  SideBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [childrenComponent, setChildrenComponent] = useState<ReactNode>(null);

    return (
        <SideBarContext.Provider value={{ childrenComponent, setChildrenComponent }}>
            {children}
        </SideBarContext.Provider>
    );
};