"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


interface Product {

    id:number;
    sku:string;
    name:string;
    category:string;
    stock:number;
    unit_cost:number;
    price:number;
    weekly_demand:number;

}


export default function ProductsPage(){


    const [products,setProducts] = useState<Product[]>([]);

    const [search,setSearch] = useState("");

    const [category,setCategory] = useState("");

    const [status,setStatus] = useState("");



    useEffect(()=>{

        getProducts();

    },[]);



    const getProducts = async()=>{


        const {data,error}=await supabase
        .from("products")
        .select("*");


        if(error){

            console.log(error);
            return;

        }


        setProducts(data);


    };



    return(

        <main className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                Productos
            </h1>



        </main>

    );

}