"use client";

export default function WeatherDisplay(props: {weatherData: WeatherData}) {
  return (
    <div className="mt-4 text-center text-gray-800">
      <h2 className="text-2xl font-semibold mb-2">
        Temperature: {props.weatherData.temperature}°F
      </h2>
    </div>
  );
}
