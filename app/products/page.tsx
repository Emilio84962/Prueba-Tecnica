"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { useRouter } from "next/navigation";


interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  unit_cost: number;
  price: number;
  weekly_demand: number;
}


export default function ProductsPage() {

  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);



  // Obtener productos desde Supabase
  useEffect(() => {

    getProducts();

  }, []);

    const router = useRouter();

  const handleLogout = async () => {

    await supabase.auth.signOut();

    router.push("/");

  };

  const getProducts = async () => {

    const { data, error } = await supabase
      .from("products")
      .select("*");


    if (error) {
      console.error(error);
      return;
    }


    setProducts(data);

    setLoading(false);
  };



  // Calcular estado del inventario
  const calculateStatus = (
    stock: number,
    weeklyDemand: number
  ) => {


    if (stock < weeklyDemand) {

      return {
        name: "Crítico",
        color: "bg-red-500"
      };

    }


    if (stock < 2 * weeklyDemand) {

      return {
        name: "Bajo",
        color: "bg-orange-400"
      };

    }


    if (stock < 4 * weeklyDemand) {

      return {
        name: "Saludable",
        color: "bg-green-500"
      };

    }


    return {
      name: "Exceso",
      color: "bg-blue-500"
    };

  };



  // Filtrado
  const filteredProducts = products.filter((product) => {


    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
      ||
      product.sku
        .toLowerCase()
        .includes(search.toLowerCase());



    const matchesCategory =
      category === ""
      ||
      product.category === category;



    const productStatus =
      calculateStatus(
        product.stock,
        product.weekly_demand
      ).name;



    const matchesStatus =
      status === ""
      ||
      productStatus === status;



    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus
    );

  });



  // Categorías dinámicas
  const categories = [
    ...new Set(products.map(product => product.category))
  ];



  if (loading) {

    return (
      <div className="p-10">
        Cargando productos...
      </div>
    );

  }



  return (

    <main className="p-8">


      <h1 className="text-3xl font-bold mb-6">
        Listado de Productos
      </h1>



      {/* Filtros */}
      <div className="flex gap-4 mb-6">


        <input

          type="text"

          placeholder="Buscar por nombre o SKU"

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

          className="border rounded p-2 w-80"

        />



        <select

          value={category}

          onChange={(e)=>setCategory(e.target.value)}

          className="border rounded p-2"

        >

          <option value="">
            Todas las categorías
          </option>


          {
            categories.map((cat)=>(
              <option key={cat}>
                {cat}
              </option>
            ))
          }


        </select>




        <select

          value={status}

          onChange={(e)=>setStatus(e.target.value)}

          className="border rounded p-2"

        >

          <option value="">
            Todos los estados
          </option>

          <option value="Crítico">
            Crítico
          </option>

          <option value="Bajo">
            Bajo
          </option>

          <option value="Saludable">
            Saludable
          </option>

          <option value="Exceso">
            Exceso
          </option>


        </select>


      </div>





      {/* Tabla */}
      <div className="overflow-x-auto">


      <table className="w-full border-collapse border">


        <thead className="bg-gray-100">


          <tr>

            <th className="border p-3">
              SKU
            </th>

            <th className="border p-3">
              Nombre
            </th>

            <th className="border p-3">
              Categoría
            </th>

            <th className="border p-3">
              Stock
            </th>

            <th className="border p-3">
              Costo unitario
            </th>

            <th className="border p-3">
              Precio
            </th>

            <th className="border p-3">
              Demanda semanal
            </th>

            <th className="border p-3">
              Estado
            </th>


          </tr>


        </thead>



        <tbody>


        {
          filteredProducts.map((product)=>(

            <tr key={product.id}>


              <td className="border p-3">
                {product.sku}
              </td>


              <td className="border p-3">
                {product.name}
              </td>


              <td className="border p-3">
                {product.category}
              </td>


              <td className="border p-3">
                {product.stock}
              </td>


              <td className="border p-3">
                ${product.unit_cost}
              </td>


              <td className="border p-3">
                ${product.price}
              </td>


              <td className="border p-3">
                {product.weekly_demand}
              </td>



              <td className="border p-3">


              {
                (()=>{

                  const state = calculateStatus(
                    product.stock,
                    product.weekly_demand
                  );


                  return (

                    <span
                      className={`${state.color} text-white px-3 py-1 rounded`}
                    >
                      {state.name}
                    </span>

                  );


                })()
              }


              </td>


            </tr>


          ))
        }


        </tbody>


      </table>


      </div>

       <button
        onClick={handleLogout}
        className="mt-10 rounded bg-red-600 px-6 py-3 text-white hover:bg-red-700"
      >
        Cerrar sesión
      </button>


    </main>

  );

}