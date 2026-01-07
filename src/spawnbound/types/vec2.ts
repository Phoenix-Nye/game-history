
// represents positions or velocities as a tuple
export type Vec2 = [number, number];

export namespace Vec2 {

    /**
     * Adds two vectors together component-wise.
     * Example: [1, 2] + [3, 4] = [4, 6]
     * Useful for: Moving a position by a velocity, combining forces
     */
    export function add(a: Vec2, b: Vec2): Vec2 {
        return [a[0] + b[0], a[1] + b[1]];
    }

    /**
     * Subtracts vector b from vector a component-wise.
     * Example: [5, 6] - [2, 3] = [3, 3]
     * Useful for: Finding the direction/difference between two points
     */
    export function sub(a: Vec2, b: Vec2): Vec2 {
        return [a[0] - b[0], a[1] - b[1]];
    }

    /**
     * Multiplies two vectors component-wise (not a dot product).
     * Example: [2, 3] * [4, 5] = [8, 15]
     * Useful for: Scaling each component independently
     */
    export function mul(a: Vec2, b: Vec2): Vec2 {
        return [a[0] * b[0], a[1] * b[1]];
    }

    /**
     * Divides vector a by vector b component-wise.
     * Example: [8, 15] / [2, 3] = [4, 5]
     * Useful for: Scaling down each component independently
     */
    export function div(a: Vec2, b: Vec2): Vec2 {
        return [a[0] / b[0], a[1] / b[1]];
    }

    /**
     * Multiplies a vector by a scalar (single number).
     * Example: scale([2, 3], 2) = [4, 6]
     * Useful for: Changing speed/magnitude while keeping direction
     */
    export function scale(a: Vec2, s: number): Vec2 {
        return [a[0] * s, a[1] * s];
    }

    /**
     * Calculates the dot product of two vectors (returns a number, not a vector).
     * Formula: a.x * b.x + a.y * b.y
     * Useful for: Checking if vectors point in the same direction, calculating angles
     * Returns positive if pointing same direction, negative if opposite
     */
    export function dot(a: Vec2, b: Vec2): number {
        return a[0] * b[0] + a[1] * b[1];
    }

    /**
     * Calculates the length (magnitude) of a vector using the Pythagorean theorem.
     * Example: length([3, 4]) = 5 (because 3² + 4² = 5²)
     * Useful for: Finding distance from origin, checking vector magnitude
     */
    export function length(a: Vec2): number {
        return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
    }

    /**
     * Converts a vector to a unit vector (length of 1) pointing in the same direction.
     * Example: normalize([3, 4]) = [0.6, 0.8] (length is now 1)
     * Useful for: Getting direction without magnitude, normalizing velocities
     */
    export function normalize(a: Vec2): Vec2 {
        const len = length(a);
        if (len === 0) return [0, 0];
        return [a[0] / len, a[1] / len];
    }

    /**
     * Calculates the distance between two points (vectors).
     * Example: distance([0, 0], [3, 4]) = 5
     * Useful for: Collision detection, checking if objects are close
     */
    export function distance(a: Vec2, b: Vec2): number {
        return length(sub(a, b));
    }

    /**
     * Linearly interpolates (lerps) between two vectors.
     * When t=0, returns a. When t=1, returns b. When t=0.5, returns halfway between.
     * Example: mix([0, 0], [10, 10], 0.5) = [5, 5]
     * Useful for: Smooth movement, animations, easing
     */
    export function mix(a: Vec2, b: Vec2, t: number): Vec2 {
        return add(scale(a, 1 - t), scale(b, t));
    }

    /**
     * Returns a vector with the minimum x and minimum y from both vectors.
     * Example: min([5, 3], [2, 7]) = [2, 3]
     * Useful for: Finding bounding box corners, clamping to minimum values
     */
    export function min(a: Vec2, b: Vec2): Vec2 {
        return [Math.min(a[0], b[0]), Math.min(a[1], b[1])];
    }

    /**
     * Returns a vector with the maximum x and maximum y from both vectors.
     * Example: max([5, 3], [2, 7]) = [5, 7]
     * Useful for: Finding bounding box corners, clamping to maximum values
     */
    export function max(a: Vec2, b: Vec2): Vec2 {
        return [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
    }

    /**
     * Returns a vector with absolute values of each component.
     * Example: abs([-3, 4]) = [3, 4]
     * Useful for: Removing negative signs, calculating distances regardless of direction
     */
    export function abs(a: Vec2): Vec2 {
        return [Math.abs(a[0]), Math.abs(a[1])];
    }

    /**
     * Rounds each component down to the nearest integer.
     * Example: floor([3.7, 2.2]) = [3, 2]
     * Useful for: Converting to grid coordinates, pixel-perfect positioning
     */
    export function floor(a: Vec2): Vec2 {
        return [Math.floor(a[0]), Math.floor(a[1])];
    }

    /**
     * Rounds each component up to the nearest integer.
     * Example: ceil([3.2, 2.7]) = [4, 3]
     * Useful for: Converting to grid coordinates, pixel-perfect positioning
     */
    export function ceil(a: Vec2): Vec2 {
        return [Math.ceil(a[0]), Math.ceil(a[1])];
    }

    /**
     * Clamps each component of vector a between minVal and maxVal.
     * Example: clamp([15, -5], [0, 0], [10, 10]) = [10, 0]
     * Useful for: Keeping positions within bounds, limiting movement to screen edges
     */
    export function clamp(a: Vec2, minVal: Vec2, maxVal: Vec2): Vec2 {
        return [Math.max(minVal[0], Math.min(maxVal[0], a[0])), 
                Math.max(minVal[1], Math.min(maxVal[1], a[1]))];
    }

    /**
     * Reflects an incident vector off a surface with the given normal vector.
     * Example: A ball bouncing off a wall - incident is the ball's velocity, normal is the wall's direction
     * Useful for: Bouncing physics, light reflections, ricochets
     */
    export function reflect(incident: Vec2, normal: Vec2): Vec2 {
        const dotProduct = dot(incident, normal);
        return sub(incident, scale(normal, 2 * dotProduct));
    }
}