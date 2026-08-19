import { Modal } from '../ui/Modal';
import { StarDisplay } from './StarDisplay';

export interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApp: any;
}

export function EvaluationModal({ isOpen, onClose, selectedApp }: EvaluationModalProps) {
  if (!selectedApp || !selectedApp.evaluation) return null;

  const evalData = selectedApp.evaluation;
  const overallAvg = (
    (evalData.punctuality_rating +
      evalData.responsibility_rating +
      evalData.grooming_rating +
      evalData.quality_rating) /
    4
  ).toFixed(1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Performance Evaluation Sheet" maxWidth="max-w-xl">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-psu-blue to-blue-800 text-white p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-200">Overall Rating</p>
            <h4 className="text-4xl font-extrabold flex items-center gap-2">
              {overallAvg} <span className="text-xl text-yellow-400">★</span>
            </h4>
          </div>
          <div className="text-right">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest ${
                evalData.result_status === 'PASS' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {evalData.result_status === 'PASS' ? 'PASS' : 'FAIL'}
            </span>
            <p className="text-[10px] text-blue-200 mt-2">
              Evaluated on {new Date(evalData.evaluation_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500 font-bold mb-1">Punctuality</p>
            <StarDisplay value={evalData.punctuality_rating} size="sm" />
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500 font-bold mb-1">Responsibility</p>
            <StarDisplay value={evalData.responsibility_rating} size="sm" />
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500 font-bold mb-1">Grooming</p>
            <StarDisplay value={evalData.grooming_rating} size="sm" />
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500 font-bold mb-1">Work Quality</p>
            <StarDisplay value={evalData.quality_rating} size="sm" />
          </div>
        </div>

        {evalData.comment && (
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <p className="text-xs font-bold text-psu-blue mb-1">Supervisor Comments</p>
            <p className="text-sm text-gray-700 italic">"{evalData.comment}"</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default EvaluationModal;
