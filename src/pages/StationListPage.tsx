import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStations } from '../hooks/useStations';
import { SearchBar } from '../components/stations/SearchBar';
import { SortControls } from '../components/stations/SortControls';
import { StationList } from '../components/stations/StationList';

export const StationListPage: React.FC = () => {
  const {
    stations,
    selectedStationId,
    setSelectedStationId,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedDistrict,
    setSelectedDistrict,
    availableDistricts,
    sortBy,
    setSortBy,
    totalTamilNaduStations,
  } = useStations();

  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: '960px',
        width: '100%',
        margin: '0 auto',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px 0' }}>
            Tamil Nadu EV Charging Stations
          </h1>
          <p style={{ margin: 0, color: 'var(--secondary-text)' }}>
            Exclusively displaying EV charging stations across all 38 districts of Tamil Nadu
          </p>
        </div>
        <span className="badge badge-green" style={{ fontSize: '13px', padding: '6px 12px' }}>
          {totalTamilNaduStations} Tamil Nadu Stations
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by station name, city, or district (e.g. Chennai, Madurai, Salem)..."
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="list-district-select" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--secondary-text)' }}>
              District:
            </label>
            <select
              id="list-district-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="form-input"
              style={{ padding: '6px 12px', fontSize: '13px', width: 'auto' }}
            >
              <option value="All">All Districts</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <SortControls sortBy={sortBy} onSortChange={setSortBy} />
        </div>
      </div>

      {/* Station List */}
      <StationList
        stations={stations}
        isLoading={isLoading}
        selectedStationId={selectedStationId}
        onSelectStation={(st) => {
          setSelectedStationId(st.id);
          navigate('/map');
        }}
        onViewDetails={(id) => navigate(`/stations/${id}`)}
        onGetRoute={(id) => navigate(`/route/${id}`)}
        onResetSearch={() => {
          setSearchQuery('');
          setSelectedDistrict('All');
        }}
        searchQuery={searchQuery}
        isUsingFallback={false}
      />
    </div>
  );
};
