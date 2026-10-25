import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStations } from '../hooks/useStations';
import { useRoute } from '../hooks/useRoute';
import { MapView } from '../components/map/MapView';
import { SearchBar } from '../components/stations/SearchBar';
import { SortControls } from '../components/stations/SortControls';
import { StationList } from '../components/stations/StationList';
import { StationDetails } from '../components/stations/StationDetails';
import { Station } from '../types/station';
import { formatDistance, formatDuration } from '../utils/distance';

export const MapPage: React.FC = () => {
  const {
    stations,
    selectedStation,
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

  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');
  const navigate = useNavigate();

  // Real-time road route to the selected station from user's current GPS location
  const { route, isLoading: isRouteLoading } = useRoute(selectedStation);

  const handleSelectStation = (station: Station) => {
    setSelectedStationId(station.id);
  };

  const handleViewDetails = (stationId: string) => {
    navigate(`/stations/${stationId}`);
  };

  const handleGetRoute = (stationId: string) => {
    navigate(`/route/${stationId}`);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 60px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Mobile Tab Switcher */}
      <div
        className="hide-on-desktop"
        style={{
          display: 'flex',
          backgroundColor: 'var(--white-surface)',
          borderBottom: '1px solid var(--border-color)',
          padding: '8px 16px',
          gap: '8px',
          zIndex: 50,
        }}
      >
        <button
          onClick={() => setMobileTab('map')}
          className={`btn btn-sm ${mobileTab === 'map' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          Map View
        </button>
        <button
          onClick={() => setMobileTab('list')}
          className={`btn btn-sm ${mobileTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
          </svg>
          Stations ({stations.length})
        </button>
      </div>

      {/* Main Split Layout: Sidebar + Map */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Left Side Panel */}
        <aside
          style={{
            width: '430px',
            maxWidth: '100%',
            height: '100%',
            backgroundColor: 'var(--white-surface)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
            overflowY: 'auto',
          }}
          className={mobileTab === 'map' ? 'hide-on-mobile' : ''}
        >
          {/* Header with Search, District selector, and Sort */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: 'var(--white-surface)',
              position: 'sticky',
              top: 0,
              zIndex: 5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-green)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                EV Network
              </span>
              <span className="badge badge-green" style={{ fontSize: '11px' }}>
                {totalTamilNaduStations} Stations
              </span>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search station or district (e.g. Chennai, Salem)..."
            />

            {/* District Filter Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="district-select" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--secondary-text)', whiteSpace: 'nowrap' }}>
                District:
              </label>
              <select
                id="district-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="form-input"
                style={{ padding: '6px 10px', fontSize: '13px', borderRadius: 'var(--radius-sm)' }}
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

            {/* Live Route Status Bar when a station is selected */}
            {selectedStation && (
              <div
                style={{
                  backgroundColor: '#E6F4EA',
                  border: '1px solid #CEEAD6',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🚗</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--dark-green)' }}>
                      Active Route to {selectedStation.name.split('-')[0]}
                    </div>
                    <div style={{ fontSize: '11px', color: '#137333' }}>
                      {isRouteLoading ? (
                        'Calculating route...'
                      ) : route ? (
                        `${formatDistance(route.distanceKm)} • ${formatDuration(route.durationMinutes)} road drive`
                      ) : (
                        'Route shown on map'
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStationId(null)}
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '2px 8px', fontSize: '11px', height: '26px' }}
                >
                  Clear Route
                </button>
              </div>
            )}
          </div>

          {/* List or Selected Details Panel */}
          <div style={{ padding: '16px', flex: 1 }}>
            {selectedStation ? (
              <StationDetails
                station={selectedStation}
                onBack={() => setSelectedStationId(null)}
                onViewOnMap={() => setMobileTab('map')}
                onGetRoute={() => handleGetRoute(selectedStation.id)}
              />
            ) : (
              <StationList
                stations={stations}
                isLoading={isLoading}
                selectedStationId={selectedStationId}
                onSelectStation={handleSelectStation}
                onViewDetails={handleViewDetails}
                onGetRoute={handleGetRoute}
                onResetSearch={() => {
                  setSearchQuery('');
                  setSelectedDistrict('All');
                }}
                searchQuery={searchQuery}
                isUsingFallback={false}
              />
            )}
          </div>
        </aside>

        {/* Right Side Map */}
        <main
          style={{
            flex: 1,
            height: '100%',
            position: 'relative',
          }}
          className={mobileTab === 'list' ? 'hide-on-mobile' : ''}
        >
          <MapView
            stations={stations}
            selectedStation={selectedStation}
            onSelectStation={handleSelectStation}
            onGetRoute={handleGetRoute}
            route={route}
          />

          {/* Floating Selected Station Preview & Route details on Mobile Map View */}
          {selectedStation && mobileTab === 'map' && (
            <div
              className="hide-on-desktop"
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                zIndex: 450,
              }}
            >
              <div
                className="card"
                style={{
                  padding: '14px',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '15px' }}>
                    {selectedStation.name}
                  </h4>
                  <div style={{ fontSize: '13px', color: 'var(--primary-green)', fontWeight: 700 }}>
                    ₹{selectedStation.price.toFixed(1)}/kWh • {selectedStation.availableChargers}/{selectedStation.totalChargers} Available
                  </div>
                  {route && (
                    <div style={{ fontSize: '12px', color: 'var(--secondary-text)', marginTop: '2px' }}>
                      🚗 {formatDistance(route.distanceKm)} ({formatDuration(route.durationMinutes)})
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleGetRoute(selectedStation.id)}
                  className="btn btn-sm btn-primary"
                >
                  Navigate
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
