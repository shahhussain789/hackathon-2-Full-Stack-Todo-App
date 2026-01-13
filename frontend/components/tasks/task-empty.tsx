export function TaskEmpty() {
  return (
    <div className="text-center py-16 px-4">
      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks yet</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">
        Your task list is empty. Add your first task above and start getting things done!
      </p>
      <div className="flex items-center justify-center space-x-2 text-sm text-indigo-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span>Type in the box above to add a task</span>
      </div>
    </div>
  );
}
