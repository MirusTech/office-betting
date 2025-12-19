import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <p>
            <strong>Disclaimer:</strong> This application uses virtual play money only. No real money
            is wagered or paid out. For entertainment purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
