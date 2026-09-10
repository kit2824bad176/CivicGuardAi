export const CASE_STATUSES = [
  "Pending Review", 
  "Forwarded to Police", 
  "Assigned Officer", 
  "Investigation in Progress", 
  "Resolved"
];

export default function CaseTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = CASE_STATUSES.indexOf(currentStatus);

  return (
    <div className="py-6 my-8 w-full">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -mt-1 w-full h-2 bg-slate-200 rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -mt-1 h-2 bg-indigo-600 rounded-full z-0 transition-all duration-500 ease-in-out" 
          style={{ width: `${currentIndex === -1 ? 0 : (currentIndex / (CASE_STATUSES.length - 1)) * 100}%` }}
        ></div>
        {CASE_STATUSES.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={status} className="relative z-10 flex flex-col items-center flex-1">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${isCompleted ? 'bg-indigo-600 border-indigo-200' : 'bg-white border-slate-300'} transition-colors duration-300 shadow-sm`}
              >
                {isCompleted && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className={`mt-3 text-[10px] sm:text-xs font-bold ${isCurrent ? 'text-indigo-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'} max-w-[80px] text-center uppercase tracking-wide`}>
                {status}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
