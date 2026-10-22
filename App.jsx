import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { cities, getWeatherInfo } from './data';

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  
  // Các trạng thái (YC4)
  const [status, setStatus] = useState('UNSELECTED'); // UNSELECTED, LOADING, SUCCESS, ERROR
  
  // YC5: Trạng thái hiển thị độ C hoặc độ F
  const [unit, setUnit] = useState('C'); 

  // Hàm Fetch Data
  const fetchWeather = useCallback(async (city) => {
    setStatus('LOADING');
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FHo_Chi_Minh&forecast_days=7`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Call API thất bại');
      
      const data = await response.json();
      setWeatherData(data);
      setStatus('SUCCESS');
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  }, []);

  // Xử lý khi click vào thành phố
  const handleCityClick = (city) => {
    if (selectedCity?.name === city.name) return; // Không gọi lại nếu click lại chính nó
    setSelectedCity(city);
    fetchWeather(city);
  };

  // YC5: Hàm format nhiệt độ không gọi lại API
  const formatTemp = (celsius) => {
    if (unit === 'C') return `${Math.round(celsius)}°C`;
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  };

  // Hàm format thời gian (Thứ, ngày)
  const formatDay = (dateString) => {
    const date = new Date(dateString);
    const days = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Hàm format giờ cập nhật
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container">
      
      {/* CỘT TRÁI: SIDEBAR */}
      <div className="sidebar">
        <h2>Thời tiết Việt Nam</h2>
        <br/>
        
        {/* YC5: Đổi C / F */}
        <div className="unit-toggle">
          <button 
            className={unit === 'C' ? 'active-unit' : ''} 
            onClick={() => setUnit('C')}
          > °C </button>
          <button 
            className={unit === 'F' ? 'active-unit' : ''} 
            onClick={() => setUnit('F')}
          > °F </button>
        </div>

        {/* YC1: Danh sách 8 thành phố */}
        <div className="city-list">
          {cities.map((city) => (
            <div 
              key={city.name}
              className={`city-item ${selectedCity?.name === city.name ? 'active' : ''}`}
              onClick={() => handleCityClick(city)}
            >
              {city.name}
            </div>
          ))}
        </div>
      </div>

      {/* CỘT PHẢI: MAIN CONTENT */}
      <div className="main-content">
        
        {/* YC4: Trạng thái Chưa chọn */}
        {status === 'UNSELECTED' && (
          <div className="status-msg">
            Hãy chọn một thành phố bên trái để xem thời tiết.
          </div>
        )}

        {/* YC4: Trạng thái Đang tải */}
        {status === 'LOADING' && (
          <div className="status-msg">
            Đang tải dữ liệu thời tiết... ⏳
          </div>
        )}

        {/* YC4: Trạng thái Lỗi (Có nút thử lại) */}
        {status === 'ERROR' && (
          <div className="status-msg">
            <p>Có lỗi xảy ra khi lấy dữ liệu! ❌</p>
            <button className="btn-retry" onClick={() => fetchWeather(selectedCity)}>
              Thử lại
            </button>
          </div>
        )}

        {/* HIỂN THỊ DỮ LIỆU KHI THÀNH CÔNG */}
        {status === 'SUCCESS' && weatherData && (
          <div>
            <h2 style={{marginBottom: '20px'}}>{selectedCity.name}</h2>
            
            {/* YC2: Thời tiết hiện tại */}
            {(() => {
              const current = weatherData.current;
              const info = getWeatherInfo(current.weather_code);
              return (
                <div className="current-weather">
                  <div className="current-icon">{info.icon}</div>
                  <h3>{info.desc}</h3>
                  <div className="current-temp">
                    {formatTemp(current.temperature_2m)}
                  </div>
                  <div className="current-details">
                    <span>💧 Độ ẩm: {current.relative_humidity_2m}%</span>
                    <span>💨 Gió: {current.wind_speed_10m} km/h</span>
                  </div>
                  <p style={{marginTop: '15px', fontSize: '0.85rem', color: '#888'}}>
                    Cập nhật lúc: {formatTime(current.time)}
                  </p>
                </div>
              );
            })()}

            <h3 style={{marginBottom: '15px', marginTop: '30px'}}>Dự báo 7 ngày tới</h3>
            
            {/* YC3: Dự báo 7 ngày */}
            <div className="forecast-container">
              {weatherData.daily.time.map((dateStr, index) => {
                const info = getWeatherInfo(weatherData.daily.weather_code[index]);
                return (
                  <div className="forecast-card" key={index}>
                    <div className="date">{formatDay(dateStr)}</div>
                    <div className="icon">{info.icon}</div>
                    <div className="desc" style={{fontSize:'0.85rem', marginBottom:'8px'}}>{info.desc}</div>
                    <div className="temps">
                      <span style={{color: '#ef4444'}}>
                        {formatTemp(weatherData.daily.temperature_2m_max[index])}
                      </span>
                      {' - '}
                      <span style={{color: '#3b82f6'}}>
                        {formatTemp(weatherData.daily.temperature_2m_min[index])}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;