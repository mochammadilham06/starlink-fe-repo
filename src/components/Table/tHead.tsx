const TableHead = () => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-4 font-medium text-gray-900">
          No
        </th>
        <th scope="col" className="px-6 py-4 font-medium text-gray-900">
          Package name
        </th>
        <th scope="col" className="px-6 py-4 font-medium text-gray-900">
          Artist Name
        </th>
        <th scope="col" className="px-6 py-4 font-medium text-gray-900">
          Date Release
        </th>
        <th scope="col" className="px-6 py-4 font-medium text-gray-900">
          Audio
        </th>
        <th scope="col" className="px-6 py-4 font-medium text-gray-900">
          Price
        </th>
        <th scope="col" className="px-6 py-4 font-medium text-gray-900" />
      </tr>
    </thead>
  );
};

export default TableHead;
