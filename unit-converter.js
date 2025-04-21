document.addEventListener('DOMContentLoaded', () => {
    const units = {
        length: {
            meter: 1,
            kilometer: 0.001,
            centimeter: 100,
            millimeter: 1000,
            inch: 39.3701,
            foot: 3.28084,
            yard: 1.09361,
            mile: 0.000621371
        },
        weight: {
            kilogram: 1,
            gram: 1000,
            milligram: 1000000,
            pound: 2.20462,
            ounce: 35.274,
            ton: 0.001
        },
        temperature: {
            celsius: 'C',
            fahrenheit: 'F',
            kelvin: 'K'
        },
        area: {
            'square meter': 1,
            'square kilometer': 0.000001,
            'square centimeter': 10000,
            'square millimeter': 1000000,
            'square inch': 1550,
            'square foot': 10.7639,
            'square yard': 1.19599,
            'acre': 0.000247105,
            'hectare': 0.0001
        },
        volume: {
            'cubic meter': 1,
            'liter': 1000,
            'milliliter': 1000000,
            'cubic inch': 61023.7,
            'cubic foot': 35.3147,
            'gallon (US)': 264.172,
            'quart (US)': 1056.69,
            'pint (US)': 2113.38,
            'cup (US)': 4226.75
        },
        time: {
            second: 1,
            minute: 1/60,
            hour: 1/3600,
            day: 1/86400,
            week: 1/604800,
            month: 1/2592000,
            year: 1/31536000
        },
        speed: {
            'meters per second': 1,
            'kilometers per hour': 3.6,
            'miles per hour': 2.23694,
            'knots': 1.94384,
            'feet per second': 3.28084
        },
        pressure: {
            'pascal': 1,
            'bar': 0.00001,
            'psi': 0.000145038,
            'atmosphere': 9.86923e-6,
            'torr': 0.00750062
        },
        energy: {
            'joule': 1,
            'calorie': 0.239006,
            'kilocalorie': 0.000239006,
            'watt-hour': 0.000277778,
            'kilowatt-hour': 2.77778e-7
        },
        data: {
            'byte': 1,
            'kilobyte': 0.001,
            'megabyte': 1e-6,
            'gigabyte': 1e-9,
            'terabyte': 1e-12,
            'bit': 8
        }
    };

    const elements = {
        category: document.getElementById('category'),
        fromUnit: document.getElementById('fromUnit'),
        toUnit: document.getElementById('toUnit'),
        fromValue: document.getElementById('fromValue'),
        toValue: document.getElementById('toValue'),
        convertBtn: document.getElementById('convertBtn'),
        swapBtn: document.getElementById('swapBtn'),
        historyList: document.getElementById('historyList'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn')
    };

    let conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];

    function updateUnitOptions() {
        const category = elements.category.value;
        const categoryUnits = units[category];
        
        if (!categoryUnits) {
            console.error('No units found for category:', category);
            return;
        }

        elements.fromUnit.innerHTML = '';
        elements.toUnit.innerHTML = '';
        
        Object.keys(categoryUnits).forEach(unit => {
            elements.fromUnit.add(new Option(unit, unit));
            elements.toUnit.add(new Option(unit, unit));
        });
        
        if (elements.toUnit.options.length > 1) {
            elements.toUnit.selectedIndex = 1;
        }
    }

    elements.category.addEventListener('change', updateUnitOptions);
    updateUnitOptions(); // Call this on page load to initialize the units
});

function convertTemperature(value, from, to) {
        let celsius;
        
        // Convert to Celsius first
        switch(from) {
            case 'celsius': celsius = value; break;
            case 'fahrenheit': celsius = (value - 32) * 5/9; break;
            case 'kelvin': celsius = value - 273.15; break;
        }
        
        // Convert from Celsius to target unit
        switch(to) {
            case 'celsius': return celsius;
            case 'fahrenheit': return celsius * 9/5 + 32;
            case 'kelvin': return celsius + 273.15;
        }
    }

    function convert() {
        const category = elements.category.value;
        const fromUnit = elements.fromUnit.value;
        const toUnit = elements.toUnit.value;
        const fromValue = parseFloat(elements.fromValue.value);

        if (isNaN(fromValue)) {
            alert('Please enter a valid number');
            return;
        }

        let result;
        if (category === 'temperature') {
            result = convertTemperature(fromValue, fromUnit, toUnit);
        } else {
            const categoryUnits = units[category];
            result = (fromValue / categoryUnits[fromUnit]) * categoryUnits[toUnit];
        }

        elements.toValue.value = result.toFixed(2);
        addToHistory(fromValue, fromUnit, result, toUnit, category);
    }

    function addToHistory(fromValue, fromUnit, toValue, toUnit, category) {
        const historyItem = {
            fromValue,
            fromUnit,
            toValue,
            toUnit,
            category,
            timestamp: new Date().toISOString()
        };

        conversionHistory.unshift(historyItem);
        if (conversionHistory.length > 10) conversionHistory.pop();
        
        localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
        updateHistory();
    }

    function