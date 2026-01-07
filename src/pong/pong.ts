        // Get canvas and context
        const canvas = document.querySelector("canvas")!; /* ! mark is typescript it asserts that something is not null */
        const ctx = canvas.getContext('2d')!;/* ! mark is typescript it asserts that something is not null */

        // TODO: Add your game state variables here
        // Example: paddles, ball, scores, etc.
        let ball = {
            x: 10,
            y: 10,
            velocityX: 3,
            velocityY: 1.5,
        }

        let paddle = {
            x: 0,
            y: 30,
            velocityY: 4,
        };
        let paddleBot = {
            x: 790,
            y: 520,
            velocityY: 4,
        };

        let paddleBotCollision = true;
        let paddleCollision = true;

        let keyState = {};

        let hitPosition = {};

        let botPoints = 0;

        let playerPoints = 0;

        //defining things-

        document.addEventListener("keydown", (event) => {
            keyState[event.key] = true;
        });

        document.addEventListener("keyup", (event) => {
            keyState[event.key] = false;
        });

        function clankerCalc(control) {
            // Calculate distance to the target paddle
            let distance = Math.abs(control.x - ball.x);
            // Use absolute value of velocityX to get positive time
            let time = distance / Math.abs(ball.velocityX);
            let predictedY = ball.y + (ball.velocityY * time);
            let difference = (control.y + 25) - predictedY;
            let tolerance = 5;
            if (Math.abs(difference) > tolerance) {
                if (control.y + 25 > predictedY) {
                    if (control.y >= 0) {
                        control.y -= control.velocityY;
                    }
                } else if (control.y + 25 < predictedY) {
                    if (control.y <= canvas.height - 50) {
                        control.y += control.velocityY;
                    }
                }
            }
        }

        function updateCollisionFlags() {
            // Enable collision based on which side of canvas the ball is on
            let canvasCenter = canvas.width / 2;
            if (ball.x < canvasCenter) {
                // Ball is on left side - enable player paddle collision
                paddleCollision = true;
                paddleBotCollision = false;
            } else {
                // Ball is on right side - enable bot paddle collision
                paddleCollision = false;
                paddleBotCollision = true;
            }
        }

        // Update game state
        function update() {
            // TODO: Update your game objects here
            // Example: move paddles, move ball, check collisions
            
            // Handle paddle movement first
            if (keyState['w'] || keyState['W']) {
                if (ball.velocityX < 0) {
                    clankerCalc(paddle);
                }
            }
            if (keyState['ArrowUp']) {
                if (paddle.y >= 0) {
                    paddle.y -= paddle.velocityY;
                }
            }
            if (keyState['ArrowDown']) {
                if (paddle.y <= canvas.height - 50) {
                    paddle.y += paddle.velocityY;
                }
            }
            
            // Clanker Code
            if (ball.velocityX > 0) {
                clankerCalc(paddleBot);
            }
            
            // Collision detection with Player paddle (ball moving left toward left paddle)
            if (ball.velocityX < 0 && ball.x <= paddle.x + 10 && ball.x + ball.velocityX <= paddle.x + 10) {
                // Check if ball's Y position overlaps with paddle's Y range
                if (ball.y + 10 >= paddle.y && ball.y <= paddle.y + 50) {
                    // Calculate hit fraction (0.0 = top, 1.0 = bottom)
                    let hitFraction = (ball.y + 5 - paddle.y) / 50;
                    hitFraction = Math.max(0, Math.min(1, hitFraction)); // Clamp to [0, 1]
                    
                    // Map hitFraction to angle: -45° to +45° (in radians: -π/4 to π/4)
                    // 0.0 -> -45°, 0.5 -> 0°, 1.0 -> +45°
                    let angle = (hitFraction - 0.5) * (Math.PI / 2);
                    
                    // Calculate current speed
                    let speed = Math.sqrt(ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY);
                    // Apply speed multiplier
                    speed *= 1.1;
                    
                    // Calculate new velocities based on angle (rightward after bounce)
                    ball.velocityX = Math.cos(angle) * speed;
                    ball.velocityY = Math.sin(angle) * speed;
                    
                    // Position ball just outside paddle
                    ball.x = paddle.x + 10;
                }
            }
            
            // Collision detection with Bot paddle (ball moving right toward right paddle)
            if (ball.velocityX > 0 && ball.x + 10 >= paddleBot.x && ball.x + 10 + ball.velocityX >= paddleBot.x) {
                // Check if ball's Y position overlaps with paddle's Y range
                if (ball.y + 10 >= paddleBot.y && ball.y <= paddleBot.y + 50) {
                    // Calculate hit fraction (0.0 = top, 1.0 = bottom)
                    let hitFraction = (ball.y + 5 - paddleBot.y) / 50;
                    hitFraction = Math.max(0, Math.min(1, hitFraction)); // Clamp to [0, 1]
                    
                    // Map hitFraction to angle: -45° to +45° (in radians: -π/4 to π/4)
                    // 0.0 -> -45°, 0.5 -> 0°, 1.0 -> +45°
                    let angle = (hitFraction - 0.5) * (Math.PI / 2);
                    
                    // Calculate current speed
                    let speed = Math.sqrt(ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY);
                    // Apply speed multiplier
                    speed *= 1.1;
                    
                    // Calculate new velocities based on angle (leftward after bounce)
                    ball.velocityX = -Math.cos(angle) * speed;
                    ball.velocityY = Math.sin(angle) * speed;
                    
                    // Position ball just outside paddle
                    ball.x = paddleBot.x - 10;
                }
            }
            
            // Now move the ball
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            
            // Update collision flags based on ball position
            updateCollisionFlags();
            
            //Ball Bounce (walls)
            if (ball.x < 0) {
                // Left wall hit
                botPoints++;
                ball.x = 1/2 * canvas.width;
                ball.y = 1/2 * canvas.height;
                ball.velocityX = -3;
                ball.velocityY = 0;
                paddle.y = canvas.height/2 - 25;
            }
            if (ball.x + 10 > canvas.width) {
                // Right wall hit
                playerPoints++;
                ball.x = 1/2 * canvas.width;
                ball.y = 1/2 * canvas.height;
                ball.velocityX = 3;
                ball.velocityY = 0;
                paddleBot.y = canvas.height/2 - 25;
            }
            if (ball.y + 10 > canvas.height || ball.y < 0) {
                ball.velocityY = -ball.velocityY;
            }
            if (playerPoints == 7) {
                playerPoints = 0;
                botPoints = 0;
                ball.x = 1/2 * canvas.width;
                ball.y = 1/2 * canvas.height;
                ball.velocityX = -3;
                ball.velocityY = 0;
                paddle.y = canvas.height/2 - 25;
            }
            if (botPoints == 7) {
                playerPoints = 0;
                botPoints = 0;
                ball.x = 1/2 * canvas.width;
                ball.y = 1/2 * canvas.height;
                ball.velocityX = 3;
                ball.velocityY = 0;
                paddleBot.y = canvas.height/2 - 25;
            }
        }
        // Draw everything
        function draw() {
            // Clear the canvas
            ctx.fillStyle = '#0f3460';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw clanker and player scores
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(playerPoints + ' - ' + botPoints, canvas.width / 2, 50);

            // TODO: Draw your game objects here
            ctx.fillStyle = 'white';
            ctx.fillRect(ball.x, ball.y, 10, 10);
            // Player Paddle
            ctx.fillStyle = 'cyan';
            ctx.fillRect(paddle.x, paddle.y, 10, 50);
            // Clanker Paddle
            ctx.fillStyle = 'green';
            ctx.fillRect(paddleBot.x, paddleBot.y, 10, 50);
        }


        // Main game loop
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }

        // Start the game
        gameLoop();

        // Make this file a module (ESM)
        export {};