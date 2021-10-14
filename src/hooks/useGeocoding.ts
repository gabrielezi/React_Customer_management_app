import React from "react";
import { useEffect, useState } from 'react';
import { Service } from '../types/Service';
import { Location } from '../types/Location';
// import { useSnackbar } from "notistack";


export default function useGeocoding<T>(
    func: (...args: any[]) => Promise<T>
  ) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [data1, setData] = React.useState<T | null>(null);
  
    function sendRequest  (...args: any[]) {
      try {
        setLoading(true);
        func(...args).then(x => {
          setData(x);
        });
      } catch (error) {
        console.log(error);
        // enqueueSnackbar("Error while loading entity", { variant: "error" });
      }
    };
  
    return { sendRequest, data1, loading };
  }