import { Toaster } from "sonner";
import { WeatherApp } from "./WeatherApp";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-center items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-blue-600">NCR Weather</h2>
      </header>
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
              NCR Weather Forecast
            </h1>
            <p className="text-lg text-gray-600">
              Real-time weather updates for Metro Manila cities
            </p>
          </div>
          <WeatherApp />
        </div>
      </main>
      <Toaster />
    </div>
  );
}
