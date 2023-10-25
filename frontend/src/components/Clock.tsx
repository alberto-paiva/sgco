import { useState, useEffect } from "react";

export function Clock() {
  const [dateState, setDateState] = useState(new Date());
  useEffect(() => {
    setInterval(() => {
      setDateState(new Date());
    }, 1000);
  }, []);
  return (
    <>
      <i className="pi pi-calendar mr-2 text-blue-400"></i>
      <span>
        {dateState.toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
      <i className="pi pi-clock ml-2 mr-2 text-blue-400"></i>
      <span>
        {dateState.toLocaleString("pt-BR", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        })}
      </span>
    </>
  );
}
