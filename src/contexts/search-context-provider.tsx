"use client";
import { createContext, useState } from "react";

type TSearchContext = {
  searchQuery: string;
  handleChangeSearchQuery: (newQuery: string) => void;
};

export const SearchContext = createContext<TSearchContext | null>(null);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export default function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  //state

  const [searchQuery, setSearchQuery] = useState<string>("");
  //derived state

  // handler
  const handleChangeSearchQuery = (newQuery: string) => {
    setSearchQuery(newQuery);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, handleChangeSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
