"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";


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


export default function ManageProductPage() {


  const router = useRouter();

  const searchParams = useSearchParams();

  const productId = searchParams.get("id");


  const [form, setForm] = useState<Product>({

    id: 0,
    sku: "",
    name: "",
    category: "",
    stock: 0,
    unit_cost: 0,
    price: 0,
    weekly_demand: 0

  });


  const [loading,setLoading] = useState(false);

  const [message,setMessage] = useState("");



  // Si existe ID carga producto para editar
  useEffect(()=>{


    if(productId){

      getProduct(Number(productId));

    }


  },[productId]);




  const getProduct = async(id:number)=>{


    const {data,error}=await supabase

    .from("products")

    .select("*")

    .eq("id",id)

    .single();



    if(error){

      console.error(error);

      return;

    }


    setForm(data);


  };





  const handleChange = (
    e:React.ChangeEvent<HTMLInputElement>
  )=>{


    const {name,value}=e.target;


    setForm({

      ...form,

      [name]:
        ["stock","unit_cost","price","weekly_demand"]
        .includes(name)
        ? Number(value)
        : value

    });


  };






  const saveProduct = async(
    e:React.FormEvent
  )=>{


    e.preventDefault();


    setLoading(true);

    setMessage("");



    let response;



    // EDITAR
    if(productId){


      response = await supabase

      .from("products")

      .update({

        sku:form.sku,

        name:form.name,

        category:form.category,

        stock:form.stock,

        unit_cost:form.unit_cost,

        price:form.price,

        weekly_demand:form.weekly_demand


      })

      .eq(
        "id",
        Number(productId)
      );



    }

    // CREAR
    else{


      response = await supabase

      .from("products")

      .insert({

        sku:form.sku,

        name:form.name,

        category:form.category,

        stock:form.stock,

        unit_cost:form.unit_cost,

        price:form.price,

        weekly_demand:form.weekly_demand


      });


    }



    setLoading(false);



    if(response.error){


      setMessage(
        "Error: "+response.error.message
      );

      return;

    }



    setMessage(
      productId
      ? "Producto actualizado correctamente"
      : "Producto creado correctamente"
    );



    setTimeout(()=>{

      router.push("/products");

    },1500);


  };





  return (

    <main className="p-8">


      <h1 className="text-3xl font-bold mb-6">

        {
          productId
          ? "Editar producto"
          : "Nuevo producto"
        }

      </h1>




      <form
        onSubmit={saveProduct}
        className="max-w-xl space-y-4"
      >



        <input

          name="sku"

          placeholder="SKU"

          value={form.sku}

          onChange={handleChange}

          className="border p-3 w-full rounded"

          required

        />



        <input

          name="name"

          placeholder="Nombre"

          value={form.name}

          onChange={handleChange}

          className="border p-3 w-full rounded"

          required

        />



        <input

          name="category"

          placeholder="Categoría"

          value={form.category}

          onChange={handleChange}

          className="border p-3 w-full rounded"

          required

        />



        <input

          type="number"

          name="stock"

          placeholder="Stock"

          value={form.stock}

          onChange={handleChange}

          className="border p-3 w-full rounded"

        />



        <input

          type="number"

          name="unit_cost"

          placeholder="Costo unitario"

          value={form.unit_cost}

          onChange={handleChange}

          className="border p-3 w-full rounded"

        />



        <input

          type="number"

          name="price"

          placeholder="Precio"

          value={form.price}

          onChange={handleChange}

          className="border p-3 w-full rounded"

        />



        <input

          type="number"

          name="weekly_demand"

          placeholder="Demanda semanal"

          value={form.weekly_demand}

          onChange={handleChange}

          className="border p-3 w-full rounded"

        />





        {
          message && (

            <p className="text-center">

              {message}

            </p>

          )
        }





        <button

          disabled={loading}

          className="bg-blue-600 text-white px-6 py-3 rounded"

        >

          {
            loading
            ? "Guardando..."
            : productId
              ? "Actualizar producto"
              : "Crear producto"
          }


        </button>



      </form>

         <button
            onClick={() =>
            router.push(`/products`)}
            className="bg-red-500 text-white px-3 py-1 rounded mt-20 ">
            Volver
          </button>

    </main>

  );


}