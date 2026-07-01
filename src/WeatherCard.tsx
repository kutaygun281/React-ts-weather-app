interface WeatherCardProps {
    city: string;
    temperature: number}

function WeatherCard({ city, temperature }: WeatherCardProps) {
    return (
        <div>
            <h2>{city}</h2>
            <p>Temperature: {temperature}°C</p>
        </div>
    );
}

export default WeatherCard;