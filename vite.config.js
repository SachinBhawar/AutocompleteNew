import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: "0.0.0.0", // enables access from network
        port: 3000, // or omit to let Vite choose automatically
    },
});
