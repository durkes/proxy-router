const domainToPort = {
    'localhost': 3001,
    'localhost:3000': 3001,
    'example.com': 3002,
    'api.example.com': 3003,
    // Add more domains and their corresponding ports as needed
};

module.exports = domainToPort;