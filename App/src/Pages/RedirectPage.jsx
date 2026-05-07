import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function RedirectPage() {
  const { code } = useParams();

  useEffect(() => {
    window.location.href = `https://adstorx.com/s/${code}`;
  }, [code]);

  return <h1>Redirecting...</h1>;
}