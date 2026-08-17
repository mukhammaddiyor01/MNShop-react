import { useEffect, useRef } from "react";
import "../../../css/animation.css";

type Particle = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
};

export function AuthWelcomeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canvas || !context) return undefined;

    const particles: Particle[] = Array.from({ length: 110 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 25 + Math.pow(Math.random(), 1.9) * 74,
      speed: 0.002 + Math.random() * 0.009,
      size: 0.35 + Math.random() * 1.35,
      alpha: 0.18 + Math.random() * 0.72,
    }));
    let frameId = 0;

    const draw = (time = 0) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const coreRadius = Math.min(width, height) * 0.14;
      const glow = context.createRadialGradient(centerX, centerY, coreRadius * 0.3, centerX, centerY, width * 0.45);
      glow.addColorStop(0, "rgba(0, 0, 0, 1)");
      glow.addColorStop(0.23, "rgba(6, 22, 52, 0.94)");
      glow.addColorStop(0.48, "rgba(59, 130, 246, 0.22)");
      glow.addColorStop(1, "rgba(59, 130, 246, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      particles.forEach((particle) => {
        const phase = particle.angle + time * particle.speed;
        const compression = 0.42 + Math.sin(phase * 2.1) * 0.07;
        const x = centerX + Math.cos(phase) * particle.radius;
        const y = centerY + Math.sin(phase) * particle.radius * compression;
        const nextX = centerX + Math.cos(phase + 0.17) * particle.radius;
        const nextY = centerY + Math.sin(phase + 0.17) * particle.radius * compression;

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(nextX, nextY);
        context.lineWidth = particle.size;
        context.strokeStyle = `rgba(147, 197, 253, ${particle.alpha})`;
        context.stroke();
      });

      context.beginPath();
      context.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      context.fillStyle = "#010103";
      context.fill();

      if (!reduceMotion) frameId = window.requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div aria-hidden="true" className="mnshop-auth-singularity">
      <canvas ref={canvasRef} />
    </div>
  );
}
