import { useState, useEffect } from "react";
import { AvatarModel } from "./AvatarModel";
import { SimpleAvatar } from "./SimpleAvatar";
import { Canvas } from '@react-three/fiber';
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';


interface RecoveryPalProps {
  adherenceLevel: number; // 0-100
  streak: number;
  className?: string;
  missedDose?: boolean;
  gender?: 'male' | 'female';
}

export const RecoveryPal = ({ adherenceLevel, streak, className = "", missedDose = false, gender = 'male' }: RecoveryPalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const getHealthMessage = () => {
    if (adherenceLevel >= 90) return "I'm feeling fantastic! 🌟";
    if (adherenceLevel >= 70) return "Getting better every day! 💪";
    if (adherenceLevel >= 50) return "On my way to recovery! 🌱";
    if (adherenceLevel >= 30) return "Making progress! 🌤️";
    return "Let's start this healing journey together! 💙";
  };

  const getAvatarFilter = () => {
    if (adherenceLevel >= 90) return "brightness(1.2) saturate(1.3) contrast(1.1)";
    if (adherenceLevel >= 70) return "brightness(1.1) saturate(1.2)";
    if (adherenceLevel >= 50) return "brightness(1.05) saturate(1.1)";
    if (adherenceLevel >= 30) return "brightness(0.95) saturate(0.9)";
    return "brightness(0.8) saturate(0.7) contrast(0.9)";
  };

  // Motivational message/health tip logic
  const getMotivationalMessage = () => {
    if (adherenceLevel >= 90) return "Amazing consistency! Keep it up for a speedy recovery.";
    if (adherenceLevel >= 70) return "You're doing well! Try not to miss any doses for best results.";
    if (adherenceLevel >= 50) return "Good effort! A little more consistency will help a lot.";
    if (adherenceLevel >= 30) return "Don't give up! Every dose counts toward your health.";
    return "Let's build a healthy habit together. Start today!";
  };

  return (
    <div className={`text-center space-y-4 ${className}`}>
      <div className="relative">
        <div
          className={`relative mx-auto w-32 h-32 rounded-full bg-recovery-gradient p-4 shadow-healing transition-all duration-500 ${
            isAnimating ? "animate-shake" : ""
          }`}
        >
          {/* 3D AvatarModel with adherence-based expressions and error boundary */}
          <div style={{ width: 200, height: 300, margin: '0 auto' }}>
            <ErrorBoundary fallback={<div className="text-red-500 text-sm">3D avatar failed to load.<br/>Please check your internet connection or try again later.</div>}>
              <ErrorBoundary fallback={<SimpleAvatar adherenceLevel={adherenceLevel} />}>
                <React.Suspense fallback={<SimpleAvatar adherenceLevel={adherenceLevel} />}>
                  <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 5, 5]} intensity={0.7} />
                    <AvatarModel adherenceLevel={adherenceLevel} />
                  </Canvas>
                </React.Suspense>
              </ErrorBoundary>
            </ErrorBoundary>
          </div>

        </div>
        {/* Health glow effect */}
        <div 
          className="absolute inset-0 rounded-full bg-healing-gradient opacity-20 blur-xl transition-opacity duration-500"
          style={{ opacity: Math.max(0.1, adherenceLevel / 500) }}
        />
      </div>

      <div className="space-y-2">
        <p className="text-lg font-medium text-foreground">{getHealthMessage()}</p>
        <p className="text-sm text-muted-foreground italic">{getMotivationalMessage()}</p>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{adherenceLevel}%</div>
            <div className="text-sm text-muted-foreground">Health Score</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>  
        </div>
        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-healing-gradient transition-all duration-1000 ease-out"
              style={{ width: `${adherenceLevel}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};