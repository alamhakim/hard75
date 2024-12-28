function Dashboard({ onBack }) {
    const [historicalData] = React.useState(() => 
        loadFromLocalStorage('historicalData', {})
    );

    const calculateStats = () => {
        try {
            const sortedDates = Object.entries(historicalData)
                .sort((a, b) => new Date(a[0]) - new Date(b[0]));

            const totalDays = sortedDates.length;
            const winDays = sortedDates.filter(([, day]) => 
                day.tasks.every(task => task.completed)
            ).length;

            // Calculate current and longest streaks
            let currentStreak = 0;
            let longestStreak = 0;
            let tempStreak = 0;

            // Calculate streaks
            for (let i = sortedDates.length - 1; i >= 0; i--) {
                const [date, data] = sortedDates[i];
                const isWin = data.tasks.every(task => task.completed);
                
                if (isWin) {
                    tempStreak++;
                    if (i === sortedDates.length - 1) {
                        currentStreak = tempStreak;
                    }
                } else {
                    if (tempStreak > longestStreak) {
                        longestStreak = tempStreak;
                    }
                    tempStreak = 0;
                    if (i === sortedDates.length - 1) {
                        currentStreak = 0;
                    }
                }
            }
            
            // Check one last time for longest streak
            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
            }

            const totalTasks = sortedDates.reduce((acc, [, day]) => 
                acc + day.tasks.filter(task => task.completed).length, 0
            );

            const last30Days = sortedDates.slice(-30);
            const last30DaysWins = last30Days.filter(([, day]) => 
                day.tasks.every(task => task.completed)
            ).length;

            return {
                totalDays,
                winDays,
                winRate: totalDays ? ((winDays / totalDays) * 100).toFixed(1) : 0,
                totalTasks,
                currentStreak,
                longestStreak,
                last30DaysRate: last30Days.length ? ((last30DaysWins / last30Days.length) * 100).toFixed(1) : 0
            };
        } catch (error) {
            reportError(error);
            return { 
                totalDays: 0, 
                winDays: 0, 
                winRate: 0, 
                totalTasks: 0,
                currentStreak: 0,
                longestStreak: 0,
                last30DaysRate: 0
            };
        }
    };

    React.useEffect(() => {
        try {
            const stats = calculateStats();
            const weeklyCtx = document.getElementById('weeklyProgress').getContext('2d');
            const monthlyCtx = document.getElementById('monthlyProgress').getContext('2d');
            
            // Get last 7 days data
            const lastSevenDays = Object.entries(historicalData)
                .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                .slice(0, 7)
                .reverse();

            // Weekly progress chart
            new Chart(weeklyCtx, {
                type: 'line',
                data: {
                    labels: lastSevenDays.map(([date]) => 
                        new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
                    ),
                    datasets: [{
                        label: 'Tasks Completed',
                        data: lastSevenDays.map(([, data]) => 
                            data.tasks.filter(t => t.completed).length
                        ),
                        borderColor: '#8B5CF6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#fff'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#fff'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#fff'
                            }
                        }
                    }
                }
            });

            // Monthly completion rate chart
            const last30Days = Object.entries(historicalData)
                .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                .slice(0, 30)
                .reverse();

            new Chart(monthlyCtx, {
                type: 'bar',
                data: {
                    labels: last30Days.map(([date]) => 
                        new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                    ),
                    datasets: [{
                        label: 'Completion Rate',
                        data: last30Days.map(([, data]) => 
                            (data.tasks.filter(t => t.completed).length / data.tasks.length) * 100
                        ),
                        backgroundColor: '#10B981',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#fff',
                                callback: value => `${value}%`
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#fff',
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#fff'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            reportError(error);
        }
    }, [historicalData]);

    const stats = calculateStats();

    return (
        <div data-name="dashboard" className="min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <button
                    data-name="back-button"
                    onClick={onBack}
                    className="mb-6 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    ← Back to Tasks
                </button>
                
                <h1 data-name="dashboard-title" className="text-3xl font-bold mb-8 text-center">Progress Dashboard</h1>
                
                <div data-name="stats-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 mb-2">Current Streak</h3>
                        <p className="text-3xl font-bold text-green-500">{stats.currentStreak} days</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 mb-2">Longest Streak</h3>
                        <p className="text-3xl font-bold text-purple-500">{stats.longestStreak} days</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 mb-2">Win Rate</h3>
                        <p className="text-3xl font-bold text-blue-500">{stats.winRate}%</p>
                        <p className="text-sm text-gray-400">Last 30 days: {stats.last30DaysRate}%</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 mb-2">Total Wins</h3>
                        <p className="text-3xl font-bold text-yellow-500">{stats.winDays}/{stats.totalDays}</p>
                    </div>
                </div>

                <div data-name="charts" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Weekly Tasks Progress</h3>
                        <canvas id="weeklyProgress"></canvas>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Monthly Completion Rate</h3>
                        <canvas id="monthlyProgress"></canvas>
                    </div>
                </div>
                
                <div data-name="history-table" className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Recent History</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-700">
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Tasks Completed</th>
                                    <th className="pb-3">Completion Rate</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(historicalData)
                                    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                                    .slice(0, 10)
                                    .map(([date, data]) => {
                                        const completedTasks = data.tasks.filter(t => t.completed).length;
                                        const completionRate = ((completedTasks / data.tasks.length) * 100).toFixed(1);
                                        return (
                                            <tr key={date} className="border-b border-gray-700">
                                                <td className="py-3">
                                                    {new Date(date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="py-3">
                                                    {completedTasks}/{data.tasks.length}
                                                </td>
                                                <td className="py-3">
                                                    {completionRate}%
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                                        data.tasks.every(t => t.completed)
                                                            ? 'bg-green-500/20 text-green-500'
                                                            : 'bg-red-500/20 text-red-500'
                                                    }`}>
                                                        {data.tasks.every(t => t.completed) ? 'WIN' : 'LOSS'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
