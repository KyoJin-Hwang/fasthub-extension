import { Button } from "@/popup/components/ui/button";

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-100 p-4">
      <Button
        variant="outline"
        className="text-gray-500 border-gray-300 bg-transparent hover:bg-red-300 hover:border-gray-400 hover:text-gray-600 transition-all duration-200"
      >
        테스트
      </Button>
    </div>
  );
}

export default App;
