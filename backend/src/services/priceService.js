// Simple Algorithm for Estimation
// In production, this would use Google Maps API or similar for distance

exports.calculatePrice = (weightKg, vehicleType, distanceKm = 500) => {
    // Base Rates
    const baseRate = 100; // Euro
    const perKmRate = 1.5; // Euro/km

    // Multipliers
    let vehicleMultiplier = 1;
    if (vehicleType === 'Truck') vehicleMultiplier = 1.2;
    if (vehicleType === 'Van') vehicleMultiplier = 0.8;

    let weightMultiplier = 1 + (weightKg / 10000); // +10% per 1000kg ??? No, simplistic

    // Simple Calculation
    // Price = (Base + (Distance * Rate)) * TypeMultiplier

    const estimated = (baseRate + (distanceKm * perKmRate)) * vehicleMultiplier;

    return {
        min: Math.round(estimated * 0.9),
        max: Math.round(estimated * 1.1),
        suggested: Math.round(estimated)
    };
};
