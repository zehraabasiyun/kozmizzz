import { useState, useRef, useEffect } from 'react';

function ProductFilter({ onApply }) {
  const [showPanel, setShowPanel] = useState(false);
  const [minRating, setMinRating] = useState(null);
  const panelRef = useRef();

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply({ rating: minRating });
    setShowPanel(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(prev => !prev)}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Filtrele
      </button>

      {showPanel && (
        <form
          onSubmit={handleSubmit}
          ref={panelRef}
          className="absolute right-0 mt-2 bg-white shadow-lg rounded p-4 w-64 z-50"
        >
          <h3 className="text-lg font-semibold mb-2">Filtre Seçenekleri</h3>

          {/* Rating Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Minimum Puan</label>
            {[5, 4, 3, 2, 1].map((r) => (
              <div key={r} className="flex items-center">
                <input
                  type="checkbox"
                  id={`rating-${r}`}
                  checked={minRating === r}
                  onChange={() => setMinRating(r === minRating ? null : r)}
                  className="mr-2"
                />
                <label htmlFor={`rating-${r}`} className="text-sm">{r} yıldız ve üzeri</label>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-[#a45c4c] text-white px-4 py-2 rounded hover:bg-[#8b4c3e] w-full"
          >
            Filtrele
          </button>
        </form>
      )}
    </div>
  );
}

export default ProductFilter;
