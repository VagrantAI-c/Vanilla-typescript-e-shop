import { Vehicle } from './vehicle.model';

export const VEHICLES: Vehicle[] = [
    new Vehicle(generatePlaceholder(), 'Ferrari', 500_000),
    new Vehicle(generatePlaceholder(), 'Lamborghini', 499_000),
    new Vehicle(generatePlaceholder(), 'Kawasaki', 100_000),
    new Vehicle(generatePlaceholder(), 'Samurai', 99_000),
    new Vehicle(generatePlaceholder(), 'Gucci', 5_000),
    new Vehicle(generatePlaceholder(), 'Tesla', 10_000),
    new Vehicle(generatePlaceholder(), 'Boeing', 1_000_000),
    new Vehicle(generatePlaceholder(), 'S7', 900_000),
];

function generatePlaceholder(): string {
    return `https://via.placeholder.com/${getRandomWidth()}`;
}

function getRandomWidth(): number {
    return Math.floor(Math.random() * 600 + 400);
}