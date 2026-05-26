"use client";

interface StepProgressProps {
  currentStep: number;
  steps: string[];
}

export default function StepProgress({ currentStep, steps }: StepProgressProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#4caf50] text-white"
                    : isActive
                    ? "bg-gradient-to-br from-[#c8a45c] to-[#d4a843] text-white shadow-lg shadow-[#c8a45c]/20"
                    : "bg-[#252525] text-[#555] border border-[#3a3a3a]"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`mt-1 text-[9px] sm:text-[10px] font-medium text-center leading-tight ${
                  isActive ? "text-[#c8a45c]" : isCompleted ? "text-[#4caf50]" : "text-[#555]"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="flex-1 mx-1.5 sm:mx-2 mt-[-14px]">
                <div className="h-[2px] rounded-full bg-[#252525] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: isCompleted ? "100%" : "0%",
                      background: "linear-gradient(90deg, #4caf50, #c8a45c)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
