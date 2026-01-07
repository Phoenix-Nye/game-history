// Get canvas and context
const canvas = document.querySelector("canvas")!;
//const ctx = canvas.getContext('2d')!;

// Player ball (red sphere) - 

export let player = {
    x: 5,
    y: 2,
    size: 10, // Ball width/height
    health: 10000,
    maxHealth: 10000,
    damage: 10,
    speed: 10,
};

// Gun that rotates around the center
export let gun = {
    size: 5, // Size of the gun
    angle: 0, // Current rotation angle in radians (starts at 0)
    rotationSpeed: 0.09, // How fast the gun rotates (in radians per frame)
    distanceFromCenter: 20, // How far from center the gun orbits
    firingDelay: 25,
};

// Object to track which keys are currently pressed
export let keyState: { [key: string]: boolean } = {};

// Listen for when a key is pressed down
// This event fires when ANY key is pressed
document.addEventListener("keydown", (event) => {
    // Store that this key is currently being held down
    keyState[event.key] = true;
});

// Listen for when a key is released
// This event fires when ANY key is released
document.addEventListener("keyup", (event) => {
    // Store that this key is no longer being held down
    keyState[event.key] = false;
});

// Update player movement and rotation
export function updatePlayer() {
    // Check if the right arrow key is being pressed
    if (keyState['ArrowRight']) {
        // Increase the angle to rotate clockwise (positive direction)
        // This moves the gun around the center in a clockwise direction
        gun.angle += gun.rotationSpeed;
    }

    // Check if the left arrow key is being pressed
    if (keyState['ArrowLeft']) {
        // Decrease the angle to rotate counter-clockwise (negative direction)
        // This moves the gun around the center in a counter-clockwise direction
        gun.angle -= gun.rotationSpeed;
    }
    
    // Check if the up arrow key is being pressed
    if (keyState['ArrowUp']) {
        // Calculate the direction opposite to where the gun is pointing
        // The gun points in direction gun.angle, so opposite is gun.angle + Math.PI (180 degrees)
        // Math.cos(gun.angle + Math.PI) gives us the X direction (opposite of gun)
        // Math.sin(gun.angle + Math.PI) gives us the Y direction (opposite of gun)
        const translationSpeed = 5; // How fast objects move
        const translationX = Math.cos(gun.angle + Math.PI) * translationSpeed;
        const translationY = Math.sin(gun.angle + Math.PI) * translationSpeed;
        
        // Move all bullets in the opposite direction of the gun
            player.x -= translationX;
            player.y -= translationY;
    }
}

// Handle shooting
export function handleShooting(reloadCounter: { value: number }): boolean {
    if (keyState[' ']) {
        reloadCounter.value++;
        
        if (reloadCounter.value >= gun.firingDelay) {
            reloadCounter.value = 0;
            return true; // Return true to indicate a bullet should be fired
        }
    }
    return false;
}

// Get bullet spawn position and direction
export function getBulletSpawnInfo() {
    // Calculate the center point of the canvas
    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.5;

    // Calculate direction from ball (center) to gun using cos and sin
    // The direction from center to gun is the same as gun.angle
    // Math.cos(gun.angle) gives us the X direction (pointing away from center toward gun)
    // Math.sin(gun.angle) gives us the Y direction (pointing away from center toward gun)
    const bulletSpeed = 10; // How fast the bullet moves
    const directionX = Math.cos(gun.angle);
    const directionY = Math.sin(gun.angle);

    return {
        x: centerX, // Starting X position (at ball/center)
        y: centerY, // Starting Y position (at ball/center)
        velocityX: directionX * bulletSpeed, // X velocity (direction toward gun)
        velocityY: directionY * bulletSpeed, // Y velocity (direction toward gun)
    };
}

// Draw the player and gun
export function drawPlayer(ctx: CanvasRenderingContext2D) {
    // Calculate the center point of the canvas
    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.5;

    // PLAYER BALL (ball sphere - stays at the center)
    // Draw the grey sphere at the player's position
    ctx.fillStyle = 'Grey';
    ctx.beginPath(); // Start a new path for drawing
    // arc(x, y, radius, startAngle, endAngle) - draws a circle
    // The ball is drawn at player's position
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill(); // Fill the circle with the grey color

    // PLAYER GUN (ball that rotates around the center)
    // Calculate where to draw the gun based on the angle and distance from center
    // Math.cos(angle) gives us the X offset (horizontal position on a circle)
    // Math.sin(angle) gives us the Y offset (vertical position on a circle)
    // We multiply by distanceFromCenter to control how far from center the gun orbits
    const gunX = player.x + Math.cos(gun.angle) * gun.distanceFromCenter;
    const gunY = player.y + Math.sin(gun.angle) * gun.distanceFromCenter;

    // Draw the red sphere at the calculated position
    ctx.fillStyle = 'red';
    ctx.beginPath(); // Start a new path for drawing
    // arc(x, y, radius, startAngle, endAngle) - draws a circle
    ctx.arc(gunX, gunY, gun.size, 0, Math.PI * 2);
    ctx.fill(); // Fill the circle with the red color

    // Draw a line from ball (player position) to gun using cos and sin
    // The line shows the direction the bullet will travel
    ctx.strokeStyle = 'grey'; // Color of the line
    ctx.lineWidth = 3; // Thickness of the line
    ctx.beginPath(); // Start a new path for the line
    ctx.moveTo(player.x, player.y); // Start point (ball/player position)
    ctx.lineTo(gunX, gunY); // End point (gun position)
    ctx.stroke(); // Draw the line
}

// Make this file a module (ESM)
export {};

