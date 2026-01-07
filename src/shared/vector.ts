// Vector type - represents a 2D vector with x and y components
export type Vector = {
    x: number;
    y: number;
};

/**
 * Adds two vectors together
 * @param v1 First vector
 * @param v2 Second vector
 * @returns New vector that is the sum of v1 and v2
 */
export function vecAdd(a: Vector, b: Vector): Vector {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}

/**
 * Subtracts v2 from v1 (v1 - v2)
 * Useful for calculating the direction/difference between two points
 * @param v1 First vector
 * @param v2 Second vector
 * @returns New vector that is v1 minus v2
 */
export function vecMinus(a: Vector, b: Vector): Vector {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    };
}

/**
 * Negates a vector (flips both x and y components)
 * Useful for reversing directions or bouncing
 * @param v Vector to negate
 * @returns New vector with both components negated
 */
export function vecNegate(a: Vector): Vector {
    return {
        x: -a.x,
        y: -a.y,
    };
}

/**
 * Scales a vector by a scalar value (multiplies both components)
 * Useful for changing the magnitude/speed of a direction vector
 * @param v Vector to scale
 * @param scalar Number to multiply both components by
 * @returns New vector with both components multiplied by scalar
 */
export function vecScalar(a: Vector, b: number): Vector {
    return {
        x: a.x * b,
        y: a.y * b,
    };
}

/**
 * Normalizes a vector to have a length of 1 (unit vector)
 * Useful for getting just the direction without the magnitude
 * @param v Vector to normalize
 * @returns New unit vector pointing in the same direction, or {x: 0, y: 0} if v has zero length
 */
export function vecNormal(a: Vector): Vector {
    // Step 1: Calculate the length of the vector using Pythagorean theorem
    // length = √(x² + y²)
    const length = Math.sqrt(a.x * a.x + a.y * a.y);
    
    // Step 2: Avoid division by zero - if vector has no length, return zero vector
    if (length === 0) {
        return { x: 0, y: 0 };
    }
    
    // Step 3: Divide both components by the length to make it length 1
    // This keeps the same direction but makes the magnitude exactly 1
    return {
        x: a.x / length,
        y: a.y / length,
    };
}
