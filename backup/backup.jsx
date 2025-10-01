<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
	<div className="bg-white p-6 rounded-xl overflow-auto">
		<h3 className="text-xl font-bold mb-2">Internship</h3>
		<p className="text-gray-500 mb-6">Manage Internship</p>

		{loading ? (
			<p className="text-center text-gray-500">Loading users...</p>
		) : interns.length === 0 ? (
			<p className="text-center text-gray-500">No internship users found.</p>
		) : (
			<>
				<table className="w-full text-sm text-left">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50">
						<tr>
							<th className="py-3 px-6">NAME</th>
							<th className="py-3 px-6">EMAIL</th>
							<th className="py-3 px-6">ROLE</th>
							<th className="py-3 px-6">CREATED AT</th>
							<th className="py-3 px-6">ACTION</th>
						</tr>
					</thead>
					<tbody>
						{currentItems.map((user) => (
							<tr key={user.id} className="border-b border-gray-200">
								<td className="px-6 py-4 font-bold text-gray-800 hover:text-blue-600">
									<Link to={`/internship/${user.id}`}>{user.name}</Link>
								</td>
								<td className="px-6 py-4 font-bold text-gray-800">
									{user.email}
								</td>
								<td className="px-6 py-4 font-bold text-gray-800">
									{user.role}
								</td>
								<td className="px-6 py-4 font-bold text-gray-800">
									{new Date(user.created_at).toLocaleDateString() || "-"}
								</td>
								<td className="px-6 py-4">
									<Link
										to={`/internship/${user.id}`}
										className="text-gray-500 hover:text-blue-500 flex items-center gap-2 font-semibold text-sm"
									>
										<FaEye /> View Intern
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{totalPages > 1 && (
					<div className="flex justify-end items-center mt-4">
						<button
							onClick={() => paginate(currentPage - 1)}
							disabled={currentPage === 1}
							className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
						>
							Previous
						</button>
						<span className="text-sm text-gray-700 mx-4">
							Page {currentPage} of {totalPages}
						</span>
						<button
							onClick={() => paginate(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
						>
							Next
						</button>
					</div>
				)}
			</>
		)}
	</div>
</main>;
