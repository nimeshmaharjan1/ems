import { useEffect, useRef } from 'react';

const CardScroll = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    const cardWidth = 150;
    const cardHeight = 200;
    const numCards = 100;
    const gap = 20;
    const borderWidth = 2;
    const borderColor = 'black';

    let startTime = Date.now();
    let scrollOffset = 0;
    let scrollSpeed = 10;

    const getRandomCard = () => {
      const cards = ['♠', '♣', '♥', '♦'];
      return cards[Math.floor(Math.random() * cards.length)];
    };

    // Generate random cards for each card
    const cards: string[] = [];
    for (let i = 0; i < numCards; i++) {
      cards.push(getRandomCard());
    }

    const drawCard = (x: number, y: number, card: string) => {
      context.font = 'bold 48px Arial';
      context.textAlign = 'center';

      // Draw card background
      context.fillStyle = 'white';
      context.fillRect(x, y, cardWidth, cardHeight);

      // Draw card border
      context.lineWidth = borderWidth;
      context.strokeStyle = borderColor;
      context.strokeRect(x, y, cardWidth, cardHeight);

      // Draw card symbol
      context.fillStyle = 'black';
      context.fillText(card, x + cardWidth / 2, y + cardHeight / 2);
    };

    const animate = () => {
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);

      const elapsedTime = Date.now() - startTime;

      if (elapsedTime < 2000) {
        // Speed up the scroll for the first 2 seconds
        scrollSpeed += 0.1;
      } else {
        // Gradually slow down the scroll speed
        if (scrollSpeed > 1) {
          scrollSpeed -= 0.1;
        } else {
          // Stop the scroll when the speed reaches 1
          scrollSpeed = 0;
          scrollOffset = 0;
        }
      }

      scrollOffset += scrollSpeed;

      for (let i = 0; i < numCards; i++) {
        const x = i * (cardWidth + gap) - scrollOffset;
        const y = (canvas.height - cardHeight) / 2;
        const card = cards[i];
        drawCard(x, y, card);
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <canvas ref={canvasRef} width={1200} height={250} />
    </div>
  );
};

export default CardScroll;
