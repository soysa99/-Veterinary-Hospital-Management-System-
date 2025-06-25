import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

const RecentAppointments = () => {
    const appointments = [
        {
            id: 1,
            petName: 'Max (Dog)',
            service: 'Annual Checkup',
            date: '2023-06-15',
            time: '10:00 AM',
            status: 'Confirmed',
        },
        {
            id: 2,
            petName: 'Luna (Cat)',
            service: 'Vaccination',
            date: '2023-06-16',
            time: '02:30 PM',
            status: 'Pending',
        },
        {
            id: 3,
            petName: 'Buddy (Dog)',
            service: 'Dental Cleaning',
            date: '2023-06-17',
            time: '11:15 AM',
            status: 'Completed',
        },
    ];

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Appointments</h2>
            <div className="space-y-4">
                {appointments.map((appointment) => (
                    <div key={appointment.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{appointment.petName}</h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                    appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                                }`}>
                                {appointment.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{appointment.service}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FiCalendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span>{appointment.date}</span>
                            <FiClock className="ml-3 mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span>{appointment.time}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <a
                    href="#"
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    View all
                </a>
            </div>
        </div>
    );
};

export default RecentAppointments;