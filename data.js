// Danh sách 8 thành phố theo yêu cầu
export const cities = [
  { name: 'Hà Nội', lat: 21.0285, lon: 105.8542 },
  { name: 'Hải Phòng', lat: 20.8449, lon: 106.6881 },
  { name: 'Huế', lat: 16.4637, lon: 107.5909 },
  { name: 'Đà Nẵng', lat: 16.0544, lon: 108.2022 },
  { name: 'Nha Trang', lat: 12.2388, lon: 109.1967 },
  { name: 'Đà Lạt', lat: 11.9404, lon: 108.4583 },
  { name: 'TP. Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
  { name: 'Cần Thơ', lat: 10.0452, lon: 105.7469 }
];

// Hàm map mã thời tiết WMO sang Icon và Mô tả tiếng Việt
export const getWeatherInfo = (code) => {
  const codes = {
    0: { desc: 'Trời quang', icon: '☀️' },
    1: { desc: 'Chủ yếu quang đãng', icon: '🌤️' },
    2: { desc: 'Có mây', icon: '⛅' },
    3: { desc: 'Nhiều mây âm u', icon: '☁️' },
    45: { desc: 'Sương mù', icon: '🌫️' },
    48: { desc: 'Sương muối', icon: '🌫️' },
    51: { desc: 'Mưa phùn nhẹ', icon: '🌧️' },
    53: { desc: 'Mưa phùn vừa', icon: '🌧️' },
    55: { desc: 'Mưa phùn dày', icon: '🌧️' },
    61: { desc: 'Mưa rào nhẹ', icon: '🌦️' },
    63: { desc: 'Mưa vừa', icon: '🌧️' },
    65: { desc: 'Mưa to', icon: '🌧️' },
    71: { desc: 'Tuyết rơi nhẹ', icon: '❄️' },
    80: { desc: 'Mưa rào nhẹ', icon: '🌦️' },
    81: { desc: 'Mưa rào', icon: '🌧️' },
    82: { desc: 'Mưa rào dữ dội', icon: '⛈️' },
    95: { desc: 'Dông sét', icon: '🌩️' },
    96: { desc: 'Dông kèm mưa đá', icon: '⛈️' },
    99: { desc: 'Dông bão lớn', icon: '⛈️' }
  };
  return codes[code] || { desc: 'Không xác định', icon: '🌡️' };
};