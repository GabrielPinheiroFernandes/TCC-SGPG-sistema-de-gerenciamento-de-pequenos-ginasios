import parseToken from "../auth/validate_token"; // se você estiver usando a função atualizada com id + expired
import { User_token } from "../constants/localstorage";

export default function Register() {
  const token = localStorage.getItem(User_token) || ""; // garante string
  const { id, expired } = parseToken(localStorage.getItem(User_token) || "");
    console.log("ID:", id);
    console.log("Expirado?", expired);
  return (
    <>
      <h1>{token}</h1>
      <h1>aa{id }</h1>
      <h1>{expired ? "Token expirado" : "Token válido"}</h1>
    </>
  );
}
