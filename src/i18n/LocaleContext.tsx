import React, {createContext, useContext, useMemo} from 'react';
import type {Copy, Locale} from './types';
import {dictionaries} from './dictionaries';

type LocaleContextValue = {
  locale: Locale;
  copy: Copy;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'pt',
  copy: dictionaries.pt,
});

export const LocaleProvider: React.FC<{
  locale: Locale;
  children: React.ReactNode;
}> = ({locale, children}) => {
  const value = useMemo(
    () => ({locale, copy: dictionaries[locale]}),
    [locale],
  );
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export const useLocale = (): Locale => useContext(LocaleContext).locale;

export const useCopy = (): Copy => useContext(LocaleContext).copy;
