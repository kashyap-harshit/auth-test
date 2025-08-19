"use client";
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [data, setData] = useState();
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);
  return <div>{JSON.stringify(data)}</div>;
}

export default Dashboard;
