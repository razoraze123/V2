import React, { createContext, useContext, useState, useEffect } from 'react';

interface ActionContextType {
  registerAction: (action: (() => void) | null) => void;
  triggerAction: () => void;
  hasAction: boolean;
}

const ActionContext = createContext<ActionContextType | undefined>(undefined);

export const useAction = () => {
  const context = useContext(ActionContext);
  if (!context) {
    throw new Error('useAction must be used within ActionProvider');
  }
  return context;
};

export const ActionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [action, setAction] = useState<(() => void) | null>(null);

  const registerAction = (newAction: (() => void) | null) => {
    setAction(() => newAction);
  };

  const triggerAction = () => {
    if (action) {
        action();
    }
  };

  return (
    <ActionContext.Provider value={{ registerAction, triggerAction, hasAction: !!action }}>
      {children}
    </ActionContext.Provider>
  );
};