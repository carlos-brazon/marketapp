// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "../utils/supabase/client";
// import { useRouter } from "next/navigation";
// import { createBrowserClient } from "@supabase/ssr";

// const Header = () => {
//   // const supabase = createClient();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   // const router = useRouter();
//   const supabase = createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );
//   const router = useRouter();
//   const [user, setUser] = useState<any>();

//   // Verifica si el usuario está autenticado
//   useEffect(() => {
//     console.log("hola");

//     const handleUser = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       setUser(user?.email);
//     if (user?.email) {
//       setIsLoggedIn(true)
//     }
      
//     };
//     handleUser();

//     // const checkUser = async () => {
//     //   const { data, error } = await supabase.auth.getSession();
//     //   if (error) {
//     //     console.error("Error fetching session:", error);
//     //   } else {
//     //     setIsLoggedIn(!!data.session); // Si hay una sesión, está logeado
//     //   }
//     // };

//     // checkUser(); // Llama la verificación inicial
//     // // Escucha cambios en la sesión en tiempo real
//     // const { data: authListener } = supabase.auth.onAuthStateChange(
//     //   (event, session) => {
//     //     console.log(event);

//     //     if (event === "INITIAL_SESSION") {
//     //       setIsLoggedIn(true); // Usuario ha iniciado sesión
//     //       router.refresh(); // Forzar la actualización de la página
//     //     } else if (event === "SIGNED_OUT") {
//     //       setIsLoggedIn(false); // Usuario ha cerrado sesión
//     //       router.refresh(); // Forzar la actualización de la página
//     //     }
//     //   }
//     // );
//   }, [supabase.auth]);

//   // Función para cerrar sesión
//   const handleLogout = async () => {
//     await supabase.auth.signOut(); // Cierra la sesión en Supabase
//     setIsLoggedIn(false); // Actualiza el estado
//     router.push("/"); // Redirige a la página principal después de cerrar sesión
//   };
// console.log(user);

//   return (
//     <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-600">
//       <button
//         onClick={() => router.push("/")}
//         className="border border-gray-400 p-2 rounded-md text-white hover:bg-gray-700"
//       >
//         Inicio
//       </button>

//       {/* Cambia el texto del botón según el estado de autenticación */}
//       {isLoggedIn ? (
//         <button
//           onClick={handleLogout}
//           className="border border-gray-400 p-2 rounded-md text-white hover:bg-gray-700"
//         >
//           Cerrar sesión
//         </button>
//       ) : (
//         <button
//           onClick={() => router.push("/login")} // Redirige a la página de login
//           className="border border-gray-400 p-2 rounded-md text-white hover:bg-gray-700"
//         >
//           Iniciar sesión
//         </button>
//       )}
//     </header>
//   );
// };

// export default Header;
"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const pathname = usePathname(); // Para detectar el cambio de rutas

  // Verifica el estado de autenticación al montar el componente o al cambiar de ruta
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user?.email || null);
      setIsLoggedIn(!!user); // Actualiza si el usuario está autenticado
    };

    checkUser();

    // Escucha cambios de autenticación en tiempo real
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(session);
        
        if (session) {
          setIsLoggedIn(true);
          setUser(session?.user?.email || null);
        } else if (event === "SIGNED_OUT") {
          setIsLoggedIn(false);
          setUser(null);
        }
        router.refresh(); // Forzar actualización de la página
      }
    );

    // Limpia el listener al desmontar el componente
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [pathname, supabase.auth]); // Re-ejecuta cuando el pathname cambia

  // Función para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    router.push("/"); // Redirige a la página principal
  };

  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-600">
      <button
        onClick={() => router.push("/")}
        className="border border-gray-400 p-2 rounded-md text-white hover:bg-gray-700"
      >
        Inicio
      </button>

      {/* Cambia el texto del botón según el estado de autenticación */}
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <span className="text-white">Bienvenido, {user}</span>
          <button
            onClick={handleLogout}
            className="border border-gray-400 p-2 rounded-md text-white hover:bg-gray-700"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <button
          onClick={() => router.push("/login")} // Redirige a la página de login
          className="border border-gray-400 p-2 rounded-md text-white hover:bg-gray-700"
        >
          Iniciar sesión
        </button>
      )}
    </header>
  );
};

export default Header;
