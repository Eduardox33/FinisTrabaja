// Bypassear CORS, no considerado en el informe de proyecto

import { createClient } from "https://esm.sh/@libsql/client/web";

const TURSO_URL = "https://finistrabaja-workerlatex.aws-us-east-1.turso.io";

let cliente = null;

async function obtenerCliente() {
  if (cliente) return cliente;
  const respuesta = await fetch("token.txt");
  if (!respuesta.ok) throw new Error("No se pudo leer token.txt");
  const token = (await respuesta.text()).trim();
  cliente = createClient({ url: TURSO_URL, authToken: token });
  return cliente;
}

async function ejecutarSQL(sql, args = []) {
  const db = await obtenerCliente();
  const resultado = await db.execute({ sql, args });
  return resultado.rows;
}

window.ejecutarSQL = ejecutarSQL;
