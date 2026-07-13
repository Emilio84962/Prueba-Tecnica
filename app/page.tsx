"use client";
import {supabase} from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [loading, setLoading] = useState(false);
  

  const [message, setMessage] = useState("");


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault();

    setLoading(true);
    



    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
  });
  


  
    if (error) {
      setMessage("❌ Correo o contraseña incorrectos");
      setLoading(false);
      return;
    }


    // Login correcto
    setMessage("✅ Inicio de sesión correcto");


    // Espera 1.5 segundos para mostrar el mensaje
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);

}
  return (
    
      <main className="flex min-h-screen items-center justify-center">

      <form
        onSubmit={handleLogin}
        className="w-96 space-y-4 rounded-lg border p-6"
      >

        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>


        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full rounded border p-2"
          required
        />


        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full rounded border p-2"
          required
        />


        {
          message && (
            <p className="text-center">
              {message}
            </p>
          )
        }


        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 p-2 text-white"
        >
          {
            loading 
            ? "Validando..."
            : "Iniciar sesión"
          }
        </button>


      </form>

    </main>
      
    
  );
}
