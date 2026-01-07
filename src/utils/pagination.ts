
export const paginate = (page, limit) => {
  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = parseInt(limit, 10) || 10;

  const skip = (parsedPage - 1) * parsedLimit;
  return { skip, limit };
}

export const constructResponse = (data, totalItems: number, pageSize: number, page) => {
  return {
    data,
    pagination: {
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      currentPage: page || 1,
      pageSize: pageSize
    }
  }
}
