"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";
import Pagination from "./pagination";
import type { Product } from '@prisma/client';

export function ProductCategory() {
  const [error, setError] = useState<string | null>(null);
  const [ products, setProducts ] = useState<Product[]>([]);
  const [ userProducts, setUserProducts ] = useState<number[]>([]);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [ totalPages, setTotalPages] = useState(0);
  const [ userId, setUserId] = useState(0);
  const itemPerPage = 6;
  
  const getProductsAll = api.product.getAll.useMutation({
    onSuccess: async (res) => {
      console.log("products res", res);
      setTotalPages(Math.ceil(res.length/ itemPerPage));
      console.log(totalPages);
      console.log(Math.ceil(res.length/ itemPerPage));
    },
    onError: async (error) => {
      console.log(error);
      setError(error.message);
    },
    
  });
  const getUser = api.user.me.useMutation({
    onSuccess: async (res) => {
      console.log("usr res", res);
      setUserId(res.id);
      const productIds = res.products.map(obj => obj.productId);
      setUserProducts(productIds);
    },
    onError: async () => {
      router.push('/login');
    },
  })
  const getProducts = api.product.getAll.useMutation({
    onSuccess: async (res) => {
      console.log("products res", res);
      setProducts(res);
    },
    onError: async (error) => {
      console.log(error);
      setError(error.message);
    },
    
  });
  const insertUserProduct = api.userproduct.insert.useMutation({
    onSuccess: async (res) => {
      console.log("products res", res);
    },
    onError: async (error) => {
      console.log(error);
      setError(error.message);
    },
    
  });
  const deleteUserProduct = api.userproduct.delete.useMutation({
    onSuccess: async (res) => {
      console.log("products res", res);
    },
    onError: async (error) => {
      console.log(error);
      setError(error.message);
    },
    
  });

  useEffect(() => {
      getProductsAll.mutate({ });
      const oldEmail = localStorage.getItem('verificationProp');
      if(!oldEmail) {
        router.push('/login');
      } else {
        getUser.mutate({ email : oldEmail});
      }
      
  }, []);

  useEffect(() => {
    getProducts.mutate({ skip: (currentPage - 1)*6 , take : 6});
  }, [currentPage]);
  
  useEffect(() => {
    getProducts.mutate({ skip: (currentPage - 1)*6 , take : 6});
  }, [userProducts]);
 

  const handlePageChange = (page : number) => { 
    setCurrentPage(page);
  };

  const checkItemSelected = (productId :number) => {
    return userProducts.includes(productId);
  }
  type HandleCheckboxChangeParams = {
    productId: number;
    checked: boolean;
  };
  
  const handleCheckboxChange =({ productId, checked }: HandleCheckboxChangeParams) => {
    setUserProducts(prevProducts => {
      const updatedProducts = prevProducts.includes(productId)
        ? prevProducts.filter(id => id !== productId)
        : [...prevProducts, productId];
      return updatedProducts;
    });
    if(checked) {
      if(!userProducts.includes(productId)) {
        insertUserProduct.mutate({userId : userId, productId : productId});
      }
    } else {
      deleteUserProduct.mutate({userId : userId, productId : productId});
    }
  }
  return (
    <div className="w-full max-w-xs text-black">
      {error && <p>{error}</p>}
      <div className="w-100 text-center mt-2">
           <p className="font-bold">Please mark your interests!</p>
           <p className="text-xs">We will keep you notified.</p>
      </div>
      <div className="w-100 text-left mt-2">
           <p className="text-sm font-bold">My saved interests!</p>
      </div>
      <form onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex flex-col gap-2 mt-4">
          { 
            products.map((item) => {
              return <div key={item.id}><input type="checkbox" key={item.id} id={item.name} name={item.name} value={item.name} onChange={(e) => handleCheckboxChange({ productId :item.id, checked :e.target.checked})} checked={checkItemSelected(item.id)} className={checkItemSelected(item.id)? "w-4 h-4 bg-gray-500" : "w-4 h-4 bg-black text-white"}>
              </input>
              <label key={item.id} htmlFor={item.name}> {item.name}</label><br></br></div>
            })
 
          }
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
          
          </form>
      
    </div>
  );
}
