"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {

  const router = useRouter();


  const handleLogout = async () => {

    await supabase.auth.signOut();

    router.push("/");

  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">

      <h1 className="text-3xl font-bold">
        Bienvenido al Dashboard
      </h1>


      <p>
        Has iniciado sesión correctamente.
      </p>


      <button
        onClick={handleLogout}
        className="rounded bg-red-600 px-6 py-3 text-white hover:bg-red-700"
      >
        Cerrar sesión
      </button>


    </main>
  );
}