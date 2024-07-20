"use client";

import { FaSearch, FaShoppingCart } from 'react-icons/fa';
export function Header() {
  return (
    <header>
      <div className='flex justify-end text-black gap-4 px-3'>
        <div className="text-xs">
          Help
        </div>
        <div className="text-xs">
          Orders & Returns
        </div>
        <div className="text-xs">
          Hi, John
        </div>
    </div>
    <div className="flex justify-between items-center p-4 text-black">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">ECOMMERCE</h1>
      </div>
      <nav className="flex space-x-6">
        <a href="#" className="hover:text-gray-400 text-xs font-bold">Categories</a>
        <a href="#" className="hover:text-gray-400 text-xs font-bold">Sales</a>
        <a href="#" className="hover:text-gray-400 text-xs font-bold">Clearance</a>
        <a href="#" className="hover:text-gray-400 text-xs font-bold">New Stock</a>
        <a href="#" className="hover:text-gray-400 text-xs font-bold">Trending</a>
      </nav>
      <div className="flex items-center space-x-4">
        <FaSearch className="cursor-pointer" />
        <FaShoppingCart className="cursor-pointer" />
      </div>
      </div>
      <div className="flex bg-gray-100 items-center justify-center py-1 h-6 text-black text-xs gap-1">
        <div className="px-1"> &lt; </div>
        <div className="text-center">
          Get 10% off on business signup
        </div>
        <div className="px-1"> &gt; </div>
</div>
    </header>
    
  );
}
