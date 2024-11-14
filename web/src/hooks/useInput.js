import { useEffect, useState } from "react";

export function useInput(defaultValue = "") {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(defaultValue);
  }, []);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return { value, setValue, onChange };
}
