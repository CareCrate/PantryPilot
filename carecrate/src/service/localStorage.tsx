import { useState } from "react";

const getSavedValue = (key: any, initialValue: any) => {
  const savedData = JSON.parse(localStorage.getItem(key) ?? "");
  return savedData !== "" ? savedData : initialValue;
};

export const useLocalStorage = (key: any, value: any) => {
  const [localStorage, setLocalStorage] = useState(getSavedValue(key, value));
  return [localStorage, setLocalStorage];
};
