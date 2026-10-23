import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ProductDemo } from './ProductDemo';
import { HelpDemo } from './HelpDemo';

const calculation = document.getElementById('product-demo');
if (calculation) createRoot(calculation).render(<StrictMode><ProductDemo /></StrictMode>);
const help = document.getElementById('help-demo');
if (help) createRoot(help).render(<StrictMode><HelpDemo /></StrictMode>);
