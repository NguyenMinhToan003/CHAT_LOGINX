import { useState, useEffect, useRef } from 'react';
import './Comment.css';

const EmojiPicker = ({ onEmojiSelect, inputRef, setCommentText, isOpen: externalIsOpen, onClose, zIndex }) => {
  const [isOpen, setIsOpen] = useState(externalIsOpen || false); // Sử dụng externalIsOpen nếu có
  const [activeCategory, setActiveCategory] = useState('Smileys');
  const pickerRef = useRef(null);

  // Đồng bộ trạng thái isOpen với externalIsOpen
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  // Organized emoji map by categories
  const emojiCategories = {
    Smileys: [
      { emoji: '😊', name: 'Smile', color: '#ffca28', background: '#fff9c4' },
      { emoji: '😀', name: 'Grinning', color: '#ffca28', background: '#fff9c4' },
      { emoji: '😃', name: 'Smiley', color: '#ffca28', background: '#fff9c4' },
      { emoji: '😄', name: 'Smile with Eyes', color: '#ffca28', background: '#fff9c4' },
      { emoji: '😁', name: 'Beaming', color: '#ffca28', background: '#fff9c4' },
      { emoji: '😆', name: 'Laughing', color: '#ffca28', background: '#fff9c4' },
      { emoji: '😅', name: 'Sweat Smile', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🤣', name: 'ROFL', color: '#ffca28', background: '#fff9c4' },
      { emoji: '😂', name: 'Joy', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🙂', name: 'Slightly Smiling', color: '#ffca28', background: '#fff9c4' },
      { emoji: '😉', name: 'Wink', color: '#ffca28', background: '#fff9c4' },
      { emoji: '😍', name: 'Heart Eyes', color: '#f44336', background: '#ffcdd2' },
      { emoji: '🥰', name: 'In Love', color: '#f44336', background: '#ffcdd2' },
      { emoji: '😘', name: 'Kiss', color: '#f44336', background: '#ffcdd2' },
      { emoji: '😚', name: 'Kissing', color: '#f44336', background: '#ffcdd2' },
      { emoji: '😜', name: 'Wink Tongue', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🤪', name: 'Zany', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '😝', name: 'Squinting Tongue', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🤑', name: 'Rich', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '🤗', name: 'Hug', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🤔', name: 'Thinking', color: '#ffeb3b', background: '#fff9c4' },
      { emoji: '🤨', name: 'Raised Eyebrow', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '😐', name: 'Neutral', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '😑', name: 'Expressionless', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '😶', name: 'No Mouth', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '😏', name: 'Smirk', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '😒', name: 'Unamused', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🙄', name: 'Eye Roll', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '😬', name: 'Grimace', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🤥', name: 'Lying', color: '#9e9e9e', background: '#e0e0e0' },
    ],
    Reactions: [
      { emoji: '👍', name: 'Like', color: '#2196f3', background: '#bbdefb' },
      { emoji: '👎', name: 'Dislike', color: '#f44336', background: '#ffcdd2' },
      { emoji: '❤️', name: 'Love', color: '#f44336', background: '#ffcdd2' },
      { emoji: '😂', name: 'Laugh', color: '#ffca28', background: '#fff9c4' },
      { emoji: '😢', name: 'Sad', color: '#2196f3', background: '#bbdefb' },
      { emoji: '😡', name: 'Angry', color: '#f44336', background: '#ffcdd2' },
      { emoji: '🤩', name: 'Starstruck', color: '#ffca28', background: '#fff9c4' },
      { emoji: '😭', name: 'Crying', color: '#2196f3', background: '#bbdefb' },
      { emoji: '😴', name: 'Sleepy', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🫡', name: 'Respect', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '🤬', name: 'Cursing', color: '#f44336', background: '#ffcdd2' },
      { emoji: '👀', name: 'Eyes', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🙌', name: 'Celebrate', color: '#ffca28', background: '#fff9c4' },
      { emoji: '💯', name: 'Hundred', color: '#f44336', background: '#ffcdd2' },
      { emoji: '🥳', name: 'Party', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🤯', name: 'Mind Blown', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🔥', name: 'Fire', color: '#ff5722', background: '#ffccbc' },
      { emoji: '💀', name: 'Dead', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '😵', name: 'Dizzy', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🤡', name: 'Clown', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🥺', name: 'Pleading', color: '#9c27b0', background: '#e1bee7' },
      { emoji: '🤔', name: 'Thinking', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '😱', name: 'Shocked', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🤢', name: 'Nauseated', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '🤮', name: 'Vomiting', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '😍', name: 'Heart Eyes', color: '#f44336', background: '#ffcdd2' },
      { emoji: '🤗', name: 'Hug', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🙄', name: 'Eye Roll', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '😎', name: 'Cool', color: '#2196f3', background: '#bbdefb' },
      { emoji: '👏', name: 'Clap', color: '#ffca28', background: '#fff9c4' },
    ],
    Animals: [
      { emoji: '🐱', name: 'Cat', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '🐶', name: 'Dog', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '🐭', name: 'Mouse', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🐹', name: 'Hamster', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🐰', name: 'Rabbit', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🦊', name: 'Fox', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🐻', name: 'Bear', color: '#795548', background: '#d7ccc8' },
      { emoji: '🐼', name: 'Panda', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🐨', name: 'Koala', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🐯', name: 'Tiger', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🦁', name: 'Lion', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🐮', name: 'Cow', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🐷', name: 'Pig', color: '#ffcdd2', background: '#ffcdd2' },
      { emoji: '🐸', name: 'Frog', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '🐵', name: 'Monkey', color: '#795548', background: '#d7ccc8' },
      { emoji: '🐔', name: 'Chicken', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🐧', name: 'Penguin', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🐦', name: 'Bird', color: '#2196f3', background: '#bbdefb' },
      { emoji: '🦅', name: 'Eagle', color: '#795548', background: '#d7ccc8' },
      { emoji: '🦆', name: 'Duck', color: '#2196f3', background: '#bbdefb' },
      { emoji: '🦉', name: 'Owl', color: '#795548', background: '#d7ccc8' },
      { emoji: '🦄', name: 'Unicorn', color: '#9c27b0', background: '#e1bee7' },
      { emoji: '🐝', name: 'Bee', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🦋', name: 'Butterfly', color: '#2196f3', background: '#bbdefb' },
      { emoji: '🐢', name: 'Turtle', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '🐬', name: 'Dolphin', color: '#2196f3', background: '#bbdefb' },
      { emoji: '🦒', name: 'Giraffe', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🐘', name: 'Elephant', color: '#9e9e9e', background: '#e0e0e0' },
    ],
    Food: [
      { emoji: '🍕', name: 'Pizza', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍔', name: 'Burger', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍟', name: 'Fries', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🌭', name: 'Hot Dog', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍿', name: 'Popcorn', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍩', name: 'Donut', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍦', name: 'Ice Cream', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🍰', name: 'Cake', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🧁', name: 'Cupcake', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍫', name: 'Chocolate', color: '#795548', background: '#d7ccc8' },
      { emoji: '🍬', name: 'Candy', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍎', name: 'Apple', color: '#f44336', background: '#ffcdd2' },
      { emoji: '🍌', name: 'Banana', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🍓', name: 'Strawberry', color: '#f44336', background: '#ffcdd2' },
      { emoji: '🍉', name: 'Watermelon', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '🍇', name: 'Grapes', color: '#9c27b0', background: '#e1bee7' },
      { emoji: '☕', name: 'Coffee', color: '#795548', background: '#d7ccc8' },
      { emoji: '🍺', name: 'Beer', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍷', name: 'Wine', color: '#9c27b0', background: '#e1bee7' },
      { emoji: '🍹', name: 'Cocktail', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍗', name: 'Chicken Leg', color: '#795548', background: '#d7ccc8' },
      { emoji: '🍝', name: 'Spaghetti', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍣', name: 'Sushi', color: '#f44336', background: '#ffcdd2' },
      { emoji: '🥗', name: 'Salad', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '🌮', name: 'Taco', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🌯', name: 'Burrito', color: '#795548', background: '#d7ccc8' },
      { emoji: '🍜', name: 'Ramen', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🥨', name: 'Pretzel', color: '#795548', background: '#d7ccc8' },
      { emoji: '🥐', name: 'Croissant', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍤', name: 'Shrimp', color: '#ff9800', background: '#ffe0b2' },
    ],
    Objects: [
      { emoji: '🎁', name: 'Gift', color: '#f44336', background: '#ffcdd2' },
      { emoji: '💼', name: 'Briefcase', color: '#795548', background: '#d7ccc8' },
      { emoji: '📱', name: 'Phone', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '💻', name: 'Laptop', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '⌚', name: 'Watch', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '📷', name: 'Camera', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🎮', name: 'Game', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🔍', name: 'Search', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '💡', name: 'Bulb', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🔑', name: 'Key', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🏠', name: 'House', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🚗', name: 'Car', color: '#f44336', background: '#ffcdd2' },
      { emoji: '✈️', name: 'Plane', color: '#2196f3', background: '#bbdefb' },
      { emoji: '🚀', name: 'Rocket', color: '#2196f3', background: '#bbdefb' },
      { emoji: '⚽', name: 'Soccer', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '🏀', name: 'Basketball', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🎵', name: 'Music', color: '#9c27b0', background: '#e1bee7' },
      { emoji: '🎨', name: 'Art', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '💰', name: 'Money', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '💎', name: 'Diamond', color: '#2196f3', background: '#bbdefb' },
      { emoji: '🍗', name: 'Chicken Leg', color: '#795548', background: '#d7ccc8' },
      { emoji: '🍝', name: 'Spaghetti', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍣', name: 'Sushi', color: '#f44336', background: '#ffcdd2' },
      { emoji: '🥗', name: 'Salad', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '🌮', name: 'Taco', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🌯', name: 'Burrito', color: '#795548', background: '#d7ccc8' },
      { emoji: '🍜', name: 'Ramen', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🥨', name: 'Pretzel', color: '#795548', background: '#d7ccc8' },
      { emoji: '🥐', name: 'Croissant', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🍤', name: 'Shrimp', color: '#ff9800', background: '#ffe0b2' },
    ],
    Symbols: [
      { emoji: '❤️', name: 'Heart', color: '#f44336', background: '#ffcdd2' },
      { emoji: '💔', name: 'Broken Heart', color: '#f44336', background: '#ffcdd2' },
      { emoji: '💕', name: 'Two Hearts', color: '#f44336', background: '#ffcdd2' },
      { emoji: '💖', name: 'Sparkling Heart', color: '#f44336', background: '#ffcdd2' },
      { emoji: '💙', name: 'Blue Heart', color: '#2196f3', background: '#bbdefb' },
      { emoji: '💚', name: 'Green Heart', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '💛', name: 'Yellow Heart', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🧡', name: 'Orange Heart', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '💜', name: 'Purple Heart', color: '#9c27b0', background: '#e1bee7' },
      { emoji: '🖤', name: 'Black Heart', color: '#9e9e9e', background: '#e0e0e0' },
      { emoji: '✨', name: 'Sparkles', color: '#ffeb3b', background: '#fff9c4' },
      { emoji: '⭐', name: 'Star', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🌟', name: 'Glowing Star', color: '#ffca28', background: '#fff9c4' },
      { emoji: '💫', name: 'Dizzy Star', color: '#ffca28', background: '#fff9c4' },
      { emoji: '👑', name: 'Crown', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🏆', name: 'Trophy', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🎯', name: 'Direct Hit', color: '#f44336', background: '#ffcdd2' },
      { emoji: '🔴', name: 'Red Circle', color: '#f44336', background: '#ffcdd2' },
      { emoji: '🟢', name: 'Green Circle', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '🔵', name: 'Blue Circle', color: '#2196f3', background: '#bbdefb' },
      { emoji: '🔶', name: 'Orange Diamond', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '🔷', name: 'Blue Diamond', color: '#2196f3', background: '#bbdefb' },
      { emoji: '♨️', name: 'Hot Springs', color: '#f44336', background: '#ffcdd2' },
      { emoji: '♻️', name: 'Recycle', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '⚠️', name: 'Warning', color: '#ff9800', background: '#ffe0b2' },
      { emoji: '⚜️', name: 'Fleur-de-lis', color: '#ffca28', background: '#fff9c4' },
      { emoji: '🔱', name: 'Trident', color: '#ffca28', background: '#fff9c4' },
      { emoji: '📛', name: 'Name Badge', color: '#f44336', background: '#ffcdd2' },
      { emoji: '🔰', name: 'Japanese Symbol', color: '#4caf50', background: '#c8e6c9' },
      { emoji: '☯️', name: 'Yin Yang', color: '#9e9e9e', background: '#e0e0e0' },
    ],
    Recent: [],
  };

  const [recentEmojis, setRecentEmojis] = useState(
    JSON.parse(localStorage.getItem('recentEmojis')) || []
  );

  // Update Recent category with stored emojis
  useEffect(() => {
    emojiCategories.Recent = recentEmojis.map((emoji) => {
      // Find the original emoji data from any category
      for (const category in emojiCategories) {
        const found = emojiCategories[category].find((item) => item.emoji === emoji);
        if (found) return found;
      }
      // Default if not found
      return { emoji, name: 'Recent', color: '#9e9e9e', background: '#e0e0e0' };
    });
  }, [recentEmojis]);

  // Handle clicks outside of the picker to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        if (onClose) {
          onClose(); // Gọi onClose từ prop nếu có
        } else {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const addToRecent = (emoji) => {
    const updatedRecents = [emoji];

    // Add other recent emojis, avoiding duplicates
    recentEmojis.forEach((item) => {
      if (item !== emoji && updatedRecents.length < 20) {
        updatedRecents.push(item);
      }
    });

    setRecentEmojis(updatedRecents);
    localStorage.setItem('recentEmojis', JSON.stringify(updatedRecents));
  };

    

  const handleEmojiClick = (emoji) => {
    // Add to recent emojis
    addToRecent(emoji);
    

    if (inputRef && inputRef.current) {
      const input = inputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const value = input.value;

      const newValue = value.substring(0, start) + emoji + value.substring(end);
      setCommentText(newValue);

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else if (onEmojiSelect) {
      onEmojiSelect(emoji);
    }

    // Optionally close the picker after selecting
    // if (onClose) onClose();
  };

  const togglePicker = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const [searchTerm, setSearchTerm] = useState('');

  // Filter emojis based on search term
  const getFilteredEmojis = () => {
    if (!searchTerm) {
      return emojiCategories[activeCategory] || [];
    }

    const term = searchTerm.toLowerCase();

    // Search across all categories
    const results = [];
    for (const category in emojiCategories) {
      const matches = emojiCategories[category].filter((item) =>
        item.name.toLowerCase().includes(term)
      );
      results.push(...matches);
    }

    // Remove duplicates by emoji
    const uniqueResults = [];
    const seen = new Set();
    for (const item of results) {
      if (!seen.has(item.emoji)) {
        seen.add(item.emoji);
        uniqueResults.push(item);
      }
    }

    return uniqueResults;
  };

  return (
    <div className="emoji-picker-container">
      {/* Chỉ hiển thị nút toggle nếu không sử dụng externalIsOpen */}
      {!externalIsOpen && (
        <button type="button" className="emoji-button" onClick={togglePicker}>
          <i className="far fa-smile"></i>
        </button>
      )}

      {isOpen && (
        <div
          className="emoji-picker"
          ref={pickerRef}
          style={{ zIndex: zIndex || 1500 }}
        >
          {/* Nội dung bảng emoji */}
          <div className="emoji-categories">
            {Object.keys(emojiCategories).map((category) => (
              <span
                key={category}
                className={`emoji-category ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </span>
            ))}
          </div>

          <div className="emoji-search">
            <input
              type="text"
              placeholder="Tìm kiếm emoji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="emoji-list">
            {getFilteredEmojis().map((item, index) => (
              <div
                key={index}
                className="emoji-item"
                onClick={() => handleEmojiClick(item.emoji)}
                style={{
                  backgroundColor: item.background,
                  color: item.color,
                }}
                title={item.name}
              >
                {item.emoji}
              </div>
            ))}
            {getFilteredEmojis().length === 0 && (
              <div className="no-results">No emojis found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;