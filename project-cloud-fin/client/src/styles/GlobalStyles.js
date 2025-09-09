import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: #0f172a;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    margin: 0;
  }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #1e293b; }
  ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #4f46e5; }
`;
