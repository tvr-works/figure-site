import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ProductDemo } from './ProductDemo';

const container = document.getElementById('product-demo');
if (container) createRoot(container).render(<StrictMode><ProductDemo /></StrictMode>);
