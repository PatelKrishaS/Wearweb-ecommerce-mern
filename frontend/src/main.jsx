// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SearchProvider } from './components/context/SearchContext.jsx';
import { ProductProvider } from './components/context/ProductContext.jsx';
import { CartProvider } from './components/context/CartContext.jsx';
import { WishlistProvider } from './components/context/WishlistContext.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <div id="tailwind"> 
        <SearchProvider>
            <ProductProvider>
                <CartProvider>
                        <WishlistProvider>
                            <App />
                        </WishlistProvider>
                </CartProvider>
            </ProductProvider>
        </SearchProvider>
    </div>
  
    </BrowserRouter>

)
