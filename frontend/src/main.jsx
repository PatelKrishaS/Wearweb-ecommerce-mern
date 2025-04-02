// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SearchProvider } from './components/context/SearchContext.jsx';
import { ProductProvider } from './components/context/ProductContext.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <div id="tailwind"> 
        <SearchProvider>
            <ProductProvider>
                <App />
            </ProductProvider>
        </SearchProvider>
    </div>
  
    </BrowserRouter>

)
