export const fetchSearchResults = async (name) => {
  try {
    // Gọi API với query param "name"
    const response = await fetch(`http://localhost:8123/api/user/search?name=${encodeURIComponent(name)}`);

    if (!response.ok) {
      throw new Error('Có lỗi khi lấy dữ liệu từ API');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm:', error);
    return [];
  }
};
