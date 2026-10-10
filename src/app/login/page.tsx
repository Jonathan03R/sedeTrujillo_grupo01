import { LoginView } from "@/views/login/LoginView";

// Pantalla de acceso (sin menú). El proxy manda aquí a quien no tenga sesión iniciada.
export default function PaginaLogin() {
  return <LoginView />;
}
