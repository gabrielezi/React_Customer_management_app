import React from "react";

export default function useLocalStorageForArrays<T extends { id: string }>(
  key: string
) {
  const [data, setData] = React.useState<T[]>([]);

  React.useEffect(() => {
    const localStorageString = localStorage.getItem(key);

    if (localStorageString === null) {
      localStorage.setItem(key, "[]");
    }
    
    if (localStorageString) {
      const localStorageData = JSON.parse(localStorageString) as T[];
      setData(localStorageData);
    }
  }, []);

  function addNewValue(value: T) {
    const localStorageString = localStorage.getItem(key);

    if (localStorageString) {
      const localStorageData = JSON.parse(localStorageString) as T[];
      localStorageData.push(value);
      setData(localStorageData);
      localStorage.setItem(key, JSON.stringify(localStorageData));
    }
  }

  function deleteValueById(id: string) {
    const newData = data.filter((item) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(newData));
    setData(newData);
  }

  function editValue(newValue: T) {
    const newData = data.map((row) => {
      if (row.id === newValue.id) {
        return newValue;
      } else return row;
    });
    localStorage.setItem(key, JSON.stringify(newData));
    setData(newData);
  }

  function revertList() {
    const localStorageString = localStorage.getItem(key);

    if (localStorageString) {
      const localStorageData = JSON.parse(localStorageString) as T[];
      setData(localStorageData);
    }
  }

  return { data, addNewValue, deleteValueById, editValue, setData, revertList };
}
