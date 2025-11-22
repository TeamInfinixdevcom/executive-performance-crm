/**
 * Weather Widget Module
 * Executive Performance - CRM
 * Uses OpenWeatherMap Free API (no authentication required for free tier with IP geolocation)
 */

class WeatherWidget {
    constructor() {
        this.weatherData = null;
        this.updateInterval = null;
    }

    /**
     * Initialize weather widget
     */
    async init() {
        this.updateDateTime();
        this.updateInterval = setInterval(() => this.updateDateTime(), 60000); // Update every minute
        
        // Mostrar fallback inmediatamente
        this.renderFallback();
        
        // Intentar cargar clima con timeout
        const weatherPromise = this.fetchWeather();
        const timeoutPromise = new Promise((resolve) => 
            setTimeout(() => resolve(null), 5000) // 5 segundo timeout
        );
        
        try {
            await Promise.race([weatherPromise, timeoutPromise]);
        } catch (error) {
            console.log('Weather API timeout or error:', error.message);
        }
    }

    /**
     * Update date and time display
     */
    updateDateTime() {
        const element = document.getElementById('weatherDateTime');
        if (!element) return;

        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const date = now.toLocaleDateString('es-ES', options);
        const time = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });

        element.textContent = `${date} • ${time}`;
    }

    /**
     * Fetch weather using IP geolocation and OpenWeatherMap
     */
    async fetchWeather() {
        try {
            // Get user's coordinates using browser geolocation
            const coords = await this.getCoordinates();
            
            // Fetch weather from Open-Meteo (free, no API key required)
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code,relative_humidity_2m&temperature_unit=celsius&timezone=auto`,
                { timeout: 4000 }
            );
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            
            const data = await response.json();
            if (!data.current) {
                throw new Error('No weather data in response');
            }
            
            const current = data.current;
            
            this.weatherData = {
                temp: Math.round(current.temperature_2m),
                humidity: current.relative_humidity_2m,
                weatherCode: current.weather_code,
                description: this.getWeatherDescription(current.weather_code)
            };
            
            this.render();
            console.log('✅ Weather loaded:', this.weatherData);
        } catch (error) {
            console.warn('⚠️ Error fetching weather:', error.message);
            this.renderFallback();
        }
    }

    /**
     * Get user coordinates using browser geolocation with timeout
     */
    getCoordinates() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                // Geolocation no disponible, usar coordenadas por defecto de Costa Rica
                resolve({lat: 9.9281, lon: -84.0907});
                return;
            }

            // Timeout de 4 segundos para geolocalización
            const timeoutId = setTimeout(() => {
                console.log('Geolocation timeout, using default coordinates');
                resolve({lat: 9.9281, lon: -84.0907});
            }, 4000);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    clearTimeout(timeoutId);
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    clearTimeout(timeoutId);
                    console.log('Geolocation error, using default coordinates:', error.message);
                    // Use default coordinates (San José, Costa Rica) if geolocation fails
                    resolve({lat: 9.9281, lon: -84.0907});
                }
            );
        });
    }

    /**
     * Get weather description based on WMO code
     */
    getWeatherDescription(code) {
        const descriptions = {
            0: '☀️ Despejado',
            1: '🌤️ Mayormente despejado',
            2: '⛅ Nublado parcial',
            3: '☁️ Nublado',
            45: '🌫️ Neblina',
            48: '🌫️ Neblina',
            51: '🌧️ Lluvia ligera',
            53: '🌧️ Lluvia moderada',
            55: '⛈️ Lluvia fuerte',
            61: '🌧️ Lluvia',
            63: '🌧️ Lluvia moderada',
            65: '⛈️ Lluvia fuerte',
            80: '🌧️ Lluvia moderada',
            81: '⛈️ Lluvia fuerte',
            82: '⛈️ Lluvia muy fuerte',
            95: '⛈️ Tormenta',
            96: '⛈️ Tormenta con granizo',
            99: '⛈️ Tormenta fuerte'
        };
        return descriptions[code] || '🌤️ Clima';
    }

    /**
     * Render weather widget
     */
    render() {
        const weatherInfo = document.getElementById('weatherInfo');
        if (!weatherInfo || !this.weatherData) {
            this.renderFallback();
            return;
        }

        weatherInfo.innerHTML = `
            <div class="weather-detail">
                <span class="weather-icon">${this.weatherData.description}</span>
                <span class="weather-temp">${this.weatherData.temp}°C</span>
            </div>
        `;
        weatherInfo.style.opacity = '1';
    }

    /**
     * Render fallback (time only, no weather)
     */
    renderFallback() {
        const weatherInfo = document.getElementById('weatherInfo');
        if (!weatherInfo) return;

        const hour = new Date().getHours();
        const emoji = hour >= 6 && hour < 12 ? '🌅' : hour >= 12 && hour < 18 ? '☀️' : '🌙';

        weatherInfo.innerHTML = `
            <div class="weather-detail">
                <span class="weather-icon">${emoji}</span>
            </div>
        `;
        weatherInfo.style.opacity = '0.7';
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize on load
window.WeatherWidget = WeatherWidget;

document.addEventListener('DOMContentLoaded', () => {
    const widget = new WeatherWidget();
    widget.init();
});
