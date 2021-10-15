import React from "react";

export default function useLocalStorage<T>(key: string) {

    const [data, setData] = React.useState<T | null>(null);
    // const [previous, setPrevious] = React.useState<T | null>(null);
  
    React.useEffect(() => {
        const dataString = localStorage.getItem(key);
        if (dataString){
            setData(parseJSON(dataString || "{}"));
        }else{
            localStorage.setItem(key, "[]");
        }
    }, []);

    React.useEffect(() => {

      // if(data !== previous){
        localStorage.setItem(key, JSON.stringify(data));
        // console.log("prev: ", previous);
        console.log("data: ", data);
      // }
        
    }, [data]);
  
    function setDataAction (value:T) {
        // setPrevious(data);
        localStorage.setItem(key, JSON.stringify(value));
        setData(value);
    }

    function parseJSON(value: string | null): T | null{
        try {
          return value === 'undefined' ? undefined : JSON.parse(value ?? '')
        } catch (error) {
          console.log('parsing error on', { value })
          return null
        }
      }
  
    return [data, setDataAction];
  }