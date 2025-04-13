import { useState } from 'react';
import { fetchSearchResults } from '~/api/SearchPageAPI';
import './SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const data = await fetchSearchResults(searchTerm);
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <h2 className="title">Tìm kiếm người dùng</h2>

      <div className="search-box">
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tên người dùng"
        />
        <button className="search-button" onClick={handleSearch} disabled={loading}>
          {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
        </button>
      </div>

      <div className="results-container">
        {results.length > 0 ? (
          results.map((user) => (
            <a
              href={`/profile/${user._id || user.id}`}
              className="user-card-link"
              key={user._id || user.id}
            >
              <div className="user-card">
                <img
                  src={user.picture?.url || "https://thuvienmeme.com/wp-content/uploads/2023/09/doi-cho-sach-jack-cho-thom-350x250.jpg"}
                  alt={user.name}
                  className="user-avatar"
                />
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                </div>
              </div>
            </a>
          ))
        ) : (
          <p className="no-results">Không tìm thấy kết quả.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
