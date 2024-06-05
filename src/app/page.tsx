"use client";

import { useState } from "react";
import PhotoUpload from "../components/PhotoUpload";
import WeatherLoading from "../components/WeatherLoading";
import WeatherDisplay from "../components/WeatherDisplay";
import exifreader from "exifreader";
import { fetchWeatherApi } from "openmeteo";
import { reformatDate, reformatTime } from "@/utils/parse";

export default function Home() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [isLoading, setIsLoading] = useState(false);

  // temp delay function to test loading animation
  const delay = (ms: number | undefined) =>
    new Promise((res) => setTimeout(res, ms));

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // read photo metadata
      const tags = await exifreader.load(file);

      // get latitude, longitude, and time from metadata
      const latitude = tags.GPSLatitude?.description;
      const longitude = tags.GPSLongitude?.description;
      const dateTimeOriginal = tags.DateTimeOriginal?.description;

      // if location and time are available, fetch weather
      if (latitude && longitude && dateTimeOriginal) {

        setIsLoading(true);
        setSelectedPhoto(URL.createObjectURL(file));

        const formattedDate = reformatDate(dateTimeOriginal);
        const formattedtime = reformatTime(dateTimeOriginal);

        const params = {
          latitude: latitude,
          longitude: longitude,
          start_date: formattedDate,
          end_date: formattedDate,
          hourly: ["temperature_2m"],
          temperature_unit: "fahrenheit",
          wind_speed_unit: "mph",
          precipitation_unit: "inch",
        };

        const url = "https://archive-api.open-meteo.com/v1/archive";
        const responses = await fetchWeatherApi(url, params);

        const range = (start: number, stop: number, step: number) =>
          Array.from(
            { length: (stop - start) / step },
            (_, i) => start + i * step
          );

        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourly = response.hourly()!;
        const weatherData = {
          hourly: {
            time: range(
              Number(hourly.time()),
              Number(hourly.timeEnd()),
              hourly.interval()
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            temperature2m: hourly.variables(0)!.valuesArray()!,
          },
        };

        const weather: WeatherData = {
          temperature: weatherData["hourly"]["temperature2m"][formattedtime],
        };
        setWeatherData(weather);
        setIsLoading(false);
      } else {
        // TODO: handle when location and time aren't available
      }
    }
  };

  return (
    <>
      <header className="fixed top-12 left-0 w-full z-10">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl sm:text-6xl font-bold text-center text-blue-700">
            photo<span className="text-yellow-400">skies</span>{" "}
            <span className="text-3xl sm:text-4xl">&#x26C5;</span>
          </h1>
        </div>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-200 to-white">
        {!selectedPhoto && <PhotoUpload onPhotoChange={handlePhotoChange} />}

        {isLoading && <WeatherLoading />}

        {selectedPhoto && weatherData && (
          <div className="flex flex-col items-center">
            <img
              src={selectedPhoto}
              className="max-w-md rounded-lg shadow-lg mb-4"
            />
            <WeatherDisplay weatherData={weatherData} />
          </div>
        )}

        {(selectedPhoto || weatherData) && (
          <button
            onClick={() => {
              setSelectedPhoto(null);
              setWeatherData(undefined);
              setIsLoading(false);
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Start Over
          </button>
        )}
      </main>
    </>
  );
}
