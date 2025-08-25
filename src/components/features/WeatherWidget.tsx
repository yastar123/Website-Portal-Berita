import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  humidity: number;
  windSpeed: number;
  location: string;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
    location: 'Jakarta'
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate weather data changes
    const weatherInterval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: 25 + Math.random() * 10,
        humidity: 50 + Math.random() * 30,
        windSpeed: 5 + Math.random() * 15,
      }));
    }, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="bg-gradient-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>Cuaca & Waktu</span>
          {getWeatherIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time & Date */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {formatTime(currentTime)}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Weather Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{weather.location}</span>
            <div className="flex items-center space-x-1">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span className="font-semibold">{Math.round(weather.temperature)}°C</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-1">
              <Droplets className="h-3 w-3 text-blue-500" />
              <span className="text-muted-foreground">Kelembaban</span>
              <span className="font-medium">{Math.round(weather.humidity)}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Wind className="h-3 w-3 text-green-500" />
              <span className="text-muted-foreground">Angin</span>
              <span className="font-medium">{Math.round(weather.windSpeed)} km/h</span>
            </div>
          </div>
        </div>

        {/* Weather description */}
        <div className="text-xs text-muted-foreground text-center">
          {weather.condition === 'sunny' && 'Cerah berawan'}
          {weather.condition === 'cloudy' && 'Berawan'}
          {weather.condition === 'rainy' && 'Hujan ringan'}
        </div>
      </CardContent>
    </Card>
  );
};