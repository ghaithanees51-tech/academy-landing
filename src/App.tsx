import DirSync from "@/components/DirSync";
import AppRouter from "@/routes/AppRouter";

export default function App() {
  return (
    <DirSync>
      <AppRouter />
    </DirSync>
  );
}