import { WorkSchedule } from '../../types/job';

export interface JobScheduleTableProps {
  schedules?: WorkSchedule[];
}

export function JobScheduleTable({ schedules }: JobScheduleTableProps) {
  if (!schedules || schedules.length === 0) {
    return <p className="text-sm text-gray-500 italic">No specific work schedule listed.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500 tracking-wider">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Start Time</th>
            <th className="px-4 py-3">End Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {schedules.map((item, idx) => (
            <tr key={item.id || idx} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 font-semibold text-gray-800">{item.date}</td>
              <td className="px-4 py-3 text-psu-blue font-medium">{item.start_time}</td>
              <td className="px-4 py-3 text-psu-blue font-medium">{item.end_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobScheduleTable;
